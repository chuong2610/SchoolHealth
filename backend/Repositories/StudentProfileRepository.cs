using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class StudentProfileRepository : IStudentProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentProfileRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<StudentProfile> CreateAsync(StudentProfileRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrEmpty(request.StudentName) || string.IsNullOrEmpty(request.Class))
                throw new ArgumentException("Student name and class are required.");
            if (string.IsNullOrEmpty(request.Allergys) && string.IsNullOrEmpty(request.ChronicIllnesss) && string.IsNullOrEmpty(request.TreatmentHistory))
                throw new ArgumentException("At least one health-related field (Allergys, ChronicIllnesss, or TreatmentHistory) is required.");

            try
            {
                // Tìm học sinh dựa trên StudentName và Class
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Name == request.StudentName && s.ClassName == request.Class);
                if (student == null)
                    throw new ArgumentException($"Student with Name '{request.StudentName}' and Class '{request.Class}' not found.");

                var studentProfile = new StudentProfile
                {
                    Allergys = request.Allergys,
                    ChronicIllnesss = request.ChronicIllnesss,
                    LongTermMedications = request.TreatmentHistory,
                    OtherMedicalConditions = request.AdditionalNotes,
                    Student = student
                };

                _context.StudentProfiles.Add(studentProfile);
                await _context.SaveChangesAsync();

                return await _context.StudentProfiles
                    .Include(sp => sp.Student)
                    .FirstAsync(sp => sp.Id == studentProfile.Id);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create student profile record.", ex);
            }
        }

        public async Task<StudentProfile?> GetByIdAsync(int id)
        {
            return await _context.StudentProfiles
                .Include(sp => sp.Student)
                .FirstOrDefaultAsync(sp => sp.Id == id);
        }

        public async Task<IEnumerable<StudentProfile>> GetAllByStudentIdAsync(int studentId)
        {
            return await _context.StudentProfiles
                .Include(sp => sp.Student)
                .Where(sp => sp.Student.Id == studentId)
                .ToListAsync();
        }
    }
}