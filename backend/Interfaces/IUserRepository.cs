using backend.Models;

namespace backend.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<User?> AddUserAsync(User user);
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }
}