using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IStudentRepository _studentRepository;
        public NotificationService(INotificationRepository notificationRepository, IStudentRepository studentRepository)
        {
            _notificationRepository = notificationRepository;
            _studentRepository = studentRepository;
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

        public async Task<IEnumerable<NotificationsDTO>> GetAllNotificationAsync()
        {
            var notifications = await _notificationRepository.GetAllNotificationsAsync();

            var notificationDtos = new List<NotificationsDTO>();

            foreach (var notification in notifications)
            {
                var classInfo = notification.NotificationStudents
                    .Select(ns => ns.Student.Class)
                    .Where(c => c != null)
                    .GroupBy(c => c.Id) // loại trùng theo ClassId
                    .Select(g => g.First())
                    .ToList();

                notificationDtos.Add(new NotificationsDTO
                {
                    Id = notification.Id,
                    VaccineName = notification.Name ?? string.Empty,
                    Title = notification.Title,
                    Type = notification.Type,
                    Message = notification.Message,
                    CreatedAt = notification.CreatedAt,
                    ClassId = classInfo.Select(c => c.Id).ToList(),
                    ClassName = classInfo.Select(c => c.ClassName).ToList()
                });
            }

            return notificationDtos;
        }

        public async Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, int createdById)
        {
            var allStudents = new List<Student>();

            foreach (var classId in request.ClassId)
            {
                var studentsInClass = await _studentRepository.GetStudentsByClassIdAsync(classId);
                allStudents.AddRange(studentsInClass);
            }

            if (!allStudents.Any()) return false;

            var notification = new Notification
            {
                Name = request.VaccineName,
                Title = request.Title,
                Type = request.Type,
                Message = request.Message,
                Note = request.Note,
                Location = request.Location,
                Date = request.Date,
                CreatedAt = DateTime.UtcNow,
                CreatedById = createdById,
                AssignedToId = request.AssignedToId,
                NotificationStudents = allStudents.Select(s => new NotificationStudent
                {
                    StudentId = s.Id,
                    Status = "Pending"
                }).ToList()
            };

            var created = await _notificationRepository.CreateNotificationAsync(notification);
            return created;
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
            if (!string.IsNullOrWhiteSpace(notificationRequest.VaccineName))
            {
                existingNotification.Name = notificationRequest.VaccineName;
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

            return updated;
        }

        public async Task<bool> DeleteNotificationAsync(int id)
        {
            var notification = await _notificationRepository.GetNoticeByIdAsync(id);
            if (notification == null)
            {
                return false;
            }

            var deleted = await _notificationRepository.DeleteNotificationAsync(notification);
            return deleted;
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