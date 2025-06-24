using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthDeclareHistoryController : ControllerBase
    {
        private readonly IHealthDeclareHistoryService _service;

        public HealthDeclareHistoryController(IHealthDeclareHistoryService service)
        {
            _service = service;
        }

        [HttpGet("{parentId}")]
        public async Task<IActionResult> GetAllHealthDeclareHistorys(int parentId, int pageNumber, int pageSize, string? search)
        {

            try
            {
                var healthChecks = await _service.GetHealthDeclareHistoriesAsync(parentId, pageNumber, pageSize, search);
                return Ok(new BaseResponse<PageResult<HealthDeclareHistoryDTO>>(healthChecks, "Lấy danh sách thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("{parentId}/counts")]
        public async Task<IActionResult> GetHealthHistoryCounts(int parentId)
        {
            try
            {
                var result = await _service.GetHealthHistoryCountsByParentIdAsync(parentId);
                return Ok(new BaseResponse<HealthHistoryCountDTO>(result, "Lấy danh sách thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
