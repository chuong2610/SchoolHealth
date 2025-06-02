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
    }
}
