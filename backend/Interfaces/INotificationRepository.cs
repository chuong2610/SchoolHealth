using backend.Models;

namespace backend.Interfaces
{
        public interface INotificationRepository
        {
                Task<List<Notification>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? title);
                Task<int> CountNotificationsByParentIdAsync(int parentId, string? title);
                Task<(List<NotificationStudent> Items, int TotalItems)> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? title);
                Task<int> GetHealthChecksNotificationsCountByParentIdAsync(int parentId, string? title);
                Task<(List<NotificationStudent> Items, int TotalItems)> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? title = null);
                Task<int> GetVaccinationsNotificationsCountByParentIdAsync(int parentId, string? title);
                Task<Notification?> GetNotificationByIdAsync(int id);
                Task<List<Notification>> GetNotificationsByNurseIdAsync(int id);
                Task<List<Notification>> Get5Notifications();
                Task<bool> CreateNotificationAsync(Notification notification);
                Task<Notification?> GetNoticeByIdAsync(int id);
                Task<bool> UpdateNotificationAsync(Notification notification);
                Task<bool> DeleteNotificationAsync(Notification notification);
                Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize);
                Task<int> CountNotificationsAsync();
        }
}