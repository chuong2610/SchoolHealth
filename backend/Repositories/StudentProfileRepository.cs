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

        public async Task<bool> CreateOrUpdateAsync(StudentProfile profile)
        {
            var existingProfile = await _context.StudentProfiles.FindAsync(profile.Id);

            if (existingProfile == null)
            {
                _context.StudentProfiles.Add(profile);
            }
            else
            {
                existingProfile.Allergys = profile.Allergys;
                existingProfile.ChronicIllnesss = profile.ChronicIllnesss;
                existingProfile.LongTermMedications = profile.LongTermMedications;
                existingProfile.OtherMedicalConditions = profile.OtherMedicalConditions;
            }

            var createdOrUpdated = await _context.SaveChangesAsync();

            return createdOrUpdated > 0;
        }


        public async Task<StudentProfile?> GetByIdAsync(int id)
        {
            return await _context.StudentProfiles
                .Include(p => p.Student)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<StudentProfile> GetByIdWithIncludesAsync(int studentId)
        {
            return await _context.StudentProfiles
                .Include(sp => sp.Student)
                .ThenInclude(s => s.Class)
                .FirstOrDefaultAsync(sp => sp.Id == studentId);
        }
        public async Task<StudentProfile?> GetByStudentIdAsync(int studentId)
        {
            return await _context.StudentProfiles
                .Include(p => p.Student)
                .ThenInclude(s => s.Class)
                .FirstOrDefaultAsync(p => p.Student.Id == studentId);
        }
    }
}
