using backend.Interfaces;
using backend.Models.Request;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest model)
        {
            await _chatService.SendMessageAsync(model.FromUserId, model.ToUserId, model.Message);
            return Ok();
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(int userA, int userB, int skip = 0, int take = 50)
        {
            var data = await _chatService.GetHistoryAsync(userA, userB, skip, take);
            await _chatService.MarkAsReadAsync(userA, userB);
            return Ok(data);
        }

        // [HttpGet("unread")]
        // public async Task<IActionResult> GetUnread(int userId)
        // {
        //     var data = await _chatService.GetUnreadMessagesAsync(userId);
        //     return Ok(data);
        // }

        // [HttpPost("mark-read")]
        // public async Task<IActionResult> MarkAsRead([FromBody] MarkReadRequest model)
        // {
        //     await _chatService.MarkAsReadAsync(model.UserId, model.FromUser);
        //     return Ok();
        // }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int userId)
        {
            var data = await _chatService.GetConversationListAsync(userId);
            return Ok(data);
        }
        [HttpGet("unassigned")]
        public async Task<IActionResult> GetUnassignedMessages()
        {
            var data = await _chatService.GetUnassignedMessagesAsync();
            return Ok(data);
        }
        [HttpPost("assign")]
        public async Task<IActionResult> AssignMessage([FromBody] AssignNurseRequest model)
        {
            await _chatService.UpdateUnassignedMessagesAsync(model.ParentId, model.NurseId);
            return Ok();
        }
        [HttpGet("requests")]
        public async Task<IActionResult> GetMessageRequests([FromQuery] int userId)
        {
            var data = await _chatService.GetMessageRequestsAsync(userId);
            return Ok(data);
        }

        


        // [HttpPost("broadcast")]
        // public async Task<IActionResult> Broadcast([FromBody] ChatMessageRequest model)
        // {
        //     await _chatService.BroadcastMessageToNursesAsync(model.FromUserId, model.Message);
        //     return Ok();
        // }
        // [HttpPost("accept")]
        // public async Task<IActionResult> Accept([FromQuery] int parentId, [FromQuery] int nurseId)
        // {
        //     await _chatService.AcceptConversationAsync(parentId, nurseId);
        //     return Ok();
        // }

    }
}