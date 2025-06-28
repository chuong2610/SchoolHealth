using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"User {Context.UserIdentifier} connected");
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"User {Context.UserIdentifier} disconnected");
            return base.OnDisconnectedAsync(exception);
        }
        
    }
}