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
                // Validate request
                if (request == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Lưu hồ sơ y tế thất bại: request không hợp lệ.", false));
                }

                // Lấy ParentId từ token
                var parentIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (parentIdValue == null)
                {
                    return Unauthorized(new BaseResponse<bool>(false, "Không lấy được ParentId từ token.", false));
                }

                int parentId = int.Parse(parentIdValue);

                // Gọi service để xử lý
                var isSuccess = await _studentProfileService.CreateStudentProfileAsync(request, parentId);

                return Ok(new BaseResponse<bool>(isSuccess, "Lưu hồ sơ y tế thành công.", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
