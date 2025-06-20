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
                StudentName = healthCheck.Student.Name ?? string.Empty,
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
                // Status = healthCheck.Status ?? string.Empty,
                Date = healthCheck.Date,
                nurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }
        public async Task<PageResult<HealthCheckDTO>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize)
        {
            var totalCount = await _healthCheckRepository.CountHealthChecksByParentIdAsync(parentId);

            var healthChecks = await _healthCheckRepository
                .GetHealthChecksByParentIdAsync(parentId, pageNumber, pageSize);

            var dtos = healthChecks
                .Select(h => MapToDTO(h))
                .ToList();

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            return new PageResult<HealthCheckDTO>
            {
                Items = dtos,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }

        public async Task<PageResult<HealthCheck>> GetHealthChecksByNotificationIdAsync(
    int notificationId, int pageNumber, int pageSize)
        {
            var totalItems = await _healthCheckRepository
                .CountHealthChecksByNotificationIdAsync(notificationId);

            var healthChecks = await _healthCheckRepository
                .GetHealthChecksByNotificationIdAsync(notificationId, pageNumber, pageSize);

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return new PageResult<HealthCheck>
            {
                Items = healthChecks,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }
        public async Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck)
        {
            return await _healthCheckRepository.CreateHealthCheckAsync(healthCheck);
        }
        private HealthCheckDTO MapToDTO(HealthCheck healthCheck)
        {
            return new HealthCheckDTO
            {
                StudentName = healthCheck.Student.Name ?? string.Empty,
                Id = healthCheck.Id,
                Height = healthCheck.Height,
                Weight = healthCheck.Weight,
                Bmi = healthCheck.Bmi,
                Date = DateOnly.FromDateTime(healthCheck.Date),
                Conclusion = healthCheck.Conclusion ?? string.Empty,
                NurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }


    }
}