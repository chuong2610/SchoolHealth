using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicationRepository
    {
        Task<bool> AddAsync(Medication medication);
        Task<List<Medication>> GetMedicationsPendingAsync(int? pageNumber, int? pageSize, string? search, DateTime? searchDate);
        Task<int> CountPendingMedicationsAsync(string? search, DateTime? searchDate);
        Task<List<Medication>> GetMedicationsActiveByNurseIdAsync(int id, int? pageNumber, int? pageSize, string? search, DateTime? searchDate);
        Task<int> CountMedicationsActiveByNurseIdAsync(int id, string? search, DateTime? searchDate);
        Task<List<Medication>> GetMedicationsActiveAsync();
        Task<List<Medication>> GetMedicationsCompletedAsync();
        Task<List<Medication>> GetMedicationsCompletedByNurseIdAsync(int id, int? pageNumber, int? pageSize, string? search, DateTime? searchDate);
        Task<int> CountMedicationsCompletedByNurseIdAsync(int id, string? search, DateTime? searchDate);
        Task<Medication> GetMedicationByIdAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
        Task<List<Medication>> GetMedicationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountMedicationsByParentIdAsync(int parentId, string? search, DateTime? searchDate);
        Task<MedicationCountDTO> GetMedicationCountsAsync();
    }
}


