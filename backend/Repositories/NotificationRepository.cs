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

        public async Task<List<Notification>> GetNotificationsByParentIdAsync(int parentId)
        {
            return await _context.Notifications
             .Include(n => n.NotificationStudents)
            .ThenInclude(ns => ns.Student)
                .Where(n => n.NotificationStudents
                    .Any(ns => ns.Student.ParentId == parentId))
                .ToListAsync();

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

        public async Task<IEnumerable<Notification>> GetAllNotificationAsync()
        {
            return await _context.Notifications.ToListAsync();
        }

        public async Task<Notification?> AddNotificationAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<Notification?> GetNoticeByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<Notification?> UpdateNotificationAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task DeleteNotificationAsync(Notification notification)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }

    }
}