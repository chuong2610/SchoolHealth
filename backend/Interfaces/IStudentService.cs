using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IStudentService
    {
        Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId);
    }

}