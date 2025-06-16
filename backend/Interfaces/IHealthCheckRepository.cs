using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckRepository
    {
        Task<List<HealthCheck>> GetAllHealthChecksAsync();
        Task<HealthCheck> GetHealthCheckByIdAsync(int id);
        Task<List<HealthCheck>> GetAllHealthChecksByParentIdAsync(int parentId);
        Task<List<HealthCheck>> GetHealthChecksByNotificationIdAsync(int notificationId);
        Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck);
    }   
}