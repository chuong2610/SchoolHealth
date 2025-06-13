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


        public async Task<bool> CreateAsync(Student student)
        {
            return await _studentRepository.CreateAsync(student);
        }

        public async Task<List<StudentDTO>> GetStudentsByNotificationIdAndConfirmedAsync(int notificationId)
        {
            var students = await _studentRepository.GetStudentsByNotificationIdAndConfirmedAsync(notificationId);
            return students.Select(s => new StudentDTO
            {
                Id = s.Id,
                StudentName = s.Name,
                ClassName = s.ClassName,
                DateOfBirth = s.DateOfBirth,
                StudentNumber = s.StudentNumber
            }).ToList();
        }
        public async Task<int> GetNumberOfStudents()
        {
            return await _studentRepository.GetNumberOfStudents();
        }
    }

}