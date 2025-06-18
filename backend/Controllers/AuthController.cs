using backend.Interfaces;
using backend.Models.Request;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                if (loginRequest == null)
                {
                    return BadRequest(new BaseResponse<string>(null, "Request body is null", false));
                }

                var authDTO = await _authService.Login(loginRequest);

                if (authDTO == null)
                {
                    return Unauthorized(new BaseResponse<string>(null, "Invalid email or password", false));
                }

                return Ok(new BaseResponse<object>(
                    authDTO,
                    "Đăng nhập thành công",
                    true
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request)
        {
            var isValid = await _authService.VerifyOtpAsync(request.PhoneNumber, request.Otp);
            if (!isValid) return BadRequest(new BaseResponse<string>(null, "OTP không hợp lệ hoặc đã hết hạn", false));
            return Ok(new BaseResponse<string>(null, "Xác thực OTP thành công", true));
        }
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] PhoneRequest request)
        {
            var isSent = await _authService.SendOtpAsync(request.PhoneNumber);
            if (!isSent) return BadRequest(new BaseResponse<string>(null, "Gửi OTP không thành công", false));
            return Ok(new BaseResponse<string>(null, "Gửi OTP thành công", true));
        }
        [HttpGet("is-verified/{phoneNumber}")]
        public async Task<IActionResult> IsVerified(string phoneNumber)
        {
            try
            {
                var isVerified = await _authService.IsVerified(phoneNumber);
                return Ok(new BaseResponse<bool>(isVerified, "Kiểm tra xác thực thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpPost("login-google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var authDTO = await _authService.LoginWithGoogleAsync(request);
                if (authDTO == null)
                {
                    return Unauthorized(new BaseResponse<string>(null, "Google login failed", false));
                }

                return Ok(new BaseResponse<object>(
                    authDTO,
                    "Đăng nhập Google thành công",
                    true
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
