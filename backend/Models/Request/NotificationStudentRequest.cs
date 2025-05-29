namespace backend.Models.Request
{
    public class NotificationStudentRequest
    {
        public int NotificationId { get; set; }
        public int StudentId { get; set; }
        public string? Status { get; set; } // ví dụ: "confirmed", "rejected"
        public string? Reason { get; set; } // lý do từ chối, nếu có
    }
}