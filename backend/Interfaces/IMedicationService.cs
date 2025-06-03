using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public interface IMedicationService
    {
        Task<List<MedicationDTO>> CreateMedicationAsync(List<BulkMedicationRequest> requests);
    }
}
