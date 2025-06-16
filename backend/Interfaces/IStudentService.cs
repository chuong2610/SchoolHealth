using backend.Models.DTO;
using backend.Models;


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
        }
}