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

        public async Task<List<HealthCheck>> GetHealthChecksByParentIdAsync(
    int parentId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h => h.Student.Name.Contains(search)
                                       || h.Nurse.Name.Contains(search));
            }

            return await query
                .OrderByDescending(h => h.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountHealthChecksByParentIdAsync(int parentId, string? search)
        {
            var query = _context.HealthChecks
                .Where(h => h.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h => h.Student.Name.Contains(search)
                                       || h.Nurse.Name.Contains(search));
            }

            return await query.CountAsync();
        }

        public async Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.NotificationId == notificationId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h =>
                    h.Nurse.Name.Contains(search) ||
                    h.Student.Name.Contains(search));
            }

            return await query
                .OrderByDescending(h => h.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountHealthChecksByNotificationIdAsync(int notificationId, string? search)
        {
            var query = _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.NotificationId == notificationId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h =>
                    h.Nurse.Name.Contains(search) ||
                    h.Student.Name.Contains(search));
            }

            return await query.CountAsync();
        }


        public async Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck)
        {
            _context.HealthChecks.Add(healthCheck);
            return await _context.SaveChangesAsync() > 0;

        }

    }
}