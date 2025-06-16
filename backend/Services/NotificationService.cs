using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IHealthCheckService _healthCheckService;
        private readonly IVaccinationService _vaccinationService;
        public NotificationService(INotificationRepository notificationRepository, IHealthCheckService healthCheckService, IVaccinationService vaccinationService)
        {
            _notificationRepository = notificationRepository;
            _healthCheckService = healthCheckService;
            _vaccinationService = vaccinationService;
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
                NurseId = notification.AssignedToId,
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
        private NotificationDTO MapToListDTO(Notification notification, int studentId, string studentName)
        {
            return new NotificationDTO
            {
                Id = notification.Id,
                Name = notification.Name ?? string.Empty,
                Title = notification.Title ?? string.Empty,
                Message = notification.Message ?? string.Empty,
                Type = notification.Type ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                StudentId = studentId,
                StudentName = studentName,

            };
        }

    }
}