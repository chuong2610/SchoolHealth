using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpGet("parent/{parentId}")]
        [Authorize(Policy = "ParentOnly")]
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
        [Authorize(Policy = "ParentOnly")]
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
        [Authorize(Policy = "ParentOnly")]
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
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            try
            {
                var notification = await _notificationService.GetNotificationByIdAsync(id);
                if (notification == null)
                {
                    return NotFound(new BaseResponse<string>(null, "Thông báo không tồn tại", false));
                }
                return Ok(new BaseResponse<NotificationDetailDTO>(notification, "Lấy thông tin thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }    

    }
}