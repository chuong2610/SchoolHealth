using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Services;
using DocumentFormat.OpenXml.Math;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            if (users == null || users.Count == 0)
            {
                return Ok(new BaseResponse<List<UserDTO>>(
                    data: null,
                    message: "No users found.",
                    success: true
                ));
            }
            return Ok(new BaseResponse<List<UserDTO>>(
                data: users,
                message: "Users retrieved successfully.",
                success: true
            ));
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role, int pageNumber, int pageSize)
        {
            var users = await _userService.GetUsersByRoleAsync(role, pageNumber, pageSize);
            if (users == null || users.Items.Count == 0)
            {
                return Ok(new BaseResponse<List<UserDTO>>(
                    data: null,
                    message: "No users found for the specified role.",
                    success: true
                ));
            }
            return Ok(new BaseResponse<PageResult<UserDTO>>(
                data: users,
                message: "Users by role retrieved successfully.",
                success: true
            ));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserRequest request)
        {
            var result = await _userService.CreateUserAsync(request);
            if (!result)
            {
                return BadRequest(new BaseResponse<bool>(
                    data: false,
                    message: "User creation failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User created successfully.",
                success: true
            ));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UserDetailDTO user)
        {
            var result = await _userService.UpdateUserAsync(user);
            if (!result)
            {
                return BadRequest(new BaseResponse<bool>(
                    data: false,
                    message: "User update failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User updated successfully.",
                success: true
            ));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound(new BaseResponse<bool>(
                    data: false,
                    message: "User not found or deletion failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User deleted successfully.",
                success: true
            ));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDTO>> GetUserProfile(int id)
        {
            var userProfile = await _userService.GetUserByIdAsync(id);
            return Ok(userProfile);
        }

        [HttpPatch("change-password/{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> ChangePassword(int id, [FromBody] UserPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword != request.ConfirmNewPassword)
            {
                return BadRequest(new BaseResponse<bool>(false, "Mật khẩu mới và xác nhận mật khẩu không khớp", false));
            }

            try
            {
                var result = await _userService.ChangePasswordAsync(id, request);

                if (!result)
                {
                    return NotFound(new BaseResponse<bool>(false, "Mật khẩu hiện tại không đúng", false));
                }

                return Ok(new BaseResponse<bool>(true, "Đổi mật khẩu thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPatch("profile/{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> UpdateUserProfile(int id, [FromBody] UserProfileRequest request)
        {
            try
            {
                var isUpdated = await _userService.UpdateUserProfileAsync(id, request);
                if (!isUpdated)
                {
                    return NotFound(new BaseResponse<bool>(false, "Không tìm thấy hồ sơ người dùng", false));
                }

                return Ok(new BaseResponse<bool>(true, "Cập nhật hồ sơ thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("nurses")]
        public async Task<IActionResult> GetAllNurses()
        {
            var nurses = await _userService.GetAllNursesAsync();
            return Ok(nurses);
        }

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new BaseResponse<bool>(false, "Invalid request", false));
            }

            var result = await _userService.UpdatePasswordAsync(request);
            if (!result)
            {
                return BadRequest(new BaseResponse<bool>(false, "Password update failed", false));
            }

            return Ok(new BaseResponse<bool>(true, "Password updated successfully", true));
        }
    }
}