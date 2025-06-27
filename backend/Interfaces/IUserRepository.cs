using backend.Models;

namespace backend.Interfaces
{
        public interface IUserRepository
        {
                Task<List<User>> GetAllUsersAsync(int pageNumber, int pageSize, string? search, DateOnly? searchDate);
                Task<int> CountUsersAsync(string? search, DateOnly? searchDate);
                Task<List<User>> GetUsersByRoleAsync(string role, int pageNumber, int pageSize, string? search, DateOnly? searchDate);
                Task<int> CountUsersByRoleAsync(string role, string? search, DateOnly? searchDate);
                Task<User?> GetUserByEmailAsync(string email);
                Task<User> GetParentByStudentIdAsync(int studentId);
                Task<bool> CreateUserAsync(User user);
                Task<User?> GetUserByIdAsync(int id);
                Task<User?> GetUserByPhoneAsync(string phone);
                Task<bool> UpdateUserAsync(User user);
                Task<bool> DeleteUserAsync(int id);
                Task<int> GetNumberOfUsersAsync(string role);
                Task<List<User>> GetAllNursesAsync();
        }
}