using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;

        public MedicationController(IMedicationService medicationService)
        {
            _medicationService = medicationService;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingMedications()
        {
            try
            {
                var medications = await _medicationService.GetMedicationsPendingAsync();
                return Ok(new BaseResponse<List<MedicationDTO>>(medications, "Lấy danh sách gửi thuốc thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("nurse/{id}")]
        public async Task<IActionResult> GetMedicationsByNurseId(int id)
        {
            try
            {
                var medications = await _medicationService.GetMedicationsByNurseIdAsync(id);
                return Ok(new BaseResponse<List<MedicationDTO>>(medications, "Lấy danh sách gửi thuốc thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}