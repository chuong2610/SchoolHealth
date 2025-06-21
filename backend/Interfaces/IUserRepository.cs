using backend.Models;

namespace backend.Interfaces
{
        public interface IUserRepository
        {
                Task<List<User>> GetAllUsersAsync();
                Task<List<User>> GetUsersByRoleAsync(string role, int pageNumber, int pageSize);
                Task<int> CountUsersByRoleAsync(string role);
                Task<User?> GetUserByEmailAsync(string email);
                Task<bool> CreateUserAsync(User user);
                Task<User?> GetUserByIdAsync(int id);
                Task<User?> GetUserByPhoneAsync(string phone);
                Task<bool> UpdateUserAsync(User user);
                Task<bool> DeleteUserAsync(int id);
                Task<int> GetNumberOfUsersAsync(string role);
                Task<List<User>> GetAllNursesAsync();
        }
}