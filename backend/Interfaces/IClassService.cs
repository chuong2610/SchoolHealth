using backend.Models.DTO;


namespace backend.Interfaces
{
    public interface IClassService
    {
        Task<IEnumerable<ClassDTO>> GetAllClassAsync();
    }
}
