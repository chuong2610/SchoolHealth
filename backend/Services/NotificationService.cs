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

                notificationDtos.Add(new NotificationsDTO
                {
                    Id = notification.Id,
                    Name = notification.Name ?? string.Empty,
                    Title = notification.Title,
                    Type = notification.Type,
                    Message = notification.Message,
                });
            }

            return notificationDtos;
        }

        public async Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, List<string> classNames, int createdById, int? assignedToId)
        {
            // 1. Lấy danh sách học sinh theo các lớp
            var allStudents = new List<Student>();
            foreach (var className in classNames)
            {
                var studentsInClass = await _studentRepository.GetStudentsByClassNameAsync(className);
                allStudents.AddRange(studentsInClass);
            }

            // 2. lấy học sinh theo ParentId
            var parentStudentMap = allStudents
                .GroupBy(s => s.ParentId)
                .ToDictionary(g => g.Key, g => g.ToList());

            // 3. Gửi thông báo đến phụ huynh
            foreach (var entry in parentStudentMap)
            {
                int parentId = entry.Key;
                var studentList = entry.Value;

                var studentNames = string.Join(", ", studentList.Select(s => s.Name));

                var parentNotification = new Notification
                {
                    Name = request.NotificationName,
                    Title = request.Title,
                    Type = request.Type,
                    Message = $"{request.Message}\nHọc sinh: {studentNames}",
                    Note = request.Note,
                    Location = request.Location,
                    Date = request.Date,
                    CreatedAt = DateTime.UtcNow,
                    CreatedById = createdById,
                    AssignedToId = request.AssignedToId
                };

                await _notificationRepository.AddNotificationAsync(parentNotification);
            }

            // 4. Gửi thêm thông báo cho người thực hiện 
            if (assignedToId.HasValue)
            {
                var selfNotification = new Notification
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
                    AssignedToId = request.AssignedToId
                };

                await _notificationRepository.AddNotificationAsync(selfNotification);
            }

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