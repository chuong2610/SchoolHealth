using backend.Models;

namespace backend.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UpdateUserAsync(User user);
        Task<List<User>> GetAllNursesAsync();
    }
}