using backend.Models;
using backend.Models.DTO;


namespace backend.Interfaces
{
    public interface IClassRepository
    {
        Task<IEnumerable<Class>> GetAllAsync();
        Task<Class> GetClassByIdAsync(int classId);
    }
}
