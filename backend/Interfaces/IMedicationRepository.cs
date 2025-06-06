using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicationRepository
    {
        Task<List<Medication>> GetMedicationsPendingAsync();
        Task<List<Medication>> GetMedicationsActiveByNurseIdAsync(int id);
        Task<List<Medication>> GetMedicationsCompletedByNurseIdAsync(int id);
        Task<Medication> GetMedicationByIdAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
        Task<List<Medication>> GetMedicationsByParentIdAsync(int parentId);
    }
}