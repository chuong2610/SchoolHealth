using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class NotificationHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }
    public async Task JoinClassGroup(string classId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, classId);
    }
    public async Task LeaveClassGroup(string classId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, classId);
    }
}