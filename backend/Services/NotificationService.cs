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
            var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToListDTO(notification, student.Student.Id, student.Student.Name));
                }
            }
            return result;
            // return notifications.Select(n => MapToDTO(n)).ToList();

        }

        public async Task<List<NotificationDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetVaccinationsNotificationsByParentIdAsync(parentId);
             var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToListDTO(notification, student.Student.Id, student.Student.Name));
                }
            }
            return result;
        }
        public async Task<List<NotificationDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetHealthChecksNotificationsByParentIdAsync(parentId);
            var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToListDTO(notification, student.Student.Id, student.Student.Name));
                }
            }
            return result;
        }
        public async Task<NotificationDetailDTO> GetNotificationByIdAsync(int notificationId, int studentId)
        {
            var notification = await _notificationRepository.GetNotificationByIdAsync(notificationId);
            if (notification == null)
            {
                return null;
            }

            return new NotificationDetailDTO
            {
                Id = notification.Id,
                Title = notification.Title,
                Message = notification.Message,
                Note = notification.Note ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                Type = notification.Type,
                Status = notification.NotificationStudents.FirstOrDefault(ns => ns.StudentId == studentId)?.Status ?? string.Empty, // confirmed, rejected
                Location = notification.Location ?? string.Empty,
                Date = notification.Date,
                StudentName = notification.NotificationStudents.FirstOrDefault(ns => ns.StudentId == studentId)?.Student.Name ?? string.Empty,
                StudentId = studentId

            };
        }
        private NotificationDTO MapToListDTO(Notification notification, int stusentId, string studentName)
        {
            return new NotificationDTO
            {
                Id = notification.Id,
                Title = notification.Title,
                Message = notification.Message,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                StudentId = stusentId,
                StudentName = studentName
            };
        }

    }
}