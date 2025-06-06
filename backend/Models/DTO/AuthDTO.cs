namespace backend.Models.DTO
{
    public class AuthDTO
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}