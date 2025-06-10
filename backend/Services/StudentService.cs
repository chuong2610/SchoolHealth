using backend.Interfaces;

using backend.Models.DTO;

using backend.Models;


namespace backend.Services
{
    public class StudentService : IStudentService
    {

        private readonly IStudentRepository _studentRepository;


        public StudentService(IStudentRepository repository)
        {
            _studentRepository = repository;
        }

        public async Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId)
        {
            return await _studentRepository.GetStudentIdsByParentIdAsync(parentId);
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

        public async Task<Student> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
                throw new Exception("Không tìm thấy học sinh");

            return student;
        }

        public Task<bool> CreateAsync(Student student)
        {
            return _studentRepository.CreateAsync(student);
        }
    }

}