using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Services;
using DocumentFormat.OpenXml.Math;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            if (users == null || users.Count == 0)
            {
                return Ok(new BaseResponse<List<UserDTO>>(
                    data: null,
                    message: "No users found.",
                    success: true
                ));
            }
            return Ok(new BaseResponse<List<UserDTO>>(
                data: users,
                message: "Users retrieved successfully.",
                success: true
            ));
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new BaseResponse<UserDetailDTO>(
                    data: null,
                    message: "User not found.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<UserDetailDTO>(
                data: user,
                message: "User retrieved successfully.",
                success: true
            ));
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            var users = await _userService.GetUsersByRoleAsync(role);
            if (users == null || users.Count == 0)
            {
                return Ok(new BaseResponse<List<UserDTO>>(
                    data: null,
                    message: "No users found for the specified role.",
                    success: true
                ));
            }
            return Ok(new BaseResponse<List<UserDTO>>(
                data: users,
                message: "Users by role retrieved successfully.",
                success: true
            ));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserRequest request)
        {
            var result = await _userService.CreateUserAsync(request);
            if (!result)
            {
                return BadRequest(new BaseResponse<bool>(
                    data: false,
                    message: "User creation failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User created successfully.",
                success: true
            ));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UserDetailDTO user)
        {
            var result = await _userService.UpdateUserAsync(user);
            if (!result)
            {
                return BadRequest(new BaseResponse<bool>(
                    data: false,
                    message: "User update failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User updated successfully.",
                success: true
            ));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound(new BaseResponse<bool>(
                    data: false,
                    message: "User not found or deletion failed.",
                    success: false
                ));
            }
            return Ok(new BaseResponse<bool>(
                data: true,
                message: "User deleted successfully.",
                success: true
            ));
        }
    }
}