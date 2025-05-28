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
            return await _context.HealthChecks.Include(h => h.Nurse) .Include(h => h.Student).ToListAsync();
        }



        public async Task<HealthCheck?> GetHealthCheckByIdAsync(int id)
        {
            return await _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<List<HealthCheck>> GetAllHealthChecksByParentIdAsync(int parentId)
        {
            return await _context.HealthChecks
                .Include(h => h.Nurse)
                .Include(h => h.Student)
                .Where(h => h.StudentId == parentId)
                .ToListAsync();
        }        
    }
}