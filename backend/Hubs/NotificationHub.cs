using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class NotificationHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }
    public async Task JoinClassGroup(string className)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, className);
        await Clients.Caller.SendAsync("JoinedGroup", $"Joined class group: {className}");
    }
    public async Task LeaveClassGroup(string className)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, className);
        await Clients.Caller.SendAsync("LeftGroup", $"Left class group: {className}");
    }
}