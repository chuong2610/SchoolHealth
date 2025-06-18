using backend.Models;

namespace backend.Interfaces
{
    public interface INotificationStudentRepository
    {
        Task<bool> CreateNotificationStudentAsync(NotificationStudent notificationStudent);
        Task<bool> UpdateNotificationStudentAsync(NotificationStudent notificationStudent);
    }
}