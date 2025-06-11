using backend.Models;

namespace backend.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetNotificationsByParentIdAsync(int parentId);
        Task<List<Notification>> GetHealthChecksNotificationsByParentIdAsync(int parentId);
        Task<List<Notification>> GetVaccinationsNotificationsByParentIdAsync(int parentId);
        Task<Notification?> GetNotificationByIdAsync(int id);
        Task<Notification?> AddNotificationAsync(Notification notification);
        Task<Notification?> GetNoticeByIdAsync(int id);
        Task<Notification?> UpdateNotificationAsync(Notification notification);
        Task DeleteNotificationAsync(Notification notification);
        Task<IEnumerable<Notification>> GetAllNotificationAsync();
    }
}