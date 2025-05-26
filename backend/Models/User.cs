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
        public DateOnly DateOfBirth { get; set; } 
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role Role { get; set; } = new Role();


    }
}