using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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

        public async Task<bool> CreatedUserAsync(UserRequest request)
        {
            // Kiểm tra confirm password khớp không
            if (request.Password != request.ConfirmPassword)
            {
                return false; // Mật khẩu và confirm không khớp
            }

            // Hash mật khẩu trước khi lưu
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Tạo user mới
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = hashedPassword,
                Phone = request.Phone,
                Status = request.Status,
                RoleId = request.RoleId
            };

            await _userRepository.AddUserAsync(user);

            return true;
        }
        public async Task<bool> UpdateUserAsync(int id, UserRequest userRequest)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return false;
            }

            // Update Name if not null
            if (!string.IsNullOrWhiteSpace(userRequest.Name))
            {
                existingUser.Name = userRequest.Name;
            }

            // Kiểm tra nếu email mới không null, không trống và khác email hiện tại
            if (!string.IsNullOrWhiteSpace(userRequest.Email))
            {

                existingUser.Email = userRequest.Email;
            }

            // Update Password if not null
            if (!string.IsNullOrWhiteSpace(userRequest.Password))
            {
                // Kiểm tra mật khẩu xác nhận
                if (userRequest.Password != userRequest.ConfirmPassword)
                {
                    return false;
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userRequest.Password);
                existingUser.Password = hashedPassword;
            }

            // Update Phone if not null
            if (!string.IsNullOrWhiteSpace(userRequest.Phone))
            {
                existingUser.Phone = userRequest.Phone;
            }

            // Update Status if not null
            if (!string.IsNullOrWhiteSpace(userRequest.Status))
            {
                existingUser.Status = userRequest.Status;
            }

            // Update RoleId if not zero
            if (userRequest.RoleId != 0)
            {
                existingUser.RoleId = userRequest.RoleId;
            }

            var updated = await _userRepository.UpdateUserAsync(existingUser);
            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteUserAsync(user);
            return true;
        }

        public async Task<UserProfileDTO> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return new UserProfileDTO
            {
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
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
            return true;
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

            await _userRepository.UpdateUserAsync(user);
            return true;
        }
    }
}