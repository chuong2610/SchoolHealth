using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet("by-parent/{parentId}")]
        public async Task<IActionResult> GetStudentIdsByParentId(int parentId)
        {
            var students = await _studentService.GetStudentIdsByParentIdAsync(parentId); // List<StudentDTO>

            if (students == null || students.Count == 0)
            {
                var response = new BaseResponse<List<StudentDTO>>(
                    data: null,
                    message: $"Không tìm thấy học sinh với parentId = {parentId}.",
                    success: false
                );
                return NotFound(response);
            }

            var successResponse = new BaseResponse<List<StudentDTO>>(
                data: students,
                message: "Đã lấy thành công học sinh.",
                success: true
            );

            return Ok(successResponse);
        }

    }
}
