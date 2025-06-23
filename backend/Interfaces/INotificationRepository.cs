using backend.Models;

namespace backend.Interfaces
{
        public interface INotificationRepository
        {
                Task<List<NotificationStudent>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> CountNotificationsByParentIdAsync(int parentId, string? search);
                Task<List<NotificationStudent>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> CountHealthChecksNotificationsByParentIdAsync(int parentId, string? search);
                Task<List<NotificationStudent>> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> CountVaccinationsNotificationsByParentIdAsync(int parentId, string? search);
                Task<Notification?> GetNotificationByIdAsync(int id);
                Task<List<Notification>> GetNotificationsByNurseIdAsync(int id);
                Task<List<Notification>> Get5Notifications();
                Task<bool> CreateNotificationAsync(Notification notification);
                Task<Notification?> GetNoticeByIdAsync(int id);
                Task<bool> UpdateNotificationAsync(Notification notification);
                Task<bool> DeleteNotificationAsync(Notification notification);
                Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize, string? search);
                Task<int> CountNotificationsAsync(string? search);
                Task<bool> HasNotificationAsync(int parentId);
        }
}