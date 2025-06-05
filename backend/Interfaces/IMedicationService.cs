using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public interface IMedicationService
    {
        Task<bool> CreateMedicationAsync(MedicationRequest request);
        Task<List<MedicationDTO>> GetMedicationsPendingAsync();
        Task<List<MedicationDTO>> GetMedicationsByNurseIdAsync(int id);
        Task<MedicationDetailDTO> GetMedicationDetailDTOAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);

    }
}

