namespace backend.Models.DTO
{
    public class ChatPreviewDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserImage { get; set; }
        public string LastMessage { get; set; }
        public DateTime Timestamp { get; set; }
        public bool HasUnread { get; set; }
    }

}