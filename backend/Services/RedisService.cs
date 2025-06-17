using backend.Interfaces;
using StackExchange.Redis;

public class RedisService : IRedisService
{
    private readonly IDatabase _database;
    private readonly ConnectionMultiplexer _redis;

    public RedisService(IConfiguration configuration)
    {
        var redisConnectionString = configuration.GetConnectionString("Redis");
        _redis = ConnectionMultiplexer.Connect(redisConnectionString);
        _database = _redis.GetDatabase();
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
