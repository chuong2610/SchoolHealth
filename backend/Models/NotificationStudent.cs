namespace backend.Models
{
    public class NotificationStudent
    {
        public int NotificationId { get; set; }
        public Notification Notification { get; set; } = null!;

        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public string? Status { get; set; }     // ví dụ: "confirmed", "rejected"
        public string? Reason { get; set; }
    }
}