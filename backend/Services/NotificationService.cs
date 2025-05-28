using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }
        public async Task<List<NotificationDTO>> GetNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetNotificationsByParentIdAsync(parentId);
                return notifications.Select(n => MapToDTO(n)).ToList();
            }
        
        public async Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetVaccinationsNotificationsByParentIdAsync(parentId);
            return notifications.Select(n => MapToDTO(n)).ToList();
        }
        public async Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetHealthChecksNotificationsByParentIdAsync(parentId);
            return notifications.Select(n => MapToDTO(n)).ToList();
        }
        public async Task<NotificationDetailDTO> GetNotificationByIdAsync(int id)
        {
            var notification = await _notificationRepository.GetNotificationByIdAsync(id);
            if (notification == null)
            {
                return null;
            }

            return new NotificationDetailDTO
            {
                Title = notification.Title,
                Message = notification.Message,
                Note = notification.Note ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                Type = notification.Type,
                Location = notification.Location ?? string.Empty,
                Date = notification.Date,
                StudentName = notification.NotificationStudents.FirstOrDefault()?.Student.Name ?? string.Empty
            };
        }
        private NotificationDTO MapToDTO(Notification notification)
        {
            return new NotificationDTO
            {
                Id = notification.Id,
                Title = notification.Title,
                Message = notification.Message,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                StudentName = notification.NotificationStudents.FirstOrDefault()?.Student.Name ?? string.Empty
            };
        }

    }
}