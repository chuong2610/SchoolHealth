using backend.Models;

namespace backend.Interfaces
{
    public interface IUserService
    {
        Task<bool> CreateUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByPhoneAsync(string phone);
    }
}