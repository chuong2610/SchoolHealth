using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Student 
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public StudentProfile Profile { get; set; } = null!;
        public List<HealthCheck> HealthChecks { get; set; } = new List<HealthCheck>();
        public List<Medication> Medications { get; set; } = new List<Medication>();
        public List<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
        public List<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public List<NotificationStudent> NotificationStudents { get; set; } = new List<NotificationStudent>();
         public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User Parent { get; set; } = null!;
    }    
}