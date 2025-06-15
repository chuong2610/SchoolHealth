using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUserAsync();
        Task<UserProfileDTO> GetUserByIdAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, UserPasswordRequest request);
        Task<bool> UpdateUserProfileAsync(int id, UserProfileRequest request);
        Task<IEnumerable<NurseDTO>> GetAllNursesAsync();
    }
}