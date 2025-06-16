using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MedicalSupply
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime LastRestoked { get; set; } = DateTime.UtcNow;
        public List<MedicalEventSupply> MedicalEventSupplys { get; set; } = new List<MedicalEventSupply>();
    }
}