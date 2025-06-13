using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDTO>> GetNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
        Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId);
        Task<NotificationDetailAdminDTO> GetNotificationDetailAdminDTOAsync(int id);
        Task<List<NotificationNurseDTO>> GetNotificationsByNurseIdAsync(int id);
        Task<List<NotificationSummaryDTO>> Get5Notifications();

    }
}