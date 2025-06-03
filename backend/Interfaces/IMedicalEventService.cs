using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicalEventService
    {
        Task<bool> CreateMedicalEventAsync(MedicalEventRequest medicalEvent);
       
    }
}