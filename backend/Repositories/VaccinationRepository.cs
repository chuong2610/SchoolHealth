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
                .FirstOrDefaultAsync(v => v.Id == id);
        }
    }
}