using backend.Models;
using backend.Models.DTO;

using backend.Models.Request;


namespace backend.Interfaces
{
        public interface INotificationService
        {
                Task<PageResult<NotificationParentDTO>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<PageResult<NotificationParentDTO>> GetVaccinationNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<PageResult<NotificationParentDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
                Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId);
                Task<NotificationDetailAdminDTO?> GetNotificationDetailAdminDTOAsync(int id, int pageNumber, int pageSize);
                Task<List<NotificationNurseDTO>> GetNotificationsByNurseIdAsync(int id);
                Task<List<NotificationSummaryDTO>> Get5Notifications();
                Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, int createdById);
                Task<bool> UpdateNotificationAsync(int id, NotificationRequest notificationRequest);
                Task<bool> DeleteNotificationAsync(int id);
                Task<PageResult<NotificationClassDTO>> GetAllNotificationAsync(int pageNumber, int pageSize);
                Task<bool> HasNotificationAsync(int parentId);

        }
}