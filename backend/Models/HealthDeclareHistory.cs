using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class HealthDeclareHistory
    {
        public int Id { get; set; }
        public int StudentProfileId { get; set; }
        public DateTime DeclarationDate { get; set; } = DateTime.UtcNow;
        public StudentProfile StudentProfile { get; set; } = null!;
        public int ParentId { get; set; }
        [ForeignKey("ParentId")]
        public User Parent { get; set; } = null!;
    }
}