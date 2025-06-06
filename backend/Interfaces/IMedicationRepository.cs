using backend.Models;

namespace backend.Repositories
{
    public interface IMedicationRepository
    {
        Task AddAsync(Medication medication);
        Task<List<Medication>> GetMedicationsPendingAsync();
        Task<List<Medication>> GetMedicationsByNurseIdAsync(int id);
        Task<Medication> GetMedicationByIdAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
    }
}


