namespace backend.Models.DTO
{
    public class MedicationDeclareDTO
    {
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
    }
}