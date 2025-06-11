using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUserAsync();
        Task<UserProfileDTO> GetUserByIdAsync(int id);
        Task<bool> CreatedUserAsync(UserRequest request);
        Task<bool> UpdateUserAsync(int id, UserRequest userRequest);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, UserPasswordRequest request);
        Task<bool> UpdateUserProfileAsync(int id, UserProfileRequest request);
    }
}