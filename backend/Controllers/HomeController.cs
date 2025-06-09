using backend.Interfaces;
using backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        private readonly IHomeService _homeService;
        public HomeController(IHomeService homeService)
        {
            _homeService = homeService;
        }
        [HttpGet("nurse/{id}")]
        public async Task<IActionResult> GetHomeNurse(int id)
        {
            var result = await _homeService.GetHomeNurseAsync(id);
            if (result == null)
            {
                return NotFound(new BaseResponse<HomeNurseDTO>(null, "Nurse not found", false));
            }
            return Ok(new BaseResponse<HomeNurseDTO>(result, "Lấy thông tin điều dưỡng thành công", true));
        }
    }
}