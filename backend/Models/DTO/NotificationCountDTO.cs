namespace backend.Models.DTO
{
    public class NotificationCountDTO
    {
        public int TotalNotification { get; set; }
        public int PendingNotification { get; set; }
        public int ConfirmedNotification { get; set; }
        public int RejectedNotification { get; set; }
    }

}