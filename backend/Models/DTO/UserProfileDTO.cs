namespace backend.Models.DTO
{
    public class UserProfileDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}