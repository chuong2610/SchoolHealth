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

        public async Task<List<Vaccination>> GetVaccinationsByNotificationIdAsync(int notificationId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .Where(v => v.NotificationId == notificationId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v =>
                    v.Nurse.Name.Contains(search) ||
                    v.Student.Name.Contains(search) ||
                    v.VaccineName.Contains(search) ||
                    v.Location.Contains(search) ||
                    v.Description.Contains(search) ||
                    v.Date.ToString().Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
            }

            return await query
                .OrderByDescending(v => v.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountVaccinationsByNotificationIdAsync(int notificationId, string? search)
        {
            var query = _context.Vaccinations
                .Include(v => v.Nurse)
                .Include(v => v.Student)
                .Where(v => v.NotificationId == notificationId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v =>
                    v.Nurse.Name.Contains(search) ||
                    v.Student.Name.Contains(search) ||
                    v.VaccineName.Contains(search) ||
                    v.Location.Contains(search) ||
                    v.Description.Contains(search) ||
                    v.Date.ToString().Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
            }

            return await query.CountAsync();
        }

        public async Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
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
                    v.Date.ToString().Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
            }

            return await query
                .OrderByDescending(v => v.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountVaccinationsByParentIdAsync(int parentId, string? search)
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
                    v.Date.ToString().Contains(search) ||
                    v.Student.Class.ClassName.Contains(search));
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