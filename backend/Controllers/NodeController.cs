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

    }
}