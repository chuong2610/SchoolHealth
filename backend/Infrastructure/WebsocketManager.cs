using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;

namespace backend.Infrastructure
{
    public class WebSocketManager
    {
        private readonly ConcurrentDictionary<int, WebSocket> _clients = new();

        public void Add(int userId, WebSocket socket) => _clients[userId] = socket;

        public void Remove(int userId) => _clients.TryRemove(userId, out _);

        public async Task Broadcast(string message)
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            foreach (var client in _clients.Values)
            {
                if (client.State == WebSocketState.Open)
                {
                    await client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}