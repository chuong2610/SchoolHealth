using backend.Models;

namespace backend.Interfaces
{
        public interface INotificationRepository
        {
                Task<(List<NotificationStudent> Items, int TotalItems)> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> CountNotificationStudentsByParentIdAsync(int parentId, string? search);
                Task<(List<NotificationStudent> Items, int TotalItems)> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> GetHealthChecksNotificationsCountByParentIdAsync(int parentId, string? search);
                Task<(List<NotificationStudent> Items, int TotalItems)> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<int> GetVaccinationsNotificationsCountByParentIdAsync(int parentId, string? search);
                Task<Notification?> GetNotificationByIdAsync(int id);
                Task<List<Notification>> GetNotificationsByNurseIdAsync(int id);
                Task<List<Notification>> Get5Notifications();
                Task<bool> CreateNotificationAsync(Notification notification);
                Task<Notification?> GetNoticeByIdAsync(int id);
                Task<bool> UpdateNotificationAsync(Notification notification);
                Task<bool> DeleteNotificationAsync(Notification notification);
                Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize);
                Task<int> CountNotificationsAsync();
                Task<bool> HasNotificationAsync(int parentId);
        }
}