using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/parent/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetNotificationsByParentId(int parentId)
        {
            try
            {
                var notifications = await _notificationService.GetNotificationsByParentIdAsync(parentId);
                return Ok(new BaseResponse<List<NotificationDTO>>(notifications, "Lấy danh sách thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpGet("parent/{parentId}/HealthCheck")]
        public async Task<IActionResult> GetHealthChecksNotificationsByParentId(int parentId)
        {
            try
            {
                var notifications = await _notificationService.GetHealthChecksNotificationsByParentIdAsync(parentId);
                return Ok(new BaseResponse<List<NotificationDTO>>(notifications, "Lấy danh sách thông báo kiểm tra sức khỏe thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpGet("parent/{parentId}/Vaccination")]
        public async Task<IActionResult> GetVaccinationsNotificationsByParentId(int parentId)
        {
            try
            {
                var notifications = await _notificationService.GetVaccinationsNotificationsByParentIdAsync(parentId);
                return Ok(new BaseResponse<List<NotificationDTO>>(notifications, "Lấy danh sách thông báo tiêm chủng thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

    }
}