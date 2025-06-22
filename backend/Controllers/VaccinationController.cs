using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationController : ControllerBase
    {
        private readonly IVaccinationService _vaccinationService;

        public VaccinationController(IVaccinationService vaccinationService)
        {
            _vaccinationService = vaccinationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVaccinations()
        {
            try
            {
                var vaccinations = await _vaccinationService.GetAllVaccinationsAsync();
                return Ok(new BaseResponse<List<VaccinationDTO>>(vaccinations, "Lấy danh sách tiêm chủng thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVaccinationById(int id)
        {
            try
            {
                var vaccination = await _vaccinationService.GetVaccinationByIdAsync(id);
                if (vaccination == null)
                {
                    return NotFound(new BaseResponse<string>(null, "Tiêm chủng không tồn tại", false));
                }
                return Ok(new BaseResponse<VaccinationDetailDTO>(vaccination, "Lấy thông tin tiêm chủng thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpGet("parent/{parentId}")]
        [Authorize(Policy = "ParentOnly")]
        public async Task<IActionResult> GetVaccinationsByParentId(int parentId, int pageNumber, int pageSize)
        {
            try
            {
                var vaccinations = await _vaccinationService.GetVaccinationsByParentIdAsync(parentId, pageNumber, pageSize);
                return Ok(new BaseResponse<PageResult<VaccinationDTO>>(vaccinations, "Lấy danh sách tiêm chủng theo phụ huynh thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}