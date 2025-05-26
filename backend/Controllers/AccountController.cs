// using backend.Interfaces;
// using backend.Models.DTO;
// using Microsoft.AspNetCore.Authentication;
// using Microsoft.AspNetCore.Authentication.Cookies;
// using Microsoft.AspNetCore.Authentication.Google;
// using Microsoft.AspNetCore.Mvc;
// using System.Runtime.CompilerServices;
// using System.Security.Claims;

// namespace backend.Controllers;

// [ApiController]
// [Route("auth")]
// public class AccountController : ControllerBase
// {
//     private readonly IAuthService _authService;
//     public AccountController(IAuthService authService)
//     {
//         _authService = authService;
//     }
//     [HttpGet("login")]
//     public IActionResult Login()
//     {
//         var properties = new AuthenticationProperties
//         {
//             RedirectUri = "/auth/signin-google" // Trỏ về chính endpoint này
//         };
//         return Challenge(properties, GoogleDefaults.AuthenticationScheme);
//     }

//     [HttpGet("signin-google")]  
//     public async Task<IActionResult> GoogleCallback()
//     {
//         try
//         {
//             var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

//             if (!result.Succeeded || result.Principal == null)
//             {
//                 return Unauthorized(new BaseResponse<string>(null, "Authentication failed", false));
//             }

//             var email = result.Principal.FindFirstValue(ClaimTypes.Email);
//             if (email == null)
//             {
//                 return Unauthorized(new BaseResponse<string>(null, "Email not found", false));
//             }
//             Console.WriteLine($"Email: {email}");

//             if (!email.EndsWith("@school.edu") && !email.Equals("tranngocchuongtnc@gmail.com"))
//             {
//                 return Unauthorized(new BaseResponse<string>(null, "Email không được phép truy cập", false));
//             }

//             string token = await _authService.GenerateTokenAsync(email);

//             if (string.IsNullOrEmpty(token))
//             {
//                 return Unauthorized(new BaseResponse<string>(null, "Token generation failed", false));
//             }
//             Console.WriteLine($"Email: hihi");
//             return Ok(new BaseResponse<object>(new { token = token }, "Đăng nhập thành công", true));
//      }
//         catch (Exception ex)
//         {
//             return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
//         }
//     }

//     [HttpPost("logout")]
//     public async Task<IActionResult> Logout()
//     {
//         return Ok();
//     }
// }