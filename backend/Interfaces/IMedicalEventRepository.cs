using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalEventRepository
    {
        Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent);
        Task<MedicalEvent?> GetMedicalEventByIdAsync(int id);
        Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize);
        Task<int> CountMedicalEventsAsync();
        Task<List<MedicalEvent>> GetMedicalEventsTodayAsync();
        Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync();
    }
}