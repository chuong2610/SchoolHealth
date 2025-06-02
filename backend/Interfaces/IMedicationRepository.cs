using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicationRepsitory
    {
        Task<List<Medication>> GetMedicationsPendingAsync();
        Task<List<Medication>> GetMedicationsByNurseIdAsync(int id);
        Task<Medication> GetMedicationByIdAsync(int id);
    }
}