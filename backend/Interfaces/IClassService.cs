using backend.Models;
using backend.Models.DTO;


namespace backend.Interfaces
{
    public interface IClassService
    {
        Task<IEnumerable<ClassDTO>> GetAllClassAsync();
        Task<Class?> GetClassByNameAsync(string className);
    }
}
