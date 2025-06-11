namespace backend.Models.Request
{
    public class UserRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}