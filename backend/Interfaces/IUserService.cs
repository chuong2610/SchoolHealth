using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsersAsync();
        Task<List<UserDTO>> GetUsersByRoleAsync(string role);
        Task<UserDetailDTO> GetUserByIdAsync(int id);
        Task<bool> CreateUserAsync(CreateUserRequest request);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByPhoneAsync(string phone);
        Task<bool> UpdateUserAsync(UserDetailDTO user);
        Task<bool> DeleteUserAsync(int id);
    }
}