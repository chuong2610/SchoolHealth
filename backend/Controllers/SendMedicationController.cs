using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;

        public MedicationController(IMedicationService medicationService)
        {
            _medicationService = medicationService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMedication([FromBody] SendMedicationDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            var result = await _medicationService.SendMedicationAsync(dto);

            if (result == "Student not found." || result == "Sender (Nurse) not found.")
                return NotFound(result);

            return Ok(result);
        }
    }
}
