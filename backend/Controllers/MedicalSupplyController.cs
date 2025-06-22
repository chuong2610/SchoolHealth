using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalSupplyController : ControllerBase
    {
        private readonly IMedicalSupplyService _medicalSupplyService;

        public MedicalSupplyController(IMedicalSupplyService medicalSupplyService)
        {
            _medicalSupplyService = medicalSupplyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMedicalSupplies(int pageNumber, int pageSize)
        {
            try
            {
                var supplies = await _medicalSupplyService.GetAllMedicalSuppliesAsync(pageNumber, pageSize);
                return Ok(new BaseResponse<PageResult<MedicalSupplyDTO>>(supplies, "Lấy danh sách vật tư y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponse<object>>> CreateMedicalSupplies([FromBody] MedicalSupplyRequest supplyRequest)
        {
            try
            {
                if (supplyRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Tạo vật tư y tế thất bại", false));
                }

                var isSuccess = await _medicalSupplyService.CreateMedicalSuppliesAsync(supplyRequest);
                return Ok(new BaseResponse<bool>(isSuccess, "Tạo vật tư y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<BaseResponse<object>>> UpdateMedicalSupplies([FromBody] MedicalSupplyRequest supplyRequest, int id)
        {
            try
            {
                if (supplyRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Cập nhật vật tư y tế thất bại", false));
                }

                var isSuccess = await _medicalSupplyService.UpdateMedicalSupplyAsync(supplyRequest, id);
                return Ok(new BaseResponse<bool>(isSuccess, "Cập nhật vật tư y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteMedicalSupply(int id)
        {
            try
            {
                var isDeleted = await _medicalSupplyService.DeleteMeidcalSuppliesAsync(id);
                if (!isDeleted)
                {
                    return NotFound(new BaseResponse<bool>(false, "Không tìm thấy vật tư y tế cần xóa", false));
                }

                return Ok(new BaseResponse<bool>(true, "Xóa vật tư y tế thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}