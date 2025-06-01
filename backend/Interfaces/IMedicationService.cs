using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public interface IMedicationService
    {
        Task<MedicationDTO> CreateMedicationAsync(MedicationRequest request);
    }
}
