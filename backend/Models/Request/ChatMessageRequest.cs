namespace backend.Models.Request
{
    public class ChatMessageRequest
    {
        public int FromUserId { get; set; }
        public int? ToUserId { get; set; }
        public string Message { get; set; }
    }
}