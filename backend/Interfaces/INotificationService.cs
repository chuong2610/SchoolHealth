using backend.Models;
using backend.Models.DTO;

using backend.Models.Request;


namespace backend.Interfaces
{
        public interface INotificationService
        {
                Task<List<NotificationParentDTO>> GetNotificationsByParentIdAsync(int parentId);
                Task<List<NotificationParentDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
                Task<List<NotificationParentDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
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