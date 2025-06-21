using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace backend.Models
{

    public class Student
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public StudentProfile Profile { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        [JsonIgnore]
        public List<HealthCheck> HealthChecks { get; set; } = new List<HealthCheck>();
        public List<Medication> Medications { get; set; } = new List<Medication>();
        public List<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
        public List<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public List<NotificationStudent> NotificationStudents { get; set; } = new List<NotificationStudent>();
        public int ParentId { get; set; }

        [ForeignKey("ParentId")]
        public User Parent { get; set; } = null!;

        public int ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class Class { get; set; } = null!;
    }
}

