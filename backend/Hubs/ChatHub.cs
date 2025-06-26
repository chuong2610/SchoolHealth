using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            var userRole = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            
            Console.WriteLine($"User {userId} ({userRole}) connected to ChatHub");

            // Add nurses to Nurses group for unassigned message broadcasting
            if (userRole == "Nurse")
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Nurses");
                Console.WriteLine($"Nurse {userId} added to Nurses group");
            }

            // Add user to their personal group
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
                Console.WriteLine($"User {userId} added to personal group");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            var userRole = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            
            Console.WriteLine($"User {userId} ({userRole}) disconnected from ChatHub");

            // Remove from groups (SignalR handles this automatically, but we log it)
            if (userRole == "Nurse")
            {
                Console.WriteLine($"Nurse {userId} removed from Nurses group");
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Allow clients to manually join user group
        public async Task JoinUserGroup(string userId)
        {
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
                Console.WriteLine($"User {Context.UserIdentifier} manually joined group User_{userId}");
            }
        }

        // Allow clients to join conversation-specific groups
        public async Task JoinConversation(string conversationId)
        {
            if (!string.IsNullOrEmpty(conversationId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
                Console.WriteLine($"User {Context.UserIdentifier} joined conversation {conversationId}");
            }
        }

        public async Task LeaveConversation(string conversationId)
        {
            if (!string.IsNullOrEmpty(conversationId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
                Console.WriteLine($"User {Context.UserIdentifier} left conversation {conversationId}");
            }
        }

        // Handle typing indicators
        public async Task StartTyping(string conversationId)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(conversationId) && !string.IsNullOrEmpty(userId))
            {
                await Clients.Group($"Conversation_{conversationId}")
                    .SendAsync("UserStartedTyping", new { userId, conversationId });
            }
        }

        public async Task StopTyping(string conversationId)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(conversationId) && !string.IsNullOrEmpty(userId))
            {
                await Clients.Group($"Conversation_{conversationId}")
                    .SendAsync("UserStoppedTyping", new { userId, conversationId });
        }
        }
    }
}