using backend.Models;

namespace backend.Interfaces
{
    public interface IChatRepository
    {
        Task SaveMessageAsync(ChatMessage msg);
        Task<List<ChatMessage>> GetChatHistory(int userA, int userB, int skip, int take);
        Task<List<ChatMessage>> GetUnreadFromRedisAsync(int userId);
        Task MarkAsReadAsync(int userA, int userB);
        Task<List<(User User, ChatMessage LastMessage)>> GetRawConversationsAsync(int userId);
        Task<List<ChatMessage>> GetUnassignedMessagesAsync();
        Task UpdateUnassignedMessagesAsync(int parentId, int nurseId);
        Task<List<ChatMessage>> GetMessageRequestsAsync(int userId);
        Task<bool> HasMessageAsync(int userId);
    }
}