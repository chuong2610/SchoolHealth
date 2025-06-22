using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class NotificationHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }
}