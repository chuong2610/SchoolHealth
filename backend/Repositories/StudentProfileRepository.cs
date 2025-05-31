using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class StudentProfileRepository : IStudentProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<StudentProfile> CreateAsync(StudentProfile profile)
        {
            _context.StudentProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<StudentProfile?> GetByIdAsync(int id)
        {
            return await _context.StudentProfiles
                .Include(p => p.Student)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<StudentProfile>> GetAllByStudentIdAsync(int Id)
        {
            return await _context.StudentProfiles
                .Include(p => p.Student)
                .Where(p => p.Id == Id)
                .ToListAsync();
        }
    }
}
