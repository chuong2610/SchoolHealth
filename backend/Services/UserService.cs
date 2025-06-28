using System.Globalization;
using System.Runtime.InteropServices;
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
        private readonly IStudentService _studentService;
        public UserService(IUserRepository userRepository, IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor, IStudentService studentService)
        {
            _userRepository = userRepository;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
            _studentService = studentService;
        }

        public async Task<bool> CreateUserAsync(CreateUserRequest userRequest)
        {
            // Map CreateUserRequest to User model
            var user = new User
            {
                Name = userRequest.Name,
                Email = userRequest.Email,
                Password = "defaultPassword",
                Address = userRequest.Address,
                Phone = userRequest.Phone,
                Gender = userRequest.Gender,
                RoleId = userRequest.RoleId,
                DateOfBirth = userRequest.DateOfBirth
            };
            // Check if the user already exists by email
            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return false; // User already exists
            }
            user.IsActive = true;
            return await _userRepository.CreateUserAsync(user);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }
        public async Task<User?> GetUserByPhoneAsync(string phone)
        {
            return await _userRepository.GetUserByPhoneAsync(phone);
        }
        public async Task<bool> UpdateUserAsync(UserDetailDTO user)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(user.Id);
            if (existingUser == null)
            {
                return false;
            }
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Address = user.Address;
            existingUser.Phone = user.Phone;
            existingUser.Gender = user.Gender;
            existingUser.DateOfBirth = user.DateOfBirth;
            return await _userRepository.UpdateUserAsync(existingUser);
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            var students = await _studentService.GetStudentIdsByParentIdAsync(id);
            foreach (var student in students)
            {
               await _studentService.DeleteStudentAsync(student.Id);
            }
            return await _userRepository.DeleteUserAsync(id);
        }
        public async Task<PageResult<UserDTO>> GetAllUsersAsync(int pageNumber, int pageSize, string? search)
        {
            DateOnly? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateOnly.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var totalItems = await _userRepository.CountUsersAsync(search, searchDate);
            var users = await _userRepository.GetAllUsersAsync(pageNumber, pageSize, search, searchDate);

            var userDtos = users.Select(MapToUserDTO).ToList();

            return new PageResult<UserDTO>
            {
                Items = userDtos,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
        }
        public async Task<PageResult<UserDTO>> GetUsersByRoleAsync(string role, int pageNumber, int pageSize, string? search)
        {
            DateOnly? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateOnly.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var totalItems = await _userRepository.CountUsersByRoleAsync(role, search, searchDate);

            var users = await _userRepository.GetUsersByRoleAsync(role, pageNumber, pageSize, search, searchDate);

            var userDtos = users.Select(MapToUserDTO).ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PageResult<UserDTO>
            {
                Items = userDtos,
                TotalItems = totalItems,
                CurrentPage = pageNumber,
                TotalPages = totalPages
            };
        }
        private UserDTO MapToUserDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Address = user.Address,
                Phone = user.Phone,
                Gender = user.Gender,
                RoleName = user.Role.Name
            };
        }

        public Task<int> GetNumberOfUsersAsync(string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                return _userRepository.GetNumberOfUsersAsync(null);
            }
            return _userRepository.GetNumberOfUsersAsync(role);
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

            // Update Name
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                existingUserProfile.Name = request.Name;
            }

            // Update Phone
            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                existingUserProfile.Phone = request.Phone;
            }

            // Update Address
            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                existingUserProfile.Address = request.Address;
            }

            // Update Gender
            if (!string.IsNullOrWhiteSpace(request.Gender))
            {
                existingUserProfile.Gender = request.Gender;
            }

            // Update DateOfBirth if not null
            if (request.DateOfBirth.HasValue)
            {
                existingUserProfile.DateOfBirth = request.DateOfBirth.Value;
            }

            // Update Image if uploaded
            if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            {

                existingUserProfile.ImageUrl = request.ImageUrl;
            }

            // Save changes
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

        public async Task<IEnumerable<NurseDTO>> GetAllNursesAsync()
        {
            var nurses = await _userRepository.GetAllNursesAsync();

            var result = nurses.Select(n => new NurseDTO
            {
                Id = n.Id,
                NurseName = n.Name
            });

            return result;
        }
        public async Task<bool> UpdatePasswordAsync(LoginRequest loginRequest)
        {
            var user = await _userRepository.GetUserByPhoneAsync(loginRequest.PhoneNumber);
            if (user == null)
            {
                return false;
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(loginRequest.Password);
            var updated = await _userRepository.UpdateUserAsync(user);
            return updated;
        }
    }
}

