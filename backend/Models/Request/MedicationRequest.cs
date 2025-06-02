namespace backend.Models.Request
{
    public class MedicationRequest
    {
        public int StudentId { get; set; }
        public string MedicineName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
