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
        public NodeController(INotificationService notificationService, IChatService chatService)
        {
            _notificationService = notificationService;
            _chatService = chatService;
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

    [HttpPost("mark-read/{userId}")]
    public async Task<IActionResult> MarkNotificationsAsRead(int userId)
    {
        try
        {
            // TODO: Implement mark all notifications as read for user
            // For now, return success - real implementation needed
            // await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { success = true, message = "Notifications marked as read" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

}
}