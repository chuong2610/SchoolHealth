using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

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
                Name = notification.Name ?? string.Empty,
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

        public async Task<IEnumerable<NotificationDTO>> GetAllNotificationAsync()
        {
            var notifications = await _notificationRepository.GetAllNotificationAsync();
            var notificationDtos = notifications.Select(notification =>
            {
                return new NotificationDTO
                {
                    Id = notification.Id,
                    Name = notification.Name ?? string.Empty,
                    Title = notification.Title,
                    Type = notification.Type,
                    Message = notification.Message,
                };
            }).ToList();
            return notificationDtos;
        }

        public async Task<NotificationDetailDTO?> GetByIdAsync(int id)
        {
            var notification = await _notificationRepository.GetNoticeByIdAsync(id);
            if (notification == null) return null;

            return new NotificationDetailDTO
            {
                Id = notification.Id,
                Name = notification.Name ?? string.Empty,
                Title = notification.Title,
                Type = notification.Type,
                Message = notification.Message,
                Date = notification.Date,
                Note = notification.Note ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                Location = notification.Location ?? string.Empty,

            };
        }


        public async Task<bool> CreateNotificationAsync(NotificationRequest request, int createdById)
        {
            var notification = new Notification
            {
                Name = request.NotificationName,
                Title = request.Title,
                Type = request.Type,
                Message = request.Message,
                Note = request.Note,
                Location = request.Location,
                Date = request.Date,
                CreatedAt = DateTime.UtcNow,
                CreatedById = createdById,
                AssignedToId = null
            };

            var created = await _notificationRepository.AddNotificationAsync(notification);

            return true;
        }

        public async Task<bool> UpdateNotificationAsync(int id, NotificationRequest notificationRequest)
        {
            var existingNotification = await _notificationRepository.GetNoticeByIdAsync(id);
            if (existingNotification == null)
            {
                return false;
            }
            // Update Title if not null
            if (!string.IsNullOrWhiteSpace(notificationRequest.Title))
            {
                existingNotification.Title = notificationRequest.Title;
            }
            // Update NotificationName if not null
            if (!string.IsNullOrWhiteSpace(notificationRequest.NotificationName))
            {
                existingNotification.Name = notificationRequest.NotificationName;
            }
            // Update Mesage if not null
            if (!string.IsNullOrWhiteSpace(notificationRequest.Message))
            {
                existingNotification.Message = notificationRequest.Message;
            }
            // Update Type if not null
            if (!string.IsNullOrWhiteSpace(notificationRequest.Type))
            {
                existingNotification.Type = notificationRequest.Type;
            }
            // Update Location if not null
            if (!string.IsNullOrWhiteSpace(notificationRequest.Location))
            {
                existingNotification.Location = notificationRequest.Location;
            }

            var updated = await _notificationRepository.UpdateNotificationAsync(existingNotification);

            return true;
        }

        public async Task<bool> DeleteNotificationAsync(int id)
        {
            var notification = await _notificationRepository.GetNoticeByIdAsync(id);
            if (notification == null)
            {
                return false;
            }

            await _notificationRepository.DeleteNotificationAsync(notification);
            return true;
        }


        private NotificationDTO MapToListDTO(Notification notification, int stusentId, string studentName)
        {
            return new NotificationDTO
            {
                Id = notification.Id,
                Name = notification.Name ?? string.Empty,
                Title = notification.Title ?? string.Empty,
                Message = notification.Message ?? string.Empty,
                Type = notification.Type ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                StudentId = stusentId,
                StudentName = studentName
            };
        }

    }
}