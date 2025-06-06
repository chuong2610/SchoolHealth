namespace backend.Models.DTO
{
    public class MedicalEventDetailDTO
    {
        public string EventType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public List<MedicationEventSupplyDetailDTO> Supplies { get; set; } = new List<MedicationEventSupplyDetailDTO>();
    }
}