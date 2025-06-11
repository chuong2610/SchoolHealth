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


        public async Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId)
        {
            return await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => new StudentDTO
                {
                    Id = s.Id,
                    StudentName = s.Name,
                    ClassName = s.ClassName,
                    DateOfBirth = s.DateOfBirth
                })
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

        public Task<bool> CreateAsync(Student student)
        {
            _context.Students.Add(student);
            return _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
        public async Task<List<Student>> GetStudentsByNotificationIdAsync(int notificationId)
        {
            return await _context.NotificationStudents
                .Where(ns => ns.NotificationId == notificationId)
                .Select(ns => ns.Student)
                .ToListAsync();
        }
    }
}
