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
        public async Task<ActionResult<MedicationDTO>> CreateMedication(MedicationRequest medicationRequest)
        {
            try
            {
                var createdMedication = await _medicationService.CreateMedicationAsync(medicationRequest);
                return CreatedAtAction(nameof(GetMedication), new { id = createdMedication.Id }, new BaseResponse<object>
                {
                    Success = true,
                    Message = "Tạo thuốc thành công!",
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

        // GET: api/Medication/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationDTO>> GetMedication(int id)
        {
            try
            {
                var medication = await _medicationService.GetMedicationByIdAsync(id);
                if (medication == null)
                {
                    return NotFound();
                }
                return Ok(medication);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Medication
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicationDTO>>> GetAllMedications()
        {
            try
            {
                var medications = await _medicationService.GetAllMedicationsAsync();
                return Ok(medications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}