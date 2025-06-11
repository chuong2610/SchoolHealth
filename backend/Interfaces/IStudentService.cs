using backend.Models.DTO;
using backend.Models;


namespace backend.Interfaces
{
    public interface IStudentService
    {

        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);
        Task<Student> GetStudentByIdAsync(int id);
        Task<bool> CreateAsync(Student student);
        Task<List<StudentDTO>> GetStudentsByNotificationIdAsync(int notificationId);
    }

}