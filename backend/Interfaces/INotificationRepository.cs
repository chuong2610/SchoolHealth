using backend.Models;

namespace backend.Interfaces
{
        public interface INotificationRepository
        {
                Task<List<Notification>> GetNotificationsByParentIdAsync(int parentId);
                Task<List<Notification>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
                Task<List<Notification>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
                Task<Notification?> GetNotificationByIdAsync(int id);
                Task<List<Notification>> GetNotificationsByNurseIdAsync(int id);
                Task<List<Notification>> Get5Notifications();
                Task<bool> CreateNotificationAsync(Notification notification);
                Task<Notification?> GetNoticeByIdAsync(int id);
                Task<bool> UpdateNotificationAsync(Notification notification);
                Task<bool> DeleteNotificationAsync(Notification notification);
                Task<List<Notification>> GetAllNotificationsAsync();
                Task<bool> HasNotificationAsync(int parentId);
        }
}