using backend.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AccountController : ControllerBase
{
    private readonly IAuthService _authService;
    public AccountController(IAuthService authService)
    {
        _authService = authService;
    }
    [HttpGet("login")]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = "/auth/signin-google" // Trỏ về chính endpoint này
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("signin-google")]
    public async Task<IActionResult> GoogleCallback()
    {
        try
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                return Unauthorized("Authentication failed");
            }

            var email = result.Principal.FindFirstValue(ClaimTypes.Email);
            if (email == null)
            {
                return Unauthorized("Email not found");
            }
            Console.WriteLine($"Email: {email}");

            if (!email.EndsWith("@school.edu") && !email.Equals("tranngocchuongtnc@gmail.com"))
                {
                    return Unauthorized("Email không được phép truy cập");
                }

            string token = await _authService.GenerateTokenAsync(email);
            
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token generation failed");
            }
            if(token== "null")
            {
                return Unauthorized("Token is null");
            }
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        return Ok();
    }
}