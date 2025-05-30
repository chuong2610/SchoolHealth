using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class MedicationRepository : IMedicationRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetStudentByNameAndClassAsync(string studentName, string className)
        {
            return await _context.Students
                .FirstOrDefaultAsync(s => s.Name == studentName && s.ClassName == className);
        }

        public async Task<User?> GetUserByFullNameAsync(string name)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Name == name);
        }

        public async Task AddMedicationAsync(Medication medication)
        {
            await _context.Medications.AddAsync(medication);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
