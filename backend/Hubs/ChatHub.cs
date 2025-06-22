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
    }
}