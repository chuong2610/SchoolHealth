using System.Globalization;
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
                Id = healthCheck.Id,
                StudentName = healthCheck.Student.Name ?? string.Empty,
                StudentNumber = healthCheck.Student.StudentNumber ?? string.Empty,
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
                ResultAtHome = healthCheck.ResultAtHome ?? string.Empty,
                NurseId = healthCheck.Nurse.Id,
                Date = healthCheck.Date,
                NurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }
        public async Task<PageResult<HealthCheckDTO>> GetHealthChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            // Tách DateTime nếu chuỗi là ngày hợp lệ
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;

            var totalCount = await _healthCheckRepository.CountHealthChecksByParentIdAsync(parentId, search, searchDate);

            var healthChecks = await _healthCheckRepository
                .GetHealthChecksByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);

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

        public async Task<List<HealthCheckDTO>> GetHealthChecksByNotificationIdAsync(int notificationId)
        {
            var healthChecks = await _healthCheckRepository.GetHealthChecksByNotificationIdAsync(notificationId);
            return healthChecks.Select(p => MapToDTO(p)).ToList();
        }
        public async Task<bool> CreateHealthCheckAsync(HealthCheck healthCheck)
        {
            return await _healthCheckRepository.CreateHealthCheckAsync(healthCheck);
        }
        public async Task<bool> SubmitResultAtHomeAsync(int healthCheckId)
        {
            return await _healthCheckRepository.SubmitResultAtHomeAsync(healthCheckId);
        }
        private HealthCheckDTO MapToDTO(HealthCheck healthCheck)
        {
            return new HealthCheckDTO
            {
                StudentName = healthCheck.Student.Name ?? string.Empty,
                StudentNumber = healthCheck.Student.StudentNumber ?? string.Empty,
                Id = healthCheck.Id,
                Height = healthCheck.Height,
                Weight = healthCheck.Weight,
                Bmi = healthCheck.Bmi,
                Date = DateOnly.FromDateTime(healthCheck.Date),
                Conclusion = healthCheck.Conclusion ?? string.Empty,
                NurseName = healthCheck.Nurse.Name ?? string.Empty
            };
        }

        public Task<PageResult<HealthCheckDTO>> GetHealthChecksByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search)
        {
            // Tách DateTime nếu chuỗi là ngày hợp lệ
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;

            return _healthCheckRepository.GetHealthChecksByNurseIdAsync(nurseId, pageNumber, pageSize, search, searchDate)
                .ContinueWith(task =>
                {
                    var healthChecks = task.Result;
                    var dtos = healthChecks.Select(h => MapToDTO(h)).ToList();
                    var totalCount = healthChecks.Count;

                    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
                    return new PageResult<HealthCheckDTO>
                    {
                        Items = dtos,
                        TotalItems = totalCount,
                        TotalPages = totalPages,
                        CurrentPage = pageNumber
                    };
                });
        }
    }
}