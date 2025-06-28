using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationStudent>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query
                .OrderByDescending(ns => ns.NotificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Where(ns => ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query.CountAsync();
        }

        // public async Task<List<Notification>> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize)
        // {
        //     return await _context.Notifications
        //         .Include(n => n.NotificationStudents)
        //             .ThenInclude(ns => ns.Student)
        //         .Where(n => n.Type == "HealthCheck" &&
        //                     n.NotificationStudents.Any(ns => ns.Student.ParentId == parentId))
        //         .OrderByDescending(n => n.Id) // Sắp xếp nếu cần
        //         .Skip((pageNumber - 1) * pageSize)
        //         .Take(pageSize)
        //         .ToListAsync();
        // }
        public async Task<List<NotificationStudent>> GetHealthChecksNotificationsByParentIdAsync(
            int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Notification.Type == "HealthCheck"
                            && ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query
                .OrderByDescending(ns => ns.NotificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<int> CountHealthChecksNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Where(ns => ns.Notification.Type == "HealthCheck"
                            && ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query.CountAsync();
        }
        public async Task<List<NotificationStudent>> GetVaccinationsNotificationsByParentIdAsync(
            int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Notification.Type == "Vaccination"
                            && ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query
                .OrderByDescending(ns => ns.NotificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<int> CountVaccinationsNotificationsByParentIdAsync(int parentId, string? search, DateTime? searchDate)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Where(ns => ns.Notification.Type == "Vaccination"
                            && ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns =>
                    ns.Notification.Title.Contains(search) ||
                    ns.Student.Name.Contains(search) ||
                    ns.Status.Contains(search) ||
                    ns.Notification.Name.Contains(search) ||
                    ns.Notification.Message.Contains(search) ||
                    ns.Notification.Type.Contains(search)
                );
            }

            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.Notification.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query.CountAsync();
        }

        public async Task<Notification?> GetNotificationByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                .ThenInclude(ns => ns.Student)
                .FirstOrDefaultAsync(n => n.Id == id);
        }


        public async Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.Notifications
                .Include(n => n.NotificationStudents)
                    .ThenInclude(ns => ns.Student)
                        .ThenInclude(c => c.Class)
                .Where(n => n.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => n.Title.Contains(search) ||
                                         n.Location.Contains(search) ||
                                         n.Type.Contains(search) ||
                                         n.Message.Contains(search) ||
                                         n.ClassName.Contains(search) ||
                                         n.Id.ToString().Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.CreatedAt.Date == searchDate.Value.Date
                );
            }


            return await query
                .OrderByDescending(n => n.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountNotificationsAsync(string? search, DateTime? searchDate)
        {
            var query = _context.Notifications
               .Include(n => n.NotificationStudents)
                   .ThenInclude(ns => ns.Student)
                       .ThenInclude(s => s.Class)
               .Where(n => n.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => n.Title.Contains(search) ||
                                         n.Location.Contains(search) ||
                                         n.Type.Contains(search) ||
                                         n.Message.Contains(search) ||
                                         n.ClassName.Contains(search) ||
                                         n.Id.ToString().Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(ns =>
                    ns.CreatedAt.Date == searchDate.Value.Date
                );
            }

            return await query.CountAsync();
        }

        public async Task<bool> CreateNotificationAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<Notification?> GetNoticeByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<bool> UpdateNotificationAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }

        public async Task<bool> DeleteNotificationAsync(Notification notification)
        {
            notification.IsActive = false;
            _context.Notifications.Update(notification);
            var deleted = await _context.SaveChangesAsync();
            return deleted > 0;
        }

        public async Task<List<Notification>> GetNotificationsByNurseIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                .ThenInclude(ns => ns.Student)
                .Where(n => n.AssignedToId == id)
                .ToListAsync();
        }

        public async Task<List<Notification>> Get5Notifications()
        {
            return await _context.Notifications
            .Include(n => n.NotificationStudents)
            .OrderByDescending(n => n.CreatedAt)
            .Take(5)
            .ToListAsync();
        }
        public async Task<bool> HasNotificationAsync(int parentId)
        {
            return await _context.Notifications
                        .AnyAsync(n =>
                            n.NotificationStudents.Any(ns =>
                                ns.Student.ParentId == parentId &&
                                ns.Status == "Pending"));
        }

        public async Task<NotificationCountDTO> GetNotificationCountsAsync(int parentId)
        {
            var counts = await _context.NotificationStudents
                .Where(n => n.Student.ParentId == parentId)
                .GroupBy(n => n.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var pending = counts.FirstOrDefault(c => c.Status == "Pending")?.Count ?? 0;
            var confirmed = counts.FirstOrDefault(c => c.Status == "Confirmed")?.Count ?? 0;
            var rejected = counts.FirstOrDefault(c => c.Status == "Rejected")?.Count ?? 0;

            return new NotificationCountDTO
            {
                TotalNotification = pending + confirmed + rejected,
                PendingNotification = pending,
                ConfirmedNotification = confirmed,
                RejectedNotification = rejected
            };
        }

        public async Task<NotificationAdminCountDTO> GetNotificationAdminCountsAsync()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var total = await _context.Notifications.CountAsync();
            var vaccination = await _context.Notifications.CountAsync(n => n.Type == "Vaccination");
            var healthcheck = await _context.Notifications.CountAsync(n => n.Type == "HealthCheck");
            var sentToday = await _context.Notifications.CountAsync(
                n => n.Date >= today && n.Date < tomorrow);

            return new NotificationAdminCountDTO
            {
                TotalNotifications = total,
                VaccinationNotifications = vaccination,
                HealthcheckNotifications = healthcheck,
                NotificationsSentToday = sentToday
            };
        }
    }
}