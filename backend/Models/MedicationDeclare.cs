using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class MedicationDeclare
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public int MedicationId { get; set; }
        [ForeignKey("MedicationId")]
        public Medication Medication { get; set; } = null!;
    }
}