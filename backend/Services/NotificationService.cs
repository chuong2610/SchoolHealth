using System.Globalization;
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
        public async Task<PageResult<NotificationParentDTO>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }
            search = isDate ? null : search;
            var totalItems = await _notificationRepository.CountNotificationsByParentIdAsync(parentId, search, searchDate);
            var items = await _notificationRepository.GetNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);

            var result = items.Select(item => MapToNotificationParentDTO(
                item.Notification,
                item.Student.Id,
                item.Student.Name
            )).ToList();

            return new PageResult<NotificationParentDTO>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
        }
        public async Task<PageResult<NotificationParentDTO>> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var totalItems = await _notificationRepository.CountVaccinationsNotificationsByParentIdAsync(parentId, search, searchDate);
            var items = await _notificationRepository.GetVaccinationsNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);

            var result = items.Select(item => MapToNotificationParentDTO(
                item.Notification, item.Student.Id, item.Student.Name
            )).ToList();

            return new PageResult<NotificationParentDTO>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
        }
        public async Task<PageResult<NotificationParentDTO>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var totalItems = await _notificationRepository.CountHealthChecksNotificationsByParentIdAsync(parentId, search, searchDate);
            var items = await _notificationRepository.GetHealthChecksNotificationsByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);

            var result = items.Select(item => MapToNotificationParentDTO(
                item.Notification,
                item.Student.Id,
                item.Student.Name
            )).ToList();

            return new PageResult<NotificationParentDTO>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
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



        public async Task<PageResult<NotificationClassDTO>> GetAllNotificationsAsync(int pageNumber, int pageSize, string? search)
        {
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var totalItems = await _notificationRepository.CountNotificationsAsync(search, searchDate);
            var notifications = await _notificationRepository.GetAllNotificationsAsync(pageNumber, pageSize, search, searchDate);

            var notificationDtos = notifications
                    .Select(n => new NotificationClassDTO
                    {
                        Id = n.Id,
                        VaccineName = n.Name ?? string.Empty,
                        Title = n.Title,
                        Type = n.Type,
                        Message = n.Message,
                        CreatedAt = n.CreatedAt,
                        ClassName = n.ClassName
                    }).ToList();

            return new PageResult<NotificationClassDTO>
            {
                Items = notificationDtos,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
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
                ClassName = classEntity.ClassName,
                NotificationStudents = studentsInClass.Select(s => new NotificationStudent
                {
                    StudentId = s.Id,
                    Status = "Pending"
                }).ToList()
            };
            var isSussess = await _notificationRepository.CreateNotificationAsync(notification);
            await _hub.Clients.Group(classEntity.ClassName).SendAsync("ReceiveNotification", new
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

        public async Task<NotificationCountDTO> GetNotificationCountsAsync(int parentId)
        {
            return await _notificationRepository.GetNotificationCountsAsync(parentId);
        }

        public async Task<NotificationAdminCountDTO> GetNotificationAdminCountsAsync()
        {
            return await _notificationRepository.GetNotificationAdminCountsAsync();
        }
    }
}