using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicalEventRepository
    {
        Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent);
        Task<MedicalEvent?> GetMedicalEventByIdAsync(int id);
<<<<<<< HEAD
        Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountMedicalEventsAsync(string? search, DateTime? searchDate);
=======
        Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search);
        Task<PageResult<MedicalEvent>> GetMedicalEventsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<int> CountMedicalEventsAsync(string? search);
>>>>>>> 81db99e0690eb4201c0e0264f141949037c9e623
        Task<List<MedicalEvent>> GetMedicalEventsTodayAsync();
        Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync();
        Task<MedicalEventCountDTO> GetMedicalEventCountsAsync();
    }
}