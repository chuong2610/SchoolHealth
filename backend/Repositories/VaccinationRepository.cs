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

        public Task<List<Vaccination>> GetVaccinationByNotificationIdAsync(int notificationId)
        {
            return _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .Where(v => v.NotificationId == notificationId)
                .ToListAsync();
        }


        public async Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .ThenInclude(c => c.Class)
                .Where(v => v.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v =>
                    v.Nurse.Name.Contains(search) ||
                    v.Student.Name.Contains(search) ||
                    v.VaccineName.Contains(search) ||
                    v.Location.Contains(search) ||
                    v.Description.Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(m => m.Date.Date == searchDate.Value.Date);
            }

            return await query
                .OrderByDescending(v => v.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountVaccinationsByParentIdAsync(int parentId, string? search, DateTime? searchDate)
        {
            var query = _context.Vaccinations
                .Where(v => v.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v =>
                    v.Nurse.Name.Contains(search) ||
                    v.Student.Name.Contains(search) ||
                    v.VaccineName.Contains(search) ||
                    v.Location.Contains(search) ||
                    v.Description.Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(m => m.Date.Date == searchDate.Value.Date);
            }

            return await query.CountAsync();
        }
        public async Task<bool> CreateVaccinationAsync(Vaccination vaccination)
        {
            _context.Vaccinations.Add(vaccination);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}