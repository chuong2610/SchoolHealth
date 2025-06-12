using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            var users = (await _userService.GetAllUserAsync()).ToList();
            return Ok(users);
        }


        [HttpGet("{id}/profile")]
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


    }
}