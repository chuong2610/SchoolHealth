using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models.DTO;
using System.Threading.Tasks;
using backend.Models.Request;
using System.Collections.Generic;

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

        // POST: api/Medication
        [HttpPost]
        public async Task<ActionResult<BaseResponse<MedicationDTO>>> CreateMedication([FromBody] BulkMedicationRequest medicationRequest)
        {
            try
            {
                var createdMedication = await _medicationService.CreateMedicationAsync(medicationRequest);

                return Ok(new BaseResponse<MedicationDTO>
                {
                    Success = true,
                    Message = "Gửi thuốc thành công!",
                    Data = createdMedication
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new BaseResponse<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new BaseResponse<object>
                {
                    Success = false,
                    Message = ex.InnerException?.Message ?? ex.Message ?? "Gửi thuốc thất bại.",
                    Data = null
                });
            }

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

    }
}