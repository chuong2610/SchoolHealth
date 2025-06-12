using backend.Models.DTO;
using backend.Models;


namespace backend.Interfaces
{
    public interface IStudentService
    {

        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
        Task<StudentDTO?> GetStudentByIdAsync(int id);
        Task<StudentDTO?> GetStudentByStudentNumberAsync(string studentNumber);
    }
}