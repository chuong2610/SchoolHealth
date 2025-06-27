using backend.Models;

namespace backend.Interfaces
{
    public interface IHealthDeclareHistoryRepository
    {
        Task<List<HealthDeclareHistory>> GetHistoryByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountByParentIdAsync(int parentId, string? search, DateTime? searchDate);
        Task<HealthHistoryCountDTO> GetCountsByParentIdAsync(int parentId);
        Task<bool> AddAsync(HealthDeclareHistory history);
    }
}