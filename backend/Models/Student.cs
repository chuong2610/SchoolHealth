using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
<<<<<<< HEAD
=======
   
>>>>>>> fe01fa59c6d23ae52afe6cfc1e31204cecf9bd94
    public class Student
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
<<<<<<< HEAD
        public DateOnly DateOfBirth { get; set; }
=======
        public DateOnly DateOfBirth { get; set; } 
>>>>>>> fe01fa59c6d23ae52afe6cfc1e31204cecf9bd94
        public StudentProfile Profile { get; set; } = null!;
        public List<HealthCheck> HealthChecks { get; set; } = new List<HealthCheck>();
        public List<Medication> Medications { get; set; } = new List<Medication>();
        public List<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
        public List<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public List<NotificationStudent> NotificationStudents { get; set; } = new List<NotificationStudent>();
        public int ParentId { get; set; }
        [ForeignKey("ParentId")]
        public User Parent { get; set; } = null!;
    }
}