using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class HealthDeclareHistory
    {
        public int Id { get; set; }
        public int StudentProfileId { get; set; }
        public DateTime DeclarationDate { get; set; } = DateTime.UtcNow;
        public StudentProfile StudentProfile { get; set; } = null!;
        public string Allergys { get; set; } = string.Empty;
        public string ChronicIllnesss { get; set; } = string.Empty;
        public string LongTermMedications { get; set; } = string.Empty;
        public string OtherMedicalConditions { get; set; } = string.Empty;
        public int ParentId { get; set; }
        [ForeignKey("ParentId")]
        public User Parent { get; set; } = null!;
    }
}