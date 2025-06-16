using Microsoft.AspNetCore.Mvc;
using backend.Interfaces;
using backend.Models.DTO;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponse<IEnumerable<ClassDTO>>>> GetAllClasses()
        {
            try
            {
                var classList = await _classService.GetAllClassAsync();
                return Ok(new BaseResponse<IEnumerable<ClassDTO>>(classList, "Lấy danh sách lớp thành công", true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new BaseResponse<IEnumerable<ClassDTO>>(null, $"Lỗi server: {ex.Message}", false));
            }
        }
    }
}
