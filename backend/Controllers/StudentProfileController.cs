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
        public async Task<ActionResult<BaseResponse<object>>> CreateStudentProfile([FromBody] StudentProfileRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Lưu hồ sơ y tế thất bại", false));
                }

                var isSuccess = await _studentProfileService.CreateStudentProfileAsync(request);
                return Ok(new BaseResponse<bool>(isSuccess, "Lưu hồ sơ y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
