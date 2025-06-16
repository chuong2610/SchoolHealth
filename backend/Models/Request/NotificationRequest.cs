namespace backend.Models.Request
{
    public class NotificationRequest
    {
        public string VaccineName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Note { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int ClassId { get; set; }
        public int AssignedToId { get; set; }
    }
}