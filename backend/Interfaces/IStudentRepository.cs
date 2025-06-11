using backend.Models.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface IStudentRepository
    {

        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);
        Task<Student> GetByIdAsync(int id);
        Task<bool> CreateAsync(Student student);
        Task<List<Student>> GetStudentsByNotificationIdAsync(int notificationId);


    }
}

