using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicationService
    {
        Task<bool> CreateMedicationAsync(MedicationRequest request);
        Task<List<MedicationDTO>> GetMedicationsPendingAsync();
        Task<List<MedicationDTO>> GetMedicationsActiveByNurseIdAsync(int id);
        Task<List<MedicationDTO>> GetMedicationsActiveAsync();
        Task<List<MedicationDTO>> GetMedicationsCompletedAsync();
        Task<List<MedicationDTO>> GetMedicationsCompletedByNurseIdAsync(int id);
        Task<MedicationDetailDTO> GetMedicationDetailDTOAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
        Task<List<MedicationDTO>> GetMedicationsByParentIdAsync(int parentId);

    }
}

