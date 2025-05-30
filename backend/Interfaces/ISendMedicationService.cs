using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicationService
    {
        Task<string> SendMedicationAsync(SendMedicationDTO dto);
    }
}
