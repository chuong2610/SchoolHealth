using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class HealthCheckRepository : IHealthCheckRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthCheckRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<HealthCheck>> GetAllHealthChecksAsync()
        {
            return await _context.HealthChecks.Include(h => h.Nurse).Include(h => h.Student).ToListAsync();
        }



        public async Task<HealthCheck?> GetHealthCheckByIdAsync(int id)
        {
            return await _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<List<HealthCheck>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize)
        {
            return await _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.Student.ParentId == parentId)
                .OrderByDescending(h => h.Id) // Sắp xếp để phân trang ổn định
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountHealthChecksByParentIdAsync(int parentId)
        {
            return await _context.HealthChecks
                .CountAsync(h => h.Student.ParentId == parentId);
        }

        public async Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId, int pageNumber, int pageSize)
        {
            return await _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.NotificationId == notificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountHealthChecksByNotificationIdAsync(int notificationId)
        {
            return await _context.HealthChecks
                .CountAsync(h => h.NotificationId == notificationId);
        }


        public async Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck)
        {
            _context.HealthChecks.Add(healthCheck);
            return await _context.SaveChangesAsync() > 0;

        }

    }
}