namespace backend.Models
{
    public class NotificationDetailDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
         public string Name { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // confirmed, rejected
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string StudentName { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public int StudentId { get; set; }
    }
}