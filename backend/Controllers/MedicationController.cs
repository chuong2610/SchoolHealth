using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models.DTO;
using System.Threading.Tasks;
using backend.Models.Request;

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
        public async Task<ActionResult<BaseResponse<MedicationDTO>>> CreateMedication([FromBody] MedicationRequest medicationRequest)
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
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                return BadRequest(new BaseResponse<object>
                {
                    Success = false,
                    Message = innerMessage,
                    Data = null
                });
            }
        }

    }

}