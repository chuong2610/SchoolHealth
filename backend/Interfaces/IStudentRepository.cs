using backend.Models.DTO;
using backend.Models;

namespace backend.Interfaces
{
        public interface IStudentRepository
        {

                Task<List<Student>> GetStudentIdsByParentIdAsync(int parentId);
                Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);
                Task<Student> GetByIdAsync(int id);
                Task<bool> CreateAsync(Student student);
                Task<List<Student>> GetStudentsByNotificationIdAndConfirmedAsync(int notificationId);
                Task<int> GetNumberOfStudents();
                Task<List<Student>> GetStudentsByClassIdAsync(int classId);
                Task<List<Student>> GetStudentByClassIdAsync(int classId, int pageNumber, int pageSize, string? search, DateOnly? searchDate);
                Task<int> CountStudentsAsync(int classId, string? search, DateOnly? searchDate);
                Task<bool> CreateStudentAsync(Student student);
                Task<bool> UpdateStudentAsync(Student student);
                Task<bool> DeleteStudentAsync(Student student);
        }
}

