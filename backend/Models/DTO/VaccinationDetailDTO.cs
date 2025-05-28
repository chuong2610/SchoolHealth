namespace backend.Models.DTO
{
    public class VaccinationDetailDTO
    {
        public string VaccineName { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
    }
}