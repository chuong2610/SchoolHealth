namespace backend.Models
{
    public class NotificationParentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string StudentName { get; set; } = string.Empty;
        public int StudentId { get; set; }
        public string Status { get; set; } = string.Empty; // e.g., "Pending", "Confirmed", "Rejected"
    }
}