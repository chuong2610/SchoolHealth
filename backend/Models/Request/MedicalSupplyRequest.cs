namespace backend.Models.Request
{
    public class MedicalSupplyRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? Quantity { get; set; }
        public DateTime LastRestoked { get; set; } = DateTime.UtcNow;
    }
}