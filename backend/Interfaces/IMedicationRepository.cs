using backend.Models;

namespace backend.Repositories
{
    public interface IMedicationRepository
    {
        Task AddAsync(Medication medication);
        Task<Medication> GetByIdAsync(int id);
        Task<IEnumerable<Medication>> GetAllAsync();
    }
}
