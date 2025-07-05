using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckService
    {
        Task<List<HealthCheckDTO>> GetAllHealthChecksAsync();
        Task<HealthCheckDetailDTO?> GetHealthCheckByIdAsync(int id);
        Task<PageResult<HealthCheckDTO>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<PageResult<HealthCheckDTO>> GetHealthChecksByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search);
        Task<List<HealthCheckDTO>> GetHealthChecksByNotificationIdAsync(int notificationId);
        Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck);
        Task<bool> SubmitResultAtHomeAsync(int healthCheckId);
        // Task<HealthCheck> CreateHealthCheckAsync(HealthCheck healthCheck);
        // Task<HealthCheck> UpdateHealthCheckAsync(int id, HealthCheck healthCheck);
        // Task DeleteHealthCheckAsync(int id);
    }
}