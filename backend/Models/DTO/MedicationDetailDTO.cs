namespace backend.Models.DTO
{
    public class MedicationDetailDTO
    {
        public List<MedicationDeclareDTO> Medications { get; set; } = new List<MedicationDeclareDTO>();
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReviceDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = string.Empty;
        public string StudentClass { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
    }
}