using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalEventRepository
    {
        Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent);
    }
}