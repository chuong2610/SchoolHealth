namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateTokenAsync(string email);
    }
}