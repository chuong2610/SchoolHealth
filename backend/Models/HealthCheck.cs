using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class HealthCheck
    {
        [Key]
        public int Id { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal VisionLeft { get; set; }
        public decimal VisionRight { get; set; }
        public decimal Bmi { get; set; }
        public string BloodPressure { get; set; } = string.Empty;
        public string HeartRate { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Conclusion { get; set; } = string.Empty;
        public int NotificationId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        [JsonIgnore]
        public Student Student { get; set; } = null!;
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        public User Nurse { get; set; } = null!;
    }
}