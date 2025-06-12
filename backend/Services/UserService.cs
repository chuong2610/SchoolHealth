using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(IUserRepository userRepository, IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<UserDTO>> GetAllUserAsync()
        {
            var users = await _userRepository.GetAllUserAsync();
            var UserDto = users.Select(user =>
            {
                return new UserDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Phone = user.Phone,
                    Status = user.Status,
                    RoleName = user.Role?.Name ?? string.Empty

                };
            }).ToList();
            return UserDto;
        }

        public async Task<UserProfileDTO> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var request = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            string fileName = user.ImageUrl;
            string imageUrl = $"{baseUrl}/uploads/{fileName}";
            string imagePath = Path.Combine(_environment.WebRootPath, "uploads", fileName ?? "");

            if (string.IsNullOrEmpty(fileName) || !System.IO.File.Exists(imagePath))
            {
                imageUrl = $"{baseUrl}/uploads/default.jpg";
            }
            return new UserProfileDTO
            {
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                ImageUrl = imageUrl,
                RoleName = user.Role?.Name ?? string.Empty
            };
        }

        public async Task<bool> UpdateUserProfileAsync(int id, UserProfileRequest request)
        {
            var existingUserProfile = await _userRepository.GetUserByIdAsync(id);
            if (existingUserProfile == null)
            {
                return false;
            }

            // Update Name if not null
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                existingUserProfile.Name = request.Name;
            }

            // Update Phone if not null
            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                existingUserProfile.Phone = request.Phone;
            }
            // Update Address if not null
            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                existingUserProfile.Address = request.Address;
            }
            // Update Gender if not null
            if (!string.IsNullOrWhiteSpace(request.Gender))
            {
                existingUserProfile.Gender = request.Gender;
            }
            // Update DateOfBirth if not null
            if (request.DateOfBirth != null)
            {
                existingUserProfile.DateOfBirth = request.DateOfBirth;
            }


            var updated = await _userRepository.UpdateUserAsync(existingUserProfile);
            return updated;
        }

        public async Task<bool> ChangePasswordAsync(int userId, UserPasswordRequest request)
        {
            // Tìm user theo Id
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return false; // Không tìm thấy user
            }

            // Kiểm tra mật khẩu hiện tại
            var isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
            if (!isCurrentPasswordValid)
            {
                return false; // Mật khẩu hiện tại không đúng
            }

            // Kiểm tra mật khẩu mới và confirm
            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return false; // Mật khẩu mới và confirm không khớp
            }

            // Hash mật khẩu mới và lưu
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            var updated = await _userRepository.UpdateUserAsync(user);
            return updated;
        }
    }
}