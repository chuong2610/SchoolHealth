using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckRepository
    {
        Task<List<HealthCheck>> GetAllHealthChecksAsync();
        Task<HealthCheck> GetHealthCheckByIdAsync(int id);
        Task<List<HealthCheck>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize);
        Task<int> CountHealthChecksByParentIdAsync(int parentId);
        Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId, int pageNumber, int pageSize);
        Task<int> CountHealthChecksByNotificationIdAsync(int notificationId);
        Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck);
    }
}