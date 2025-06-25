namespace backend.Models.DTO
{
    public class NotificationAdminCountDTO
    {
        public int TotalNotifications { get; set; }
        public int VaccinationNotifications { get; set; }
        public int HealthcheckNotifications { get; set; }
        public int NotificationsSentToday { get; set; }
    }
}
