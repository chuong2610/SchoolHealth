using backend.Models.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface IStudentRepository
    {

        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);

    }
}

