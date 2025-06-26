using backend.Models;

namespace backend.Interfaces
{
    public interface IHealthDeclareHistoryRepository
    {
        Task<List<HealthDeclareHistory>> GetHistoryByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<int> CountByParentIdAsync(int parentId, string? search);
        Task<HealthHistoryCountDTO> GetCountsByParentIdAsync(int parentId);
        Task<bool> AddAsync(HealthDeclareHistory history);
    }
}