using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthDeclareHistoryService
    {
        Task<PageResult<HealthDeclareHistoryDTO>> GetHealthDeclareHistoriesAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<HealthHistoryCountDTO> GetHealthHistoryCountsByParentIdAsync(int parentId);
    }
}