using backend.Models;

namespace backend.Interfaces
{
     public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
    }
}