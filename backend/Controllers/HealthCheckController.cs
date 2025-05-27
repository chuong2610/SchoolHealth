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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthCheckById(int id)
        {
            try
            {
                var healthCheck = await _healthCheckService.GetHealthCheckByIdAsync(id);
                if (healthCheck == null)
                {
                    return NotFound(new BaseResponse<string>(null, "Không tìm thấy kết quả kiểm tra sức khỏe", false));
                }
                return Ok(new BaseResponse<HealthCheckDetailDTO>(healthCheck, "Lấy chi tiết thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}