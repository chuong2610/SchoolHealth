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
                    ClassName = s.Class.ClassName,
                    DateOfBirth = s.DateOfBirth,
                    StudentNumber = s.StudentNumber
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


        public async Task<bool> CreateAsync(Student student)
        {
            return await _studentRepository.CreateAsync(student);
        }

        public async Task<List<StudentDTO>> GetStudentsByNotificationIdAndConfirmedAsync(int notificationId)
        {
            var students = await _studentRepository.GetStudentsByNotificationIdAndConfirmedAsync(notificationId);
            Console.WriteLine($"Number of students found: {students[0].Class.ClassName}");
            return students.Select(s => new StudentDTO
            {
                Id = s.Id,
                StudentName = s.Name,
                ClassName = s.Class.ClassName,
                DateOfBirth = s.DateOfBirth,
                StudentNumber = s.StudentNumber
            }).ToList();
        }
        public async Task<int> GetNumberOfStudents()
        {
            return await _studentRepository.GetNumberOfStudents();
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