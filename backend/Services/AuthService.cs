using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRedisService _redisService;
        private readonly IEmailService _emailService;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthService(IConfiguration configuration, IUserRepository userRepository, IRedisService redisService, IEmailService emailService, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _redisService = redisService;
            _emailService = emailService;
            _httpClientFactory = httpClientFactory;
        }

        private string GenerateToken(User user)
        {
            var securityKey = _configuration["Jwt:Key"];
            var formatKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            var credentials = new SigningCredentials(formatKey, SecurityAlgorithms.HmacSha256);
            var clamims = new[]{
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
           };
            var token = new JwtSecurityToken(
                 issuer: _configuration["Jwt:Issuer"],
                 audience: _configuration["Jwt:Audience"],
                 claims: clamims,
                 expires: DateTime.Now.AddMinutes(1000),
                 signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthDTO> Login(LoginRequest loginRequest)
        {
            // Validate the user credentials
            var user = await _userRepository.GetUserByPhoneAsync(loginRequest.PhoneNumber);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
            {
                return null;
            }

            return new AuthDTO
            {
                Token = GenerateToken(user),
                UserId = user.Id,
                RoleName = user.Role.Name
            };
        }
        public async Task<bool> IsVerified(string phone)
        {
            var user = await _userRepository.GetUserByPhoneAsync(phone);
            if (user == null)
            {
                throw new Exception("Số điện thoại không tồn tại.");
            }
            return user.IsVerified;
        }
        public async Task<bool> SendOtpAsync(string phone)
        {
            var user = await _userRepository.GetUserByPhoneAsync(phone);
            if (user == null)
            {
                throw new Exception("Số điện thoại không tồn tại.");
            }
            var otp = new Random().Next(0, 999999).ToString("D6");
            await _redisService.SetOtpAsync(phone, otp);

            var emailBody = $@"
                <table width='100%' cellpadding='0' cellspacing='0' style='font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                <tr>
                    <td align='center'>
                    <table width='500' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 6px;'>
                        <tr>
                        <td style='background-color: #4fc3f7; color: #ffffff; padding: 15px; text-align: center;'>
                            <h2 style='margin: 0; font-size: 20px;'>Mã OTP Y tế học đường</h2>
                        </td>
                        </tr>
                        <tr>
                        <td style='padding: 20px; text-align: center;'>
                            <p style='font-size: 16px; color: #333333; margin: 0 0 15px;'>Kính gửi Quý phụ huynh,</p>
                            <p style='font-size: 16px; color: #333333; margin: 0 0 15px;'>Mã OTP để xác thực tài khoản của quý phụ huynh là:</p>
                            <div style='font-size: 28px; font-weight: bold; color: #4fc3f7; margin: 15px 0; letter-spacing: 3px;'>{otp}</div>
                            <p style='font-size: 14px; color: #666666; margin: 15px 0;'>Mã này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ với bất kỳ ai.</p>
                            <p style='font-size: 14px; color: #666666;'>Nếu không yêu cầu mã này, xin bỏ qua email.</p>
                        </td>
                        </tr>
                        <tr>
                        <td style='text-align: center; padding: 10px;'>
                            <p style='font-size: 12px; color: #999999; margin: 0;'>© 2025 Y tế học đường</p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>";

            await _emailService.SendEmailAsync(user.Email, "Your OTP", emailBody);

            return true;
        }
        public async Task<bool> VerifyOtpAsync(string phone, string otp)
        {
            var storedOtp = await _redisService.GetOtpAsync(phone);
            if (storedOtp == null || storedOtp != otp)
            {
                return false;
            }
            await _redisService.RemoveOtpAsync(phone); // Xóa OTP sau khi xác thực thành công
            var user = await _userRepository.GetUserByPhoneAsync(phone);
            if (user != null)
            {
                user.IsVerified = true;
                await _userRepository.UpdateUserAsync(user);
            }
            return true;
        }

        public async Task<AuthDTO> LoginWithGoogleAsync(GoogleAuthRequest request)
        {
            var client = _httpClientFactory.CreateClient();
            var values = new Dictionary<string, string>
        {
            { "code", request.Code },
            { "client_id", _configuration["Google:ClientId"] },
            { "client_secret", _configuration["Google:ClientSecret"] },
            { "redirect_uri", request.RedirectUri },
            { "grant_type", "authorization_code" }
        };
            var response = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(values));
            // var errorJson = await response.Content.ReadAsStringAsync();
            // Console.WriteLine("Google Token Error Response: " + errorJson);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            // Console.WriteLine($"Google Auth Response: {json}");
            var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // Console.WriteLine($"Google Auth Token: {tokenResponse?.IdToken}");
            if (tokenResponse?.IdToken == null)
                return null;

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(tokenResponse.IdToken);

            var email = jwt.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
            Console.WriteLine($"Google Auth Email: {email}");

            if (string.IsNullOrEmpty(email))
                return null;
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
                return null;

            var token = GenerateToken(user);

            return new AuthDTO
            {
                Token = token,
                UserId = user.Id,
                RoleName = user.Role.Name
            };
        }
    }
}