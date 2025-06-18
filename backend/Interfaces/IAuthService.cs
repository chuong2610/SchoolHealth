using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IAuthService
    {

        Task<AuthDTO> Login(LoginRequest loginRequest);
        Task<bool> IsVerified(string PhoneNumber);
        Task<bool> SendOtpAsync(string PhoneNumber);
        Task<bool> VerifyOtpAsync(string PhoneNumber, string otp);
         Task<AuthDTO> LoginWithGoogleAsync(GoogleAuthRequest request);
    }
}