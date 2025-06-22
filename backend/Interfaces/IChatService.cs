using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IChatService
    {
        Task SendMessageAsync(int fromUserId, int? toUserId, string message);
        Task<List<ChatMessageDTO>> GetHistoryAsync(int userA, int userB, int skip, int take);
        Task<List<ChatMessage>> GetUnreadMessagesAsync(int userId);
        Task MarkAsReadAsync(int userA, int userB);
        Task<List<ChatPreviewDto>> GetConversationListAsync(int userId);
        // Task BroadcastMessageToNursesAsync(int fromUserId, string message);
        // Task AcceptConversationAsync(int parentId, int nurseId);
        Task<List<ChatPreviewDto>> GetUnassignedMessagesAsync();
        Task UpdateUnassignedMessagesAsync(int parentId, int nurseId);
        Task<List<ChatMessageDTO>> GetMessageRequestsAsync(int userId);
        Task<bool> HasMessageAsync(int userId);
    }
}