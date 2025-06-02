using backend.Models;

namespace backend.Repositories
{
    public interface IMedicationRepository
    {
        Task AddAsync(Medication medication);
    }
}
