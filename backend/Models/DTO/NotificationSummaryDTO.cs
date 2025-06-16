namespace backend.Models.DTO
{
    public class NotificationSummaryDTO
    {
    public string Title { get; set; }
    public DateTime CreatedDate { get; set; }
    public int PendingCount { get; set; }
    public int ConfirmedCount { get; set; }
    public int RejectedCount { get; set; }
    }
}