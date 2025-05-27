using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly IHealthCheckRepository _healthCheckRepository;

        public HealthCheckService(IHealthCheckRepository healthCheckRepository)
        {
            _healthCheckRepository = healthCheckRepository;
        }

        public async Task<List<HealthCheckDTO>> GetAllHealthChecksAsync()
        {
            var healthChecks = await _healthCheckRepository.GetAllHealthChecksAsync();
            return healthChecks.Select(p => MapToDTO(p)).ToList();
        }

        public async Task<HealthCheckDetailDTO?> GetHealthCheckByIdAsync(int id)
        {
            var healthCheck = await _healthCheckRepository.GetHealthCheckByIdAsync(id);
            if (healthCheck == null)
            {
                return null;
            }

            return new HealthCheckDetailDTO
            {
                Height = healthCheck.Height,
                Weight = healthCheck.Weight,
                VisionLeft = healthCheck.VisionLeft,
                VisionRight = healthCheck.VisionRight,
                Bmi = healthCheck.Bmi,
                BloodPressure = healthCheck.BloodPressure ?? string.Empty,
                HeartRate = healthCheck.HeartRate ?? string.Empty,
                Location = healthCheck.Location ?? string.Empty,
                Description = healthCheck.Description ?? string.Empty,
                Conclusion = healthCheck.Conclusion ?? string.Empty,
                Status = healthCheck.Status ?? string.Empty,
                Date = healthCheck.Date,
                nurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }

        private HealthCheckDTO MapToDTO(HealthCheck healthCheck)
        {
           return new HealthCheckDTO
            {

                Id = healthCheck.Id,
                Height = healthCheck.Height,
                Weight = healthCheck.Weight,
                Bmi = healthCheck.Bmi,
                Conclusion = healthCheck.Conclusion ?? string.Empty ,
                NurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }
    }
}