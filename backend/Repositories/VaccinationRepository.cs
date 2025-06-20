using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class VaccinationRepository : IVaccinationRepository
    {
        private readonly ApplicationDbContext _context;

        public VaccinationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Vaccination>> GetAllVaccinationsAsync()
        {
            return await _context.Vaccinations.Include(v => v.Nurse).ToListAsync();
        }

        public async Task<Vaccination?> GetVaccinationByIdAsync(int id)
        {
            return await _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<List<Vaccination>> GetVaccinationsByNotificationIdAsync(int notificationId, int pageNumber, int pageSize)
        {
            return await _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .Where(v => v.NotificationId == notificationId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountVaccinationsByNotificationIdAsync(int notificationId)
        {
            return await _context.Vaccinations
                .CountAsync(v => v.NotificationId == notificationId);
        }

        public async Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize)
        {
            return await _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .Where(v => v.Student.ParentId == parentId)
                .OrderByDescending(v => v.Id) // hoặc OrderBy nào bạn muốn
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountVaccinationsByParentIdAsync(int parentId)
        {
            return await _context.Vaccinations.CountAsync(v => v.Student.ParentId == parentId);
        }
        public async Task<bool> CreateVaccinationAsync(Vaccination vaccination)
        {
            _context.Vaccinations.Add(vaccination);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}