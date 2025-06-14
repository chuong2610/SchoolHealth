using backend.Data;
using backend.Interfaces;

using backend.Models.DTO;

using backend.Models;

using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }



        public async Task<List<Student>> GetStudentIdsByParentIdAsync(int parentId)
        {
            return await _context.Students
                .Where(s => s.ParentId == parentId)
                .ToListAsync();
        }



        public async Task<Student?> GetStudentByStudentNumberAsync(string studentNumber)
        {
            return await _context.Students
            .FirstOrDefaultAsync(s => s.StudentNumber == studentNumber);
        }

        public async Task<Student> GetByIdAsync(int id)
        {
            return await _context.Students.FindAsync(id);
        }


        public async Task<List<Student>> GetStudentsByClassIdAsync(int classId)
        {
            return await _context.Students
                .Where(s => s.ClassId == classId)
                .ToListAsync();
        }

        public async Task<User> GetParentByStudentIdAsync(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student?.ParentId == null) return null;

            return await _context.Users.FindAsync(student.ParentId);
        }

    }
}
