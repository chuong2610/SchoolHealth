using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalSupplyController : ControllerBase
    {
        private readonly IMedicalSupplyService _medicalSupplyService;

        public MedicalSupplyController(IMedicalSupplyService medicalSupplyService)
        {
            _medicalSupplyService = medicalSupplyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMedicalSupplies()
        {
            try
            {
                var supplies = await _medicalSupplyService.GetAllMedicalSuppliesAsync();
                return Ok(new BaseResponse<List<MedicalSupplyDTO>>(supplies, "Lấy danh sách vật tư y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}