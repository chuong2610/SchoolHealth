using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IAuthService
    {

        Task<AuthDTO> Login(LoginRequest loginRequest);
    }
}