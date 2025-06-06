using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        public StudentService(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }
        public async Task<Student?> GetStudentByStudentNumberAsync(string studentNumber)
        {
            Student? student = await _studentRepository.GetStudentByStudentNumberAsync(studentNumber);
            if (student == null)
            {
                return null;
            }
            return student;
        }

    }
}