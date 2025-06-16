using System.Runtime.InteropServices;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> CreateUserAsync(CreateUserRequest userRequest)
        {
            // Map CreateUserRequest to User model
            var user = new User
            {
                Name = userRequest.Name,
                Email = userRequest.Email,
                Password = "defaultPassword", 
                Address = userRequest.Address,
                Phone = userRequest.Phone,
                Gender = userRequest.Gender,
                DateOfBirth = userRequest.DateOfBirth
            };
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
        public async Task<bool> UpdateUserAsync(UserDetailDTO user)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(user.Id);
            if (existingUser == null)
            {
                return false;
            }
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Address = user.Address;
            existingUser.Phone = user.Phone;
            existingUser.Gender = user.Gender;
            existingUser.DateOfBirth = user.DateOfBirth;
            return await _userRepository.UpdateUserAsync(existingUser);
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteUserAsync(id);
        }
        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(MapToUserDTO).ToList();
        }
        public async Task<List<UserDTO>> GetUsersByRoleAsync(string role)
        {
            var users = await _userRepository.GetUsersByRoleAsync(role);
            return users.Select(MapToUserDTO).ToList();
        }
        public async Task<UserDetailDTO> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return new UserDetailDTO
            {
                Name = user.Name,
                Email = user.Email,
                Address = user.Address,
                Phone = user.Phone,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
            };
        }

        private UserDTO MapToUserDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Address = user.Address,
                Phone = user.Phone,
                Gender = user.Gender
            };
        }

        public Task<int> GetNumberOfUsersAsync(string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                return _userRepository.GetNumberOfUsersAsync(null);
            }
            return _userRepository.GetNumberOfUsersAsync(role);
        }
    }
}
