using backend.Interfaces;

using backend.Models.DTO;

using backend.Models;
using backend.Models.Request;
using System.Globalization;


namespace backend.Services
{
    public class StudentService : IStudentService
    {

        private readonly IStudentRepository _studentRepository;
        private readonly IUserRepository _userRepository;


        public StudentService(IStudentRepository repository, IUserRepository userRepository)
        {
            _studentRepository = repository;
            _userRepository = userRepository;
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

        public async Task<PageResult<StudentsDTO>> GetStudentByClassIdAsync(int classId, int pageNumber, int pageSize, string? search)
        {
            DateOnly? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateOnly.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;
            var students = await _studentRepository
                .GetStudentByClassIdAsync(classId, pageNumber, pageSize, search, searchDate);

            var totalItems = await _studentRepository
                .CountStudentsAsync(classId, search, searchDate);

            var studentDtos = students.Select(s => new StudentsDTO
            {
                Id = s.Id,
                StudentName = s.Name,
                StudentNumber = s.StudentNumber,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,
                ParentName = s.Parent.Name,
                ClassName = s.Class.ClassName
            }).ToList();

            return new PageResult<StudentsDTO>
            {
                Items = studentDtos,
                TotalItems = totalItems,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }

        public async Task<bool> CreateStudentAsync(StudentCreateRequest request)
        {
            var existing = await _studentRepository.GetStudentByStudentNumberAsync(request.StudentNumber);
            if (existing != null)
            {
                return false;
            }
            var newStudent = new Student
            {
                Name = request.Name,
                StudentNumber = request.StudentNumber,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                ClassId = request.ClassId,
                IsActive = true
            };
            var parent = await _userRepository.GetUserByPhoneAsync(request.ParentPhone);
            if (parent == null)
            {
                newStudent.Parent = new User
                {
                    Name = request.ParentName,
                    Phone = request.ParentPhone,
                    Email = request.ParentEmail,
                    Address = request.ParentAddress,
                    IsActive = true,

                    RoleId = 3,
                    Password = "defaultPassword",
                    Gender = request.ParentGender,
                    DateOfBirth = request.DateOfBirth,
                    IsVerified = false,
                    ImageUrl = "default.jpg"
                };
            }
            else
            {
                newStudent.ParentId = parent.Id;
            }


            return await _studentRepository.CreateStudentAsync(newStudent);
        }

        public async Task<bool> UpdateStudentAsync(int id, StudentRequest request)
        {
            var existingStudent = await _studentRepository.GetByIdAsync(id);
            if (existingStudent == null)
            {
                return false;
            }

            // Cập nhật Name
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                existingStudent.Name = request.Name;
            }

            // Cập nhật StudentNumber
            if (!string.IsNullOrWhiteSpace(request.StudentNumber))
            {
                existingStudent.StudentNumber = request.StudentNumber;
            }

            // Cập nhật Gender
            if (!string.IsNullOrWhiteSpace(request.Gender))
            {
                existingStudent.Gender = request.Gender;
            }

            // Cập nhật DateOfBirth
            if (request.DateOfBirth.HasValue)
            {
                existingStudent.DateOfBirth = request.DateOfBirth.Value;
            }

            // Cập nhật ClassId
            if (request.ClassId.HasValue)
            {
                existingStudent.ClassId = request.ClassId.Value;
            }

            // Cập nhật ParentId
            if (request.ParentId.HasValue)
            {
                existingStudent.ParentId = request.ParentId.Value;
            }

            var updated = await _studentRepository.UpdateStudentAsync(existingStudent);
            return updated;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var user = await _studentRepository.GetByIdAsync(id);
            if (user == null || !user.IsActive)
            {
                return false;
            }
            if (_studentRepository.GetStudentIdsByParentIdAsync(user.ParentId).Result.Count == 1)
            {
                user.IsActive = false;
                await _userRepository.DeleteUserAsync(user.ParentId);
            }
            return await _studentRepository.DeleteStudentAsync(user);
        }
    }

}