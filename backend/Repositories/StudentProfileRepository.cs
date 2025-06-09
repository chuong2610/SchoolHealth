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

        public async Task<StudentProfile> CreateOrUpdateAsync(StudentProfile profile)
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

            await _context.SaveChangesAsync();

            return profile;
        }


        public async Task<StudentProfile?> GetByIdAsync(int id)
        {
            return await _context.StudentProfiles
                .Include(p => p.Student)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
