using backend.Models.DTO;
using backend.Models;
using backend.Models.Request;


namespace backend.Interfaces
{
        public interface IStudentService
        {

                Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
                Task<bool> CreateAsync(Student student);
                Task<List<StudentDTO>> GetStudentsByNotificationIdAndConfirmedAsync(int notificationId);
                Task<int> GetNumberOfStudents();
                Task<StudentDTO?> GetStudentByIdAsync(int id);
                Task<StudentDTO?> GetStudentByStudentNumberAsync(string studentNumber);
                Task<PageResult<StudentsDTO>> GetStudentByClassIdAsync(int classId, int pageNumber, int pageSize, string? search);
                Task<bool> CreateStudentAsync(StudentCreateRequest request);
                Task<bool> UpdateStudentAsync(int id, StudentRequest request);
                Task<bool> DeleteStudentAsync(int id);
        }
}