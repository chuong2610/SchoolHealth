using System.Text.Json;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace backend.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _repo;
        private readonly IHubContext<ChatHub> _hub;
        private readonly IConnectionMultiplexer _redis;

        public ChatService(IChatRepository repo, IHubContext<ChatHub> hub, IConnectionMultiplexer redis)
        {
            _repo = repo;
            _hub = hub;
            _redis = redis;
        }

        public async Task SendMessageAsync(int from, int? to, string message)
        {
            var msg = new ChatMessage
            {
                FromUserId = from,
                ToUserId = to,
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            await _repo.SaveMessageAsync(msg);

            await _hub.Clients.Users(from.ToString(), to.ToString()).SendAsync("ReceiveMessage", new
            {
                from = msg.FromUserId,
                to = msg.ToUserId,
                message = msg.Message,
                timestamp = msg.Timestamp
            });
        }

        public async Task<List<ChatMessageDTO>> GetHistoryAsync(int userA, int userB, int skip, int take)
        {
            var chatHistory = await _repo.GetChatHistory(userA, userB, skip, take);
            return chatHistory.Select(msg => new ChatMessageDTO
            {
                FromUserId = msg.FromUserId,
                ToUserId = msg.ToUserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp
            }).ToList();
        }


        public Task<List<ChatMessage>> GetUnreadMessagesAsync(int userId)
            => _repo.GetUnreadFromRedisAsync(userId);

        public Task MarkAsReadAsync(int userA, int userB)
            => _repo.MarkAsReadAsync(userA, userB);

        public async Task<List<ChatPreviewDto>> GetConversationListAsync(int userId)
        {
            var redisDb = _redis.GetDatabase();
            var unreadList = await redisDb.ListRangeAsync($"chat:unread:{userId}");

            var unreadFromUsers = unreadList
                .Select(x => JsonSerializer.Deserialize<ChatMessage>(x!)?.FromUserId)
                .Where(x => x.HasValue)
                .Select(x => x.Value)
                .Distinct()
                .ToHashSet();

            var rawConversations = await _repo.GetRawConversationsAsync(userId);

            return rawConversations.Select(c => new ChatPreviewDto
            {
                User = c.User,
                LastMessage = c.LastMessage?.Message,
                Timestamp = c.LastMessage?.Timestamp ?? DateTime.MinValue,
                HasUnread = unreadFromUsers.Contains(c.User)
            }).ToList();
        }

        public async Task<List<ChatPreviewDto>> GetUnassignedMessagesAsync()
        {
            var rawConversations = await _repo.GetUnassignedMessagesAsync();
            return rawConversations.Select(c => new ChatPreviewDto
            {
                User = c.FromUserId,
                LastMessage = c.Message,
                Timestamp = c?.Timestamp ?? DateTime.MinValue,
                HasUnread = false
            }).ToList();
        }

        public Task UpdateUnassignedMessagesAsync(int parentId, int nurseId)
        {
            return _repo.UpdateUnassignedMessagesAsync(parentId, nurseId);
        }

        public async Task<List<ChatMessageDTO>> GetMessageRequestsAsync(int userId)
        {
            var messages = await _repo.GetMessageRequestsAsync(userId);
            return messages.Select(msg => new ChatMessageDTO
            {
                FromUserId = msg.FromUserId,
                ToUserId = msg.ToUserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp
            }).ToList();
        }
        public Task<bool> HasMessageAsync(int userId)
        {
            return _repo.HasMessageAsync(userId);
        }
        // public async Task BroadcastMessageToNursesAsync(int fromUserId, string message)
        // {
        //     var assigned = await _repo.GetAssignedNurseAsync(fromUserId);
        //     if (assigned.HasValue)
        //     {
        //         await SendMessageAsync(fromUserId, assigned.Value, message);
        //     }
        //     else
        //     {
        //         foreach (var nurseId in _nurseIds)
        //         {
        //             await SendMessageAsync(fromUserId, nurseId, message);
        //         }
        //     }
        // }
        //  public Task AcceptConversationAsync(int parentId, int nurseId) => _repo.AssignNurseAsync(parentId, nurseId);


    }
}