namespace backend.Models.DTO
{
    public class MedicationDTO
    {
        public int Id { get; set; }
        public string MedicationName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Dosage { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int StudentId { get; set; }

    }
}
