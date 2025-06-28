using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicalEventService
    {
        Task<bool> CreateMedicalEventAsync(MedicalEventRequest medicalEvent);
        Task<MedicalEventDetailDTO?> GetMedicalEventByIdAsync(int id);
        Task<PageResult<MedicalEventDTO>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search);
        Task<PageResult<MedicalEventDTO>> GetMedicalEventsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<List<MedicalEventDTO>> GetMedicalEventsTodayAsync();
        Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync();
        Task<MedicalEventCountDTO> GetEventCountsAsync();
    }
}