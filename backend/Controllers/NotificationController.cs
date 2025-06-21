using System.Security.Claims;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
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
        public async Task<IActionResult> GetNotificationsByParentId(int parentId, int pageNumber, int pageSize, string? search)
        {
            try
            {
                var notifications = await _notificationService
                    .GetNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search);

                return Ok(new BaseResponse<PageResult<NotificationParentDTO>>(
                    notifications,
                    "Lấy danh sách thông báo thành công",
                    true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("parent/{parentId}/HealthCheck")]
        [Authorize(Policy = "ParentOnly")]
        public async Task<IActionResult> GetHealthChecksNotificationsByParentId(int parentId, int pageNumber, int pageSize, string? search)
        {
            try
            {
                var notifications = await _notificationService.GetHealthChecksNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search);
                return Ok(new BaseResponse<PageResult<NotificationParentDTO>>(notifications, "Lấy danh sách thông báo kiểm tra sức khỏe thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("parent/{parentId}/Vaccination")]
        [Authorize(Policy = "ParentOnly")]
        public async Task<IActionResult> GetVaccinationsNotificationsByParentId(int parentId, int pageNumber, int pageSize, string? search)
        {
            try
            {
                var notifications = await _notificationService.GetVaccinationNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search);
                return Ok(new BaseResponse<PageResult<NotificationParentDTO>>(notifications, "Lấy danh sách thông báo tiêm chủng thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPost("notificationDeatil")]
        [Authorize]
        public async Task<IActionResult> GetNotificationById([FromBody] NotificationDetailRequest request)
        {
            try
            {
                var notification = await _notificationService.GetNotificationByIdAsync(request.NotificationId, request.StudentId);
                if (notification == null)
                {
                    return NotFound(new BaseResponse<string>(null, "Thông báo không tồn tại", false));
                }
                return Ok(new BaseResponse<NotificationDetailDTO>(notification, "Lấy thông tin thông báo theo studentId và notificationId thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpGet("admin/{id}")]
        public async Task<IActionResult> GetNotificationDetailAdminDTO(int id, int pageNumber, int pageSize)
        {
            try
            {
                var notification = await _notificationService
                    .GetNotificationDetailAdminDTOAsync(id, pageNumber, pageSize);

                if (notification == null)
                {
                    return NotFound(new BaseResponse<string>(null, "Thông báo không tồn tại", false));
                }

                return Ok(new BaseResponse<NotificationDetailAdminDTO>(
                    notification,
                    "Lấy thông tin chi tiết thông báo thành công",
                    true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }


        [HttpGet]
        public async Task<ActionResult<BaseResponse<PageResult<NotificationClassDTO>>>> GetAll(int pageNumber, int pageSize)
        {
            try
            {
                var notificationsPage = await _notificationService
                    .GetAllNotificationAsync(pageNumber, pageSize);

                return Ok(new BaseResponse<PageResult<NotificationClassDTO>>(
                    notificationsPage,
                    "Lấy danh sách thông báo thành công",
                    true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(
                    null,
                    $"Lỗi: {ex.Message}",
                    false));
            }
        }



        [HttpPost("notification")]
        [Authorize]
        public async Task<ActionResult<BaseResponse<object>>> CreateNotification([FromBody] NotificationRequest notificationRequest)
        {
            try
            {
                if (notificationRequest == null || notificationRequest.ClassId == 0)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Thông báo không hợp lệ hoặc chưa chọn lớp", false));
                }

                // Lấy userId từ token đăng nhập
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new BaseResponse<bool>(false, "Bạn chưa đăng nhập.", false));
                }

                int createdById = int.Parse(userIdClaim.Value);

                // Gọi service xử lý
                var isSuccess = await _notificationService.CreateAndSendNotificationAsync(
                    notificationRequest,
                    createdById
                );

                return Ok(new BaseResponse<bool>(isSuccess, "Tạo và gửi thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPatch("{id}")]
        [Authorize]
        public async Task<ActionResult<BaseResponse<object>>> UpdateNotification([FromBody] NotificationRequest notificationRequest, int id)
        {
            try
            {
                if (notificationRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Cập nhật thông báo thất bại", false));
                }

                var isSuccess = await _notificationService.UpdateNotificationAsync(id, notificationRequest);
                return Ok(new BaseResponse<bool>(isSuccess, "Cập nhật thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteNotification(int id)
        {
            try
            {
                var isDeleted = await _notificationService.DeleteNotificationAsync(id);
                if (!isDeleted)
                {
                    return NotFound(new BaseResponse<bool>(false, "Không tìm thấy thông báo cần xóa", false));
                }

                return Ok(new BaseResponse<bool>(true, "Xóa thông báo thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}