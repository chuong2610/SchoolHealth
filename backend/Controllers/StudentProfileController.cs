using backend.Interfaces;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
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
        [Authorize]
        public async Task<ActionResult<BaseResponse<bool>>> CreateStudentProfile([FromBody] StudentProfileRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Lưu hồ sơ y tế thất bại: request không hợp lệ.", false));
                }
                var isSuccess = await _studentProfileService.CreateStudentProfileAsync(request);

                return Ok(new BaseResponse<bool>(isSuccess, "Lưu hồ sơ y tế thành công.", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpGet("{studentId}")]
        public async Task<ActionResult<BaseResponse<StudentProfileDTO>>> GetStudentProfileById(int studentId)
        {
            try
            {
                var profile = await _studentProfileService.GetStudentProfileByIdAsync(studentId);
                if (profile == null)
                {
                    return NotFound(new BaseResponse<StudentProfileDTO>(null, "Không tìm thấy hồ sơ y tế.", false));
                }

                return Ok(new BaseResponse<StudentProfileDTO>(profile, "Lấy hồ sơ y tế thành công.", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<StudentProfileDTO>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
