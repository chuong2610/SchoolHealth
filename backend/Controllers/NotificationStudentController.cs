using backend.Interfaces;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationStudentController : ControllerBase
    {
        private readonly INotificationStudentService _notificationStudentService;
        public NotificationStudentController(INotificationStudentService notificationStudentService)
        {
            _notificationStudentService = notificationStudentService;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> createNotificationStudent([FromBody] NotificationStudentRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Request body is null", false));
                }

                var isSuccess = await _notificationStudentService.CreateNotificationStudentAsync(request);
                return Ok(new BaseResponse<bool>(isSuccess, "Tạo thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPatch]
        [Authorize]
        public async Task<IActionResult> UpdateNotificationStudent([FromBody] NotificationStudentRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Request body is null", false));
                }

                var isSuccess = await _notificationStudentService.UpdateNotificationStudentAsync(request);
                return Ok(new BaseResponse<bool>(isSuccess, "Xác nhận thành công báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}