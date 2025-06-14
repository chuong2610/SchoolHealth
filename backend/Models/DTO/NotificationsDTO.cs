namespace backend.Models.DTO
{
    public class NotificationsDTO
    {
        public int Id { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<int> ClassId { get; set; } = new();
        public List<string> ClassName { get; set; } = new();
    }
}