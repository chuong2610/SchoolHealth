using backend.Data;
using backend.Interfaces;
using backend.Models;
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

        public async Task<(List<NotificationStudent> Items, int TotalItems)> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Student.ParentId == parentId);

            // Lọc title nếu có
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(ns => ns.NotificationId) // Sắp xếp theo Id thông báo
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalItems);
        }

        public async Task<int> CountNotificationStudentsByParentIdAsync(int parentId, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Student)
                .Include(ns => ns.Notification)
                .Where(ns => ns.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
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
        public async Task<(List<NotificationStudent> Items, int TotalItems)> GetHealthChecksNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Notification.Type == "HealthCheck" && ns.Student.ParentId == parentId);

            // Khi có title thì filter thêm
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .OrderByDescending(ns => ns.NotificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalItems);
        }
        public async Task<int> GetHealthChecksNotificationsCountByParentIdAsync(int parentId, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Where(ns => ns.Student.ParentId == parentId && ns.Notification.Type == "HealthCheck");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
            }

            return await query.CountAsync();
        }
        public async Task<(List<NotificationStudent> Items, int TotalItems)> GetVaccinationsNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Include(ns => ns.Student)
                .Where(ns => ns.Notification.Type == "Vaccination" && ns.Student.ParentId == parentId);

            // ✅ Kiểm tra nếu title có được nhập hay không
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(ns => ns.NotificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalItems);
        }

        public async Task<int> GetVaccinationsNotificationsCountByParentIdAsync(int parentId, string? search)
        {
            var query = _context.NotificationStudents
                .Include(ns => ns.Notification)
                .Where(ns => ns.Student.ParentId == parentId && ns.Notification.Type == "Vaccination");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ns => ns.Notification.Title.Contains(search));
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


        public async Task<List<Notification>> GetAllNotificationsAsync(int pageNumber, int pageSize)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                    .ThenInclude(ns => ns.Student)
                        .ThenInclude(s => s.Class)
                .Where(n => n.IsActive)
                .OrderByDescending(n => n.Id) // Sắp xếp để kết quả ổn định
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountNotificationsAsync()
        {
            return await _context.Notifications
                .Where(n => n.IsActive)
                .CountAsync();
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
                                ns.Status == "Pending"
                            )
                        );
        }

    }
}