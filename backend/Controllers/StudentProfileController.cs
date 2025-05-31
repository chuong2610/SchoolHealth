using backend.Interfaces;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

        // POST: api/StudentProfile/declare
        [HttpPost("declare")]
        public async Task<ActionResult<BaseResponse<StudentProfileDTO>>> DeclareStudentProfile([FromBody] StudentProfileRequest request)
        {
            try
            {
                var createdProfile = await _studentProfileService.CreateStudentProfileAsync(request);
                return CreatedAtAction(nameof(GetStudentProfileById), new { id = createdProfile.Id }, new BaseResponse<StudentProfileDTO>
                {
                    Success = true,
                    Message = "Tạo hồ sơ y tế thành công!",
                    Data = createdProfile
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

        // GET: api/StudentProfile/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<StudentProfileDTO>>> GetStudentProfileById(int id)
        {
            try
            {
                var profile = await _studentProfileService.GetStudentProfileByIdAsync(id);
                if (profile == null)
                {
                    return NotFound(new BaseResponse<StudentProfileDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy hồ sơ.",
                        Data = null
                    });
                }

                return Ok(new BaseResponse<StudentProfileDTO>
                {
                    Success = true,
                    Message = "Lấy hồ sơ thành công.",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
        }

        // GET: api/StudentProfile/student/{studentId}
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<BaseResponse<IEnumerable<StudentProfileDTO>>>> GetStudentProfilesByStudentId(int studentId)
        {
            try
            {
                var profiles = await _studentProfileService.GetStudentProfilesByStudentIdAsync(studentId);
                return Ok(new BaseResponse<IEnumerable<StudentProfileDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách hồ sơ thành công.",
                    Data = profiles
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
        }
    }
}
