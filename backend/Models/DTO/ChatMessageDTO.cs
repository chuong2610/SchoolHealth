namespace backend.Models.DTO
{
    public class ChatMessageDTO
    {
        public int FromUserId { get; set; }
        public int? ToUserId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; } = false;
    }
}