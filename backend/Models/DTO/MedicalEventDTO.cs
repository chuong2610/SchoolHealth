namespace backend.Models.DTO
{
    public class MedicalEventDTO
    {
        public int Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string StudentName { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
    }
}