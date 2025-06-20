using backend.Models;
using backend.Models.DTO;

using backend.Models.Request;


namespace backend.Interfaces
{
        public interface INotificationService
        {
                Task<PageResult<NotificationDTO>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize);
                Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
                Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
                Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId);
                Task<NotificationDetailAdminDTO> GetNotificationDetailAdminDTOAsync(int id);
                Task<List<NotificationNurseDTO>> GetNotificationsByNurseIdAsync(int id);
                Task<List<NotificationSummaryDTO>> Get5Notifications();
                Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, int createdById);
                Task<bool> UpdateNotificationAsync(int id, NotificationRequest notificationRequest);
                Task<bool> DeleteNotificationAsync(int id);
                Task<IEnumerable<NotificationClassDTO>> GetAllNotificationAsync();

        }
}