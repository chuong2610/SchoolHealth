using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
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
        [HttpGet("{classId}")]
        public async Task<IActionResult> GetStudentByClassId(int classId, int pageNumber, int pageSize, string? search)
        {
            var students = await _studentService.GetStudentByClassIdAsync(classId, pageNumber, pageSize, search);

            if (students == null || students.Items.Count == 0)
            {
                var response = new BaseResponse<PageResult<StudentsDTO>>(
                    data: null,
                    message: $"Không tìm thấy học sinh.",
                    success: false
                );
                return NotFound(response); 
            }

            var successResponse = new BaseResponse<PageResult<StudentsDTO>>(
                data: students,
                message: "Đã lấy thành công học sinh.",
                success: true
            );

            return Ok(successResponse);
        }
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] StudentCreateRequest request)
        {
            var isCreated = await _studentService.CreateStudentAsync(request);

            if (!isCreated)
            {
                var errorResponse = new BaseResponse<bool>(
                    data: false,
                    message: "Mã số học sinh đã tồn tại hoặc không thể tạo mới học sinh.",
                    success: false
                );

                return BadRequest(errorResponse); // 400
            }

            var successResponse = new BaseResponse<bool>(
                data: true,
                message: "Tạo học sinh thành công.",
                success: true
            );

            return Ok(successResponse); // 200
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentRequest request)
        {
            var isUpdated = await _studentService.UpdateStudentAsync(id, request);

            if (!isUpdated)
            {
                var errorResponse = new BaseResponse<bool>(
                    data: false,
                    message: "Cập nhật học sinh thất bại.",
                    success: false
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new BaseResponse<bool>(
                data: true,
                message: "Cập nhật học sinh thành công.",
                success: true
            );

            return Ok(successResponse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var isDeleted = await _studentService.DeleteStudentAsync(id);

            if (!isDeleted)
            {
                var errorResponse = new BaseResponse<bool>(
                    data: false,
                    message: "Xóa học sinh thất bại.",
                    success: false
                );
                return BadRequest(errorResponse);
            }

            var successResponse = new BaseResponse<bool>(
                data: true,
                message: "Xóa học sinh thành công.",
                success: true
            );

            return Ok(successResponse);
        }
    }
}
