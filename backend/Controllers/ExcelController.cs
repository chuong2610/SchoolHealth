using backend.Interfaces;
using backend.Models.DTO;
using DocumentFormat.OpenXml.Math;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelController : ControllerBase
    {
        private readonly IExcelService _excelService;

        public ExcelController(IExcelService excelService)
        {
            _excelService = excelService;
        }

        [HttpPost("import-students-and-parents")]
        public async Task<IActionResult> ImportStudentsAndParentsFromExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                var result = await _excelService.ImportStudentsAndParentsFromExcelAsync(file);
                 return Ok(new BaseResponse<ImportPSResult>
                {
                    Data = result,
                    Message = "Import completed successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}