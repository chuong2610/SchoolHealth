using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalEventRepository
    {
        Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent);
        Task<MedicalEvent?> GetMedicalEventByIdAsync(int id);
        Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search);
        Task<int> CountMedicalEventsAsync(string? search);
        Task<List<MedicalEvent>> GetMedicalEventsTodayAsync();
        Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync();
    }
}