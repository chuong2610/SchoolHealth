using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicationService
    {
        Task<bool> CreateMedicationAsync(MedicationRequest request);
        Task<PageResult<MedicationDTO>> GetMedicationsPendingAsync(int pageNumber, int pageSize, string? search);
        Task<PageResult<MedicationDTO>> GetMedicationsActiveByNurseIdAsync(int id, int pageNumber, int pageSize, string? search);
        Task<List<MedicationDTO>> GetMedicationsActiveAsync();
        Task<List<MedicationDTO>> GetMedicationsCompletedAsync();
        Task<PageResult<MedicationDTO>> GetMedicationsCompletedByNurseIdAsync(int id, int pageNumber, int pageSize, string? search);
        Task<MedicationDetailDTO> GetMedicationDetailDTOAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
        Task<PageResult<MedicationDTO>> GetMedicationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);

    }
}

