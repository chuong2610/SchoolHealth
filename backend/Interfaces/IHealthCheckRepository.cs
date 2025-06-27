using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckRepository
    {
        Task<List<HealthCheck>> GetAllHealthChecksAsync();
        Task<HealthCheck> GetHealthCheckByIdAsync(int id);
        Task<List<HealthCheck>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountHealthChecksByParentIdAsync(int parentId, string? search, DateTime? searchDate);
        Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId);
        Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck);
    }
}