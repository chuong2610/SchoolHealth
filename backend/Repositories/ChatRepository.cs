using System.Text.Json;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace backend.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConnectionMultiplexer _redis;

        public ChatRepository(ApplicationDbContext context, IConnectionMultiplexer redis)
        {
            _context = context;
            _redis = redis;
        }

        public async Task SaveMessageAsync(ChatMessage msg)
        {
            _context.ChatMessages.Add(msg);
            await _context.SaveChangesAsync();

            var dbRedis = _redis.GetDatabase();
            var key = $"chat:unread:{msg.ToUserId}";
            var json = JsonSerializer.Serialize(msg);
            await dbRedis.ListRightPushAsync(key, json);
        }

        public async Task<List<ChatMessage>> GetChatHistory(int userA, int userB, int skip, int take)
        {
            return await _context.ChatMessages
            .Include(x => x.FromUser)
            .Include(x => x.ToUser)
            .Where(x => (x.FromUserId == userA && x.ToUserId == userB) ||
                        (x.FromUserId == userB && x.ToUserId == userA))
            .OrderByDescending(x => x.Timestamp)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
        }

        public async Task<List<ChatMessage>> GetUnreadFromRedisAsync(int userId)
        {
            var dbRedis = _redis.GetDatabase();
            var key = $"chat:unread:{userId}";
            var values = await dbRedis.ListRangeAsync(key);
            return values.Select(x => JsonSerializer.Deserialize<ChatMessage>(x!)).ToList();
        }

        public async Task MarkAsReadAsync(int userA, int userB)
        {
            var messages = await _context.ChatMessages
            .Where(x => x.FromUserId == userB && x.ToUserId == userA && !x.IsRead)
            .ToListAsync();

            foreach (var msg in messages)
                msg.IsRead = true;

            await _context.SaveChangesAsync();

            var dbRedis = _redis.GetDatabase();
            await dbRedis.KeyDeleteAsync($"chat:unread:{userA}");
        }

        public async Task<List<(int User, ChatMessage LastMessage)>> GetRawConversationsAsync(int userId)
        {
            var all = await _context.ChatMessages
                .Where(x => x.FromUserId == userId || x.ToUserId == userId)
                .OrderByDescending(x => x.Timestamp)
                .GroupBy(x => x.FromUserId == userId ? x.ToUserId : x.FromUserId)

                .Select(g => new
                {
                    User = g.Key,
                    LastMessage = g.OrderByDescending(x => x.Timestamp).FirstOrDefault()
                })
                .ToListAsync();

            return all
                .Where(x => x.User != null && x.LastMessage != null)
                .Select(x => (x.User!.Value, x.LastMessage!))
                .ToList();
        }
        public async Task<List<ChatMessage>> GetUnassignedMessagesAsync()
        {
            var all = await _context.ChatMessages
                .Where(x => x.ToUserId == null)
                .OrderByDescending(x => x.Timestamp)
                .GroupBy(x => x.FromUserId)
                .Select(g => new
                {
                    User = g.Key,
                    LastMessage = g.OrderByDescending(x => x.Timestamp).FirstOrDefault()
                })
                .ToListAsync();

            return all
                .Where(x => x.LastMessage != null)
                .Select(x => x.LastMessage!)
                .ToList();
        }
        public async Task UpdateUnassignedMessagesAsync(int parentId, int nurseId)
        {
            var messages = await _context.ChatMessages
                .Where(x => x.FromUserId == parentId && x.ToUserId == null)
                .ToListAsync();

            foreach (var msg in messages)
            {
                msg.ToUserId = nurseId;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<ChatMessage>> GetMessageRequestsAsync(int userId)
        {
            var messages = await _context.ChatMessages
                .Where(x => x.ToUserId == null && x.FromUserId == userId)
                .OrderByDescending(x => x.Timestamp)
                .ToListAsync();

            return messages.Select(msg => new ChatMessage
            {
                FromUserId = msg.FromUserId,
                ToUserId = msg.ToUserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp
            }).ToList();
        }

        public async Task<bool> HasMessageAsync(int userId)
        {
            var dbRedis = _redis.GetDatabase();
            var key = $"chat:unread:{userId}";
            return await dbRedis.ListLengthAsync(key) > 0;
        }      
    }
}