namespace backend.Models.Request
{
    public class MedicationRequest
    {
        public string MedicineName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
