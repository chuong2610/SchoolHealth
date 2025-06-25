using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IUserService
    {

        Task<PageResult<UserDTO>> GetAllUsersAsync(int pageNumber, int pageSize, string? search);
        Task<PageResult<UserDTO>> GetUsersByRoleAsync(string role, int pageNumber, int pageSize, string? search);
        Task<bool> CreateUserAsync(CreateUserRequest request);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByPhoneAsync(string phone);
        Task<bool> UpdateUserAsync(UserDetailDTO user);
        Task<bool> DeleteUserAsync(int id);
        Task<int> GetNumberOfUsersAsync(string role);
        Task<UserProfileDTO> GetUserByIdAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, UserPasswordRequest request);
        Task<bool> UpdateUserProfileAsync(int id, UserProfileRequest request);
        Task<IEnumerable<NurseDTO>> GetAllNursesAsync();
        Task<bool> UpdatePasswordAsync(LoginRequest loginRequest);
    }
}