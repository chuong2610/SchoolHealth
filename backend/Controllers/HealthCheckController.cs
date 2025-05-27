using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckController : ControllerBase
    {
        private readonly IHealthCheckService _healthCheckService;
        public HealthCheckController(IHealthCheckService healthCheckService)
        {
            _healthCheckService = healthCheckService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllHealthChecks()
        {
            try
            {
                var healthChecks = await _healthCheckService.GetAllHealthChecksAsync();
                return Ok(new BaseResponse<List<HealthCheckDTO>>(healthChecks, "Lấy danh sách thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}