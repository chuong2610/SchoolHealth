namespace backend.Interfaces
{
    public interface IRedisService
    {
        Task SetOtpAsync(string email, string otp);
        Task<string?> GetOtpAsync(string email);
        Task RemoveOtpAsync(string email);
    }
}