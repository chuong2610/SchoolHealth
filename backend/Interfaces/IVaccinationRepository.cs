using backend.Models;

namespace backend.Repositories
{
    public interface IVaccinationRepository
    {
        Task<List<Vaccination>> GetAllVaccinationsAsync();
        Task<Vaccination?> GetVaccinationByIdAsync(int id);
        Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId);
        
    }
}