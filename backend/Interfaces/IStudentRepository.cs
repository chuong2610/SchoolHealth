using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IStudentRepository
    {
        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
    }

}

