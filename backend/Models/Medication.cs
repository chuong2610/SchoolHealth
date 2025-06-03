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
        public int Quantity { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public List<MedicationDeclare> MedicationDeclares { get; set; } = new List<MedicationDeclare>();
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User Nurse { get; set; } = null!;
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;
    }
}