using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicalEventService
    {
        Task<bool> CreateMedicalEventAsync(MedicalEventRequest medicalEvent);
        Task<MedicalEventDetailDTO?> GetMedicalEventByIdAsync(int id);
        Task<List<MedicalEventDTO>> GetAllMedicalEventsAsync();
    }
}