using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthCheckService
    {
        Task<List<HealthCheckDTO>> GetAllHealthChecksAsync();
        // Task<HealthCheck> GetHealthCheckByIdAsync(int id);
        // Task<HealthCheck> CreateHealthCheckAsync(HealthCheck healthCheck);
        // Task<HealthCheck> UpdateHealthCheckAsync(int id, HealthCheck healthCheck);
        // Task DeleteHealthCheckAsync(int id);
    }
}