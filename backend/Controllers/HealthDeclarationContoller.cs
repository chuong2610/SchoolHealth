using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthDeclarationController : ControllerBase
    {
        private readonly IHealthDeclarationService _healthDeclarationService;

        public HealthDeclarationController(IHealthDeclarationService healthDeclarationService)
        {
            _healthDeclarationService = healthDeclarationService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitHealthDeclaration([FromBody] HealthDeclarationDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid health declaration data.");

            var result = await _healthDeclarationService.SubmitHealthDeclarationAsync(dto);

            if (result == "Student not found.")
                return NotFound(result);

            return Ok(result);
        }
    }
}
