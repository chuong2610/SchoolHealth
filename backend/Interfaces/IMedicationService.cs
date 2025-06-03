using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicationService
    {
        Task<List<MedicationDTO>> GetMedicationsPendingAsync();
        Task<List<MedicationDTO>> GetMedicationsByNurseIdAsync(int id);
        Task<MedicationDetailDTO> GetMedicationDetailDTOAsync(int id);
        Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId);
    }
}