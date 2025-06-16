using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicationRepository
    {
        Task<bool> AddAsync(Medication medication);
        Task<List<Medication>> GetMedicationsPendingAsync();
        Task<List<Medication>> GetMedicationsActiveByNurseIdAsync(int id);
        Task<List<Medication>> GetMedicationsActiveAsync();
        Task<List<Medication>> GetMedicationsCompletedAsync();
        Task<List<Medication>> GetMedicationsCompletedByNurseIdAsync(int id);
        Task<Medication> GetMedicationByIdAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
        Task<List<Medication>> GetMedicationsByParentIdAsync(int parentId);
    }
}


