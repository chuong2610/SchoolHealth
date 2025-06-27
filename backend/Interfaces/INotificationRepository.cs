using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
        public interface INotificationRepository
        {
                Task<List<NotificationStudent>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
                Task<int> CountNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate);
                Task<List<NotificationStudent>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
                Task<int> CountHealthChecksNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate);
                Task<List<NotificationStudent>> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
                Task<int> CountVaccinationsNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate);
                Task<Notification?> GetNotificationByIdAsync(int id);
                Task<List<Notification>> GetNotificationsByNurseIdAsync(int id);
                Task<List<Notification>> Get5Notifications();
                Task<bool> CreateNotificationAsync(Notification notification);
                Task<Notification?> GetNoticeByIdAsync(int id);
                Task<bool> UpdateNotificationAsync(Notification notification);
                Task<bool> DeleteNotificationAsync(Notification notification);
                Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize, string? search, DateTime? searchDate);
                Task<int> CountNotificationsAsync(string? search, DateTime? searchDate);
                Task<bool> HasNotificationAsync(int parentId);
                Task<NotificationCountDTO> GetNotificationCountsAsync(int parentId);
                Task<NotificationAdminCountDTO> GetNotificationAdminCountsAsync();
        }
}