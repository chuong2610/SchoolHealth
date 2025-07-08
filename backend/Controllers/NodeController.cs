using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NodeController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IChatService _chatService;
        private readonly IConsultationAppointmentService _consultationAppointmentService;

        public NodeController(INotificationService notificationService, IChatService chatService, IConsultationAppointmentService consultationAppointmentService)
        {
            _notificationService = notificationService;
            _chatService = chatService;
            _consultationAppointmentService = consultationAppointmentService;
        }
        [HttpGet("has-notification/{userId}")]
        public async Task<IActionResult> HasNotification(int userId)
        {
            var hasNotification = await _notificationService.HasNotificationAsync(userId);
            return Ok(new { hasNotification });
        }
        [HttpGet("has-unread-message/{userId}")]
        public async Task<IActionResult> HasUnreadMessage(int userId)
        {
            var hasUnreadMessage = await _chatService.HasMessageAsync(userId);
            return Ok(new { hasUnreadMessage });
        }
        [HttpGet("has-consultation-appointment/{userId}")]
        public async Task<IActionResult> HasConsultationAppointment(int userId)
        {
            var hasConsultationAppointment = await _consultationAppointmentService.HasConsultationAppointmentTodayAsync(userId);
            return Ok(new { hasConsultationAppointment });
        }
    }
}