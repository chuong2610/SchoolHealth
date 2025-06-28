using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicalEventRepository
    {
        Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent);
        Task<MedicalEvent?> GetMedicalEventByIdAsync(int id);
        Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountMedicalEventsAsync(string? search, DateTime? searchDate);
        Task<PageResult<MedicalEvent>> GetMedicalEventsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<List<MedicalEvent>> GetMedicalEventsTodayAsync();
        Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync();
        Task<MedicalEventCountDTO> GetMedicalEventCountsAsync();
    }
}