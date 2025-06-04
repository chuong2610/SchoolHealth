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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicationDetail(int id)
        {
            try
            {
                var medicationDetail = await _medicationService.GetMedicationDetailDTOAsync(id);
                return Ok(new BaseResponse<MedicationDetailDTO>(medicationDetail, "Lấy chi tiết gửi thuốc thành công", true));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new BaseResponse<string>(null, "Gửi thuốc không tồn tại", false));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPatch()]
        public async Task<IActionResult> UpdateNurseId([FromBody] MedicationStatusRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Request body is null", false));
                }

                var isSuccess = await _medicationService.UpdateNurseIdAsync(request.MedicationId, request.NurseId);
                if (!isSuccess)
                {
                    return NotFound(new BaseResponse<bool>(false, "Gửi thuốc không tồn tại", false));
                }

                return Ok(new BaseResponse<bool>(true, "Cập nhật thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetMedicationsByParentId(int parentId)
        {
            try
            {
                var medications = await _medicationService.GetMedicationsByParentIdAsync(parentId);
                return Ok(new BaseResponse<List<MedicationDTO>>(medications, "Lấy danh sách gửi thuốc theo phụ huynh thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}