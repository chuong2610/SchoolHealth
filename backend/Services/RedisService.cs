using backend.Interfaces;
using StackExchange.Redis;

public class RedisService : IRedisService
{
   private readonly IDatabase _database;

    public RedisService(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task SetOtpAsync(string phone, string otp)
    {
        await _database.StringSetAsync($"otp:{phone}", otp, TimeSpan.FromSeconds(120));
    }

    public async Task<string?> GetOtpAsync(string phone)
    {
        return await _database.StringGetAsync($"otp:{phone}");
    }

    public async Task RemoveOtpAsync(string phone)
    {
        await _database.KeyDeleteAsync($"otp:{phone}");
    }
}
