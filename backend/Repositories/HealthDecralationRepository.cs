using backend.Interfaces;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class HealthDeclarationRepository : IHealthDeclarationRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthDeclarationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetStudentByInfoAsync(string name, string className, DateOnly dob)
        {
            return await _context.Students
                .Include(s => s.Profile)
                .FirstOrDefaultAsync(s =>
                    s.Name == name &&
                    s.ClassName == className &&
                    s.DateOfBirth == dob);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
