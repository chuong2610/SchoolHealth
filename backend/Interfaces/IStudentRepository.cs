using backend.Models.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface IStudentRepository
    {

        Task<List<Student>> GetStudentIdsByParentIdAsync(int parentId);
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);
        Task<Student> GetByIdAsync(int id);
        Task<List<Student>> GetStudentsByClassNameAsync(string className);
        Task<User> GetParentByStudentIdAsync(int studentId);
        Task<List<string>> GetClassNamesByParentIdAsync(int parentId);
    }
}

