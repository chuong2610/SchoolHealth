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
        public string Status { get; set; } = string.Empty;
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }   = new Student();
        public int NurseId { get; set; }
        [ForeignKey("NurseId")]
        public Nurse Nurse { get; set; } = new Nurse();
    }    
}