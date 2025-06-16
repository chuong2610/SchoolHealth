using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Vaccination
    {
        [Key]
        public int Id { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int NotificationId { get; set; }
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }   = null!;
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User Nurse { get; set; } = null!;
    }    
}