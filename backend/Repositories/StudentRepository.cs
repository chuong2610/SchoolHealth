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
                .Include(c => c.Class)
                .Where(s => s.ParentId == parentId)
                .ToListAsync();
        }
        public async Task<Student?> GetStudentByStudentNumberAsync(string studentNumber)
        {
            return await _context.Students
            .Include(s => s.Class)
             .Include(s => s.Parent)
            .FirstOrDefaultAsync(s => s.StudentNumber == studentNumber && s.Parent.IsActive);
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _context.Students
                .Include(s => s.Class)
                .Include(s => s.Parent)
                .FirstOrDefaultAsync(s => s.Id == id && s.Parent.IsActive);
        }

        public async Task<bool> CreateAsync(Student student)
        {
            _context.Students.Add(student);
            return await _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
        public async Task<List<Student>> GetStudentsByNotificationIdAndConfirmedAsync(int notificationId)
        {
            return await _context.NotificationStudents
                .Include(ns => ns.Student).ThenInclude(s => s.Class)
                .Where(ns => ns.NotificationId == notificationId && ns.Status == "Confirmed")
                .Select(ns => ns.Student)
                .ToListAsync();
        }
        public async Task<int> GetNumberOfStudents()
        {
            return await _context.Students
                .Where(s => s.IsActive && s.Parent.IsActive)
                .CountAsync(s => s.IsActive);
        }
        public async Task<List<Student>> GetStudentsByClassIdAsync(int classId)
        {
            return await _context.Students
                .Where(s => s.ClassId == classId && s.IsActive && s.Parent.IsActive)
                .ToListAsync();
        }

        public async Task<List<Student>> GetStudentByClassIdAsync(int classId, int pageNumber, int pageSize, string? search, DateOnly? searchDate)
        {
            var query = _context.Students
                .Where(s => s.ClassId == classId && s.IsActive && s.Parent.IsActive)
                .Include(s => s.Parent)
                .Include(s => s.Class)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();

                query = query.Where(s => s.Name.Contains(search) ||
                                         s.Class.ClassName.Contains(search) ||
                                         s.StudentNumber.Contains(search) ||
                                         s.Gender.ToLower() == searchLower);
            }
            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }

            return await query
                .OrderBy(s => s.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountStudentsAsync(int classId, string? search, DateOnly? searchDate)
        {
            var query = _context.Students
                .Where(s => s.ClassId == classId && s.IsActive && s.Parent.IsActive)
                .Include(s => s.Parent)
                .Include(s => s.Class)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();

                query = query.Where(s => s.Name.Contains(search) ||
                                         s.Class.ClassName.Contains(search) ||
                                         s.StudentNumber.Contains(search) ||
                                         s.Gender.ToLower() == searchLower ||
                                         s.Parent.Name.Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }

            return await query.CountAsync();
        }

        public async Task<bool> CreateStudentAsync(Student student)
        {
            _context.Students.Add(student);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateStudentAsync(Student student)
        {
            _context.Students.Update(student);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteStudentAsync(Student student)
        {
            student.IsActive = false;
            _context.Students.Update(student);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
