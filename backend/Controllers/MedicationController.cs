using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models.DTO;
using System.Threading.Tasks;
using backend.Models.Request;
using System.Collections.Generic;
using backend.Interfaces;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;
        private readonly IStudentService _studentService;

        public MedicationController(IMedicationService medicationService, IStudentService studentService)
        {
            _medicationService = medicationService;
            _studentService = studentService;
        }

        // POST: api/Medication
        [HttpPost]
        public async Task<ActionResult<BaseResponse<object>>> CreateMedication([FromBody] MedicationRequest medicationRequest)
        {
            try
            {
                if (medicationRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "gửi thuốc thất bại", false));
                }

                var isSuccess = await _medicationService.CreateMedicationAsync(medicationRequest);
                return Ok(new BaseResponse<bool>(isSuccess, "gửi thuốc thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
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