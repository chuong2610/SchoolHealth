using backend.Models;

namespace backend.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDTO>> GetNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
        Task<NotificationDetailDTO> GetNotificationByIdAsync(int id);
    }
}