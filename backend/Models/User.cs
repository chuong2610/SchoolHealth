using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string? ImageUrl { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsVerified { get; set; } = false;
        public List<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
        public List<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
        public List<Medication> Medications { get; set; } = new List<Medication>();
        public List<Student> Students { get; set; } = new List<Student>();
        public List<HealthCheck> HealthChecks { get; set; } = new List<HealthCheck>();
        public List<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public List<Notification> CreatedNotifications { get; set; } = new();
        public List<Notification> AssignedNotifications { get; set; } = new();
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role Role { get; set; } = null!;
    }
}