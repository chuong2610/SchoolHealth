namespace backend.Models.DTO
{
    public class ChatPreviewDto
    {
        public int User { get; set; }
        public string LastMessage { get; set; }
        public DateTime Timestamp { get; set; }
        public bool HasUnread { get; set; }
    }

}