namespace backend.Models.Request
{
    public class CreateUserRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}