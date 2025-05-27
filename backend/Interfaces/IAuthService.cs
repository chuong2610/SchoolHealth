using backend.Models;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IAuthService
    {

        Task<string> Login(LoginRequest loginRequest);
    }
}