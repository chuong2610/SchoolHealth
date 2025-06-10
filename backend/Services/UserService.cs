using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            // Check if the user already exists by email
            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return false; // User already exists
            }
            user.IsActive = true;
            return await _userRepository.CreateUserAsync(user);
        }
        
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<User?> GetUserByPhoneAsync(string phone)
        {
            return await _userRepository.GetUserByPhoneAsync(phone);
        }

    }
}