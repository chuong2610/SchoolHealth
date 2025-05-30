using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public interface IMedicationService
    {
        Task<MedicationRequest> CreateMedicationAsync(MedicationRequest request);
        Task<MedicationDTO> GetMedicationByIdAsync(int id);
        Task<IEnumerable<MedicationDTO>> GetAllMedicationsAsync();
    }
}
