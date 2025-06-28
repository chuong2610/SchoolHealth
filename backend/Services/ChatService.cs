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
            var utcTime = DateTime.UtcNow;
            var vnTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime,
                TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            var msg = new ChatMessage
            {
                FromUserId = from,
                ToUserId = to,
                Message = message,
                Timestamp = vnTime
            };

            await _repo.SaveMessageAsync(msg);

            // Prepare message data for SignalR broadcast
            var messageData = new
            {
                fromUserId = msg.FromUserId,
                toUserId = msg.ToUserId,
                message = msg.Message,
                timestamp = msg.Timestamp,
                id = msg.Id // Include message ID if available
            };

            // Send to recipient if specified
            if (msg.ToUserId.HasValue)
            {
                await _hub.Clients.User(msg.ToUserId.ToString()).SendAsync("ReceiveMessage", messageData);
            }

            // Also send to sender for confirmation (different event to avoid loops)
            await _hub.Clients.User(msg.FromUserId.ToString()).SendAsync("MessageSent", messageData);

            // If this is an unassigned message (ToUserId is null), broadcast to all nurses
            if (!msg.ToUserId.HasValue)
            {
                await _hub.Clients.Group("Nurses").SendAsync("NewUnassignedMessage", messageData);
            }
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
                UserId = c.User.Id,
                UserName = c.User.Name,
                UserImage = string.IsNullOrEmpty(c.User.ImageUrl)
                    ? "http://localhost:5182/uploads/default.png"
                    : "http://localhost:5182/uploads/" + c.User.ImageUrl,
                LastMessage = c.LastMessage?.Message,
                Timestamp = c.LastMessage?.Timestamp ?? DateTime.MinValue,
                HasUnread = unreadFromUsers.Contains(c.User.Id)
            }).ToList();
        }

        public async Task<List<ChatPreviewDto>> GetUnassignedMessagesAsync()
        {
            var rawConversations = await _repo.GetUnassignedMessagesAsync();
            return rawConversations.Select(c => new ChatPreviewDto
            {
                UserId = c.FromUserId,
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