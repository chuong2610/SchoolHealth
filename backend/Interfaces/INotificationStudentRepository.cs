using backend.Models;

namespace backend.Interfaces
{
    public interface INotificationStudentRepository
    {
        Task<bool> createNotificationStudentAsync(NotificationStudent notificationStudent);
        Task<bool> UpdateNotificationStudentAsync(NotificationStudent notificationStudent);
    }
}