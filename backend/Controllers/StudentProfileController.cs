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
                return Ok(new BaseResponse<StudentProfileDTO>
                {
                    Success = true,
                    Message = "Khai báo y tế thành công!",
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
    }
}
