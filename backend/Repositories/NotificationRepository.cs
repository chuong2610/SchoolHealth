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

        public async Task<List<Notification>> GetNotificationsByParentIdAsync(int parentId, int pageNumber, int pageSize)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                .ThenInclude(ns => ns.Student)
                .Where(n => n.NotificationStudents
                    .Any(ns => ns.Student.ParentId == parentId))
                .OrderByDescending(n => n.Id) // Sắp xếp để phân trang ổn định
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountNotificationsByParentIdAsync(int parentId)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                .ThenInclude(ns => ns.Student)
                .CountAsync(n => n.NotificationStudents.Any(ns => ns.Student.ParentId == parentId));
        }


        public async Task<List<Notification>> GetHealthChecksNotificationsByParentIdAsync(int parentId)
        {
            return await _context.Notifications
             .Include(n => n.NotificationStudents)
            .ThenInclude(ns => ns.Student)
                .Where(n => n.Type == "HealthCheck" && n.NotificationStudents
                    .Any(ns => ns.Student.ParentId == parentId))
                .ToListAsync();
        }

        public async Task<List<Notification>> GetVaccinationsNotificationsByParentIdAsync(int parentId)
        {
            return await _context.Notifications
             .Include(n => n.NotificationStudents)
            .ThenInclude(ns => ns.Student)
                .Where(n => n.Type == "Vaccination" && n.NotificationStudents
                    .Any(ns => ns.Student.ParentId == parentId))
                .ToListAsync();
        }

        public async Task<Notification?> GetNotificationByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                .ThenInclude(ns => ns.Student)
                .FirstOrDefaultAsync(n => n.Id == id);
        }


        public async Task<List<Notification>> GetAllNotificationsAsync()
        {
            return await _context.Notifications
                .Include(n => n.NotificationStudents)
                    .ThenInclude(ns => ns.Student)
                        .ThenInclude(s => s.Class)
                .Where(n => n.IsActive)
                .ToListAsync();
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
    }
}