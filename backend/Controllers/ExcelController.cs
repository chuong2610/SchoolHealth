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
        [HttpGet("export-form-students-and-parents")]
        public async Task<IActionResult> ExportStudentsAndParentsToExcel()
        {
            try
            {
                var fileContent = await _excelService.ExportStudentsAndParentFromExcelAsync();
                if (fileContent == null || fileContent.Length == 0)
                {
                    return NotFound(new BaseResponse<string>
                    {
                        Data = null,
                        Message = "No data found for export.",
                        Success = false
                    });
                }

                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "StudentsAndParents.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Data = null,
                    Message = $"Error exporting students and parents: {ex.Message}",
                    Success = false
                });
            }
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
        [HttpGet("export-form-result/{id}")]
        public async Task<IActionResult> ExportFormResult(int id, int pageNumber, int pageSize)
        {
            try
            {
                var fileContent = await _excelService.ExportFormResultAsync(id, pageNumber, pageSize);
                if (fileContent == null || fileContent.Length == 0)
                {
                    return NotFound(new BaseResponse<string>
                    {
                        Data = null,
                        Message = "No data found for the specified ID.",
                        Success = false
                    });
                }

                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"FormResult_{id}.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Data = null,
                    Message = $"Error exporting form result: {ex.Message}",
                    Success = false
                });
            }

        }
        [HttpPost("import-result/{notificationId}")]
        public async Task<IActionResult> ImportResult(IFormFile file, int notificationId, int pageNumber, int pageSize)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Data = null,
                    Message = "No file uploaded.",
                    Success = false
                });
            }

            try
            {
                var result = await _excelService.ImportFormResultAsync(file, notificationId, pageNumber, pageSize);
                return Ok(new BaseResponse<ImportResult>
                {
                    Data = result,
                    Message = "Import completed successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Data = null,
                    Message = $"Error importing form result: {ex.Message}",
                    Success = false
                });
            }
        }
    }
}