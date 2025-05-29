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

    }
}