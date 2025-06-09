using backend.Data;
using backend.Interfaces;
using backend.Models;


namespace backend.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;
        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetStudentByStudentNumberAsync(string studentNumber)
        {
            return await _context.Students
            .FirstOrDefaultAsync(s => s.StudentNumber == studentNumber);
        }
    }
}