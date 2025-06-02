namespace backend.Models.DTO
{
    public class MedicationDetailDTO
    {
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string StudentClass { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
    }
}