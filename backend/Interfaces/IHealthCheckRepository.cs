using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckRepository
    {
        Task<List<HealthCheck>> GetAllHealthChecksAsync();
        Task<HealthCheck> GetHealthCheckByIdAsync(int id);
        Task<List<HealthCheck>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<int> CountHealthChecksByParentIdAsync(int parentId, string? search);
        Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId, int pageNumber, int pageSize, string? search);
        Task<int> CountHealthChecksByNotificationIdAsync(int notificationId, string? search);
        Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck);
    }
}