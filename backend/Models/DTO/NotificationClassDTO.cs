namespace backend.Models.DTO
{
    public class NotificationClassDTO
    {
        public int Id { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ClassName { get; set; } = string.Empty;
    }
}