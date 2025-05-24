using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Medication
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int NurseId { get; set; }
        [ForeignKey("NurseId")]
        public Nurse Nurse { get; set; } = new Nurse();
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = new Student();
    }    
}