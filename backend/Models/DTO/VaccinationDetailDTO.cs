namespace backend.Models.DTO
{
    public class VaccinationDetailDTO
    {
        public string VaccineName { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Conclusion { get; set; } = string.Empty;
        public string ResultAtHome { get; set; } = string.Empty;
        public int NurseId { get; set; }
        public string NurseName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
    }
}