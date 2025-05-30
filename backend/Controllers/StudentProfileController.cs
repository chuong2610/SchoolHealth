using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentProfileController : ControllerBase
    {
        private readonly IStudentProfileService _studentProfileService;

        public StudentProfileController(IStudentProfileService studentProfileService)
        {
            _studentProfileService = studentProfileService;
        }

        [HttpPost("declare")]

        public async Task<ActionResult<StudentProfileRequest>> DeclareStudentProfile([FromBody] StudentProfileRequest request)
        {
            try
            {
                var createdStudentProfile = await _studentProfileService.CreateStudentProfileAsync(request);
                return CreatedAtAction(nameof(GetStudentProfileById), new { id = createdStudentProfile.Id }, new BaseResponse<object>
                {
                    Success = true,
                    Message = "Tạo phiếu khai báo y tế thành công!",
                    Data = createdStudentProfile
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentProfileById(int id)
        {
            try
            {
                var studentProfile = await _studentProfileService.GetStudentProfileByIdAsync(id);
                if (studentProfile == null) return NotFound(new { message = "Student profile not found" });
                return Ok(studentProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "An error occurred while retrieving the student profile.", details = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentProfilesByStudentId(int studentId)
        {
            try
            {
                var studentProfiles = await _studentProfileService.GetStudentProfilesByStudentIdAsync(studentId);
                return Ok(studentProfiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "An error occurred while retrieving student profiles.", details = ex.Message });
            }

        }
    }
}