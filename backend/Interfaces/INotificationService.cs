using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDTO>> GetNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
        Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
        Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId);
        Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, List<string> classNames, int createdById, int? assignedToId);
        Task<bool> UpdateNotificationAsync(int id, NotificationRequest notificationRequest);
        Task<bool> DeleteNotificationAsync(int id);
        Task<IEnumerable<NotificationsDTO>> GetAllNotificationAsync();

    }
}