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
        public async Task<ActionResult<List<BaseResponse<MedicationDTO>>>> CreateMedication([FromBody] List<MedicationRequest> medicationRequest)
        {
            try
            {
                var createdMedication = await _medicationService.CreateMedicationAsync(medicationRequest);

                return Ok(new BaseResponse<List<MedicationDTO>>
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

    }
}