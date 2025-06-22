using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IHealthCheckService _healthCheckService;
        private readonly IVaccinationService _vaccinationService;
        private readonly IStudentRepository _studentRepository;
        private readonly IClassRepository _classrRepository;
        private readonly IHubContext<NotificationHub> _hub;
        public NotificationService(INotificationRepository notificationRepository, IHealthCheckService healthCheckService, IVaccinationService vaccinationService, IStudentRepository studentRepository, IClassRepository classrRepository, IHubContext<NotificationHub> hub)
        {
            _notificationRepository = notificationRepository;
            _healthCheckService = healthCheckService;
            _vaccinationService = vaccinationService;
            _studentRepository = studentRepository;
            _classrRepository = classrRepository;
            _hub = hub;
        }
        public async Task<List<NotificationParentDTO>> GetNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetNotificationsByParentIdAsync(parentId);
            var result = new List<NotificationParentDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToNotificationParentDTO(notification, student.Student.Id, student.Student.Name));
                }
            }
            return result;
            // return notifications.Select(n => MapToDTO(n)).ToList();

        }
        public async Task<List<NotificationParentDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetVaccinationsNotificationsByParentIdAsync(parentId);
            var result = new List<NotificationParentDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToNotificationParentDTO(notification, student.Student.Id, student.Student.Name));
                }
            }
            return result;
        }
        public async Task<List<NotificationParentDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId)
        {
            var notifications = await _notificationRepository.GetHealthChecksNotificationsByParentIdAsync(parentId);
            var result = new List<NotificationParentDTO>();
            foreach (var notification in notifications)
            {
                foreach (var student in notification.NotificationStudents)
                {
                    result.Add(MapToNotificationParentDTO(notification, student.Student.Id, student.Student.Name));
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
                StudentId = studentId,
                NurseName = notification.AssignedTo?.Name ?? string.Empty

            };
        }
        public async Task<List<NotificationNurseDTO>> GetNotificationsByNurseIdAsync(int id)
        {
            var notifications = await _notificationRepository.GetNotificationsByNurseIdAsync(id);
            return notifications.Select(n => new NotificationNurseDTO
            {
                Id = n.Id,
                Name = n.Name ?? string.Empty,
                Title = n.Title ?? string.Empty,
                Message = n.Message ?? string.Empty,
                Type = n.Type ?? string.Empty,
                CreatedAt = n.CreatedAt,
                ClassName = n.ClassName ?? string.Empty
            }).ToList();
        }
        public async Task<NotificationDetailAdminDTO> GetNotificationDetailAdminDTOAsync(int id)
        {
            var notification = await _notificationRepository.GetNotificationByIdAsync(id);
            if (notification == null)
            {
                return null;
            }
            var dto = new NotificationDetailAdminDTO
            {
                Id = notification.Id,
                Title = notification.Title ?? string.Empty,
                Name = notification.Name ?? string.Empty,
                Message = notification.Message ?? string.Empty,
                Note = notification.Note ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                Type = notification.Type ?? string.Empty,
                Location = notification.Location ?? string.Empty,
                Date = notification.Date,
                NurseName = notification.AssignedTo?.Name ?? string.Empty,
                ClassName = notification.ClassName ?? string.Empty,
                NurseId = notification.AssignedToId
            };
            switch (notification.Type)
            {
                case "HealthCheck":
                    var healthChecks = await _healthCheckService.GetHealthChecksByNotificationIdAsync(notification.Id);
                    dto.Results = healthChecks.Cast<object>().ToList();
                    break;

                case "Vaccination":
                    var vaccinations = await _vaccinationService.GetVaccinationByNotificationIdAsync(notification.Id);
                    dto.Results = vaccinations.Cast<object>().ToList();
                    break;

                default:
                    dto.Results = new List<object>();
                    break;
            }

            return dto;
        }
        public async Task<List<NotificationSummaryDTO>> Get5Notifications()
        {
            var notifications = await _notificationRepository.Get5Notifications();
            return notifications.Select(n => new NotificationSummaryDTO
            {
                Title = n.Title ?? string.Empty,
                CreatedDate = n.CreatedAt,
                PendingCount = n.NotificationStudents.Count(ns => ns.Status == "pending"),
                ConfirmedCount = n.NotificationStudents.Count(ns => ns.Status == "confirmed"),
                RejectedCount = n.NotificationStudents.Count(ns => ns.Status == "rejected")
            }).ToList();
        }



        public async Task<IEnumerable<NotificationClassDTO>> GetAllNotificationAsync()
        {
            var notifications = await _notificationRepository.GetAllNotificationsAsync();

            var notificationDtos = new List<NotificationClassDTO>();

            foreach (var notification in notifications)
            {
                var uniqueClasses = notification.NotificationStudents
                    .Select(ns => ns.Student?.Class)
                    .Where(c => c != null)
                    .GroupBy(c => c.Id)
                    .Select(g => g.First())
                    .ToList();

                foreach (var cls in uniqueClasses)
                {
                    notificationDtos.Add(new NotificationClassDTO
                    {
                        Id = notification.Id,
                        VaccineName = notification.Name ?? string.Empty,
                        Title = notification.Title,
                        Type = notification.Type,
                        Message = notification.Message,
                        CreatedAt = notification.CreatedAt,
                        ClassId = cls.Id,
                        ClassName = cls.ClassName
                    });
                }
            }

            return notificationDtos;
        }

        public async Task<bool> CreateAndSendNotificationAsync(NotificationRequest request, int createdById)
        {
            int classId = request.ClassId;

            var studentsInClass = await _studentRepository.GetStudentsByClassIdAsync(classId);
            if (studentsInClass == null || !studentsInClass.Any())
                return false;

            // Lấy className từ repository
            var classEntity = await _classrRepository.GetClassByIdAsync(classId);
            if (classEntity == null)
                return false;

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
                ClassName = classEntity.ClassName, // Gán className lấy từ DB
                NotificationStudents = studentsInClass.Select(s => new NotificationStudent
                {
                    StudentId = s.Id,
                    Status = "Pending"
                }).ToList()
            };
            var isSussess = await _notificationRepository.CreateNotificationAsync(notification);
            await _hub.Clients.All.SendAsync("ReceiveNotification", new
            {
                title = notification.Title,
                content = notification.Message,
                createdAt = notification.CreatedAt
            });
            return isSussess;
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
        private NotificationParentDTO MapToNotificationParentDTO(Notification notification, int studentId, string studentName)
        {
            return new NotificationParentDTO
            {
                Id = notification.Id,
                Name = notification.Name ?? string.Empty,
                Title = notification.Title ?? string.Empty,
                Message = notification.Message ?? string.Empty,
                Type = notification.Type ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                StudentId = studentId,
                StudentName = studentName,
                Status = notification.NotificationStudents.FirstOrDefault(ns => ns.StudentId == studentId)?.Status ?? string.Empty

            };
        }
        public async Task<bool> HasNotificationAsync(int parentId)
        {
            return await _notificationRepository.HasNotificationAsync(parentId);
        }    

    }
}