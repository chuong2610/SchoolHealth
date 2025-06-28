using backend.Models;
using backend.Models.DTO;

using backend.Models.Request;


namespace backend.Interfaces
{
        public interface INotificationService
        {
                Task<PageResult<NotificationParentDTO>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<PageResult<NotificationParentDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<PageResult<NotificationParentDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId);
                Task<NotificationDetailAdminDTO?> GetNotificationDetailAdminDTOAsync(int id);
                Task<List<NotificationNurseDTO>> GetNotificationsByNurseIdAsync(int id);
                Task<List<NotificationSummaryDTO>> Get5Notifications();
                Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, int createdById);
                Task<bool> UpdateNotificationAsync(int id, NotificationRequest notificationRequest);
                Task<bool> DeleteNotificationAsync(int id);
                Task<PageResult<NotificationClassDTO>> GetAllNotificationsAsync(int pageNumber, int pageSize, string? search);
                Task<bool> HasNotificationAsync(int parentId);
                Task<NotificationCountDTO> GetNotificationCountsAsync(int parentId);
                Task<NotificationAdminCountDTO> GetNotificationAdminCountsAsync();

        }
}