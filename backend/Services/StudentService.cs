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
            var students = await _studentRepository.GetStudentIdsByParentIdAsync(parentId);

            return students
                .Select(s => new StudentDTO
                {
                    Id = s.Id,
                    StudentName = s.Name,
                    ClassName = s.Class?.ClassName,
                    DateOfBirth = s.DateOfBirth
                })
                .ToList();
        }

        public async Task<StudentDTO?> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null) return null;

            return new StudentDTO
            {
                Id = student.Id,
                StudentName = student.Name,
                ClassName = student.Class.ClassName,
                DateOfBirth = student.DateOfBirth
            };
        }

        public async Task<StudentDTO?> GetStudentByStudentNumberAsync(string studentNumber)
        {
            var student = await _studentRepository.GetStudentByStudentNumberAsync(studentNumber);
            if (student == null) return null;

            return new StudentDTO
            {
                Id = student.Id,
                StudentName = student.Name,
                ClassName = student.Class.ClassName,
                DateOfBirth = student.DateOfBirth
            };
        }
    }

}