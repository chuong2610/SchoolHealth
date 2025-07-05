using backend.Models;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OtherCheckController : ControllerBase
{
    private readonly IOtherCheckService _otherCheckService;

    public OtherCheckController(IOtherCheckService otherCheckService)
    {
        _otherCheckService = otherCheckService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOtherChecks()
    {
        try
        {
            var otherChecks = await _otherCheckService.GetAllOtherChecksAsync();
            return Ok(new BaseResponse<List<OtherCheckDTO>>(otherChecks, "Lấy danh sách thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetOtherCheckById(int id)
    {
        try
        {
            var otherCheck = await _otherCheckService.GetOtherCheckByIdAsync(id);
            if (otherCheck == null)
            {
                return NotFound(new BaseResponse<string>(null, "Kiểm tra khác không tồn tại", false));
            }
            return Ok(new BaseResponse<OtherCheckDetailDTO>(otherCheck, "Lấy thông tin kiểm tra khác thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("parent/{parentId}")]
    [Authorize(Policy = "ParentOnly")]
    public async Task<IActionResult> GetOtherChecksByParentId(int parentId, int pageNumber = 1, int pageSize = 10, string? search = null)
    {
        try
        {
            var otherChecks = await _otherCheckService.GetOtherChecksByParentIdAsync(parentId, pageNumber, pageSize, search);
            return Ok(new BaseResponse<PageResult<OtherCheckDTO>>(otherChecks, "Lấy danh sách kiểm tra khác theo phụ huynh thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpPost]
    public async Task<IActionResult> CreateOtherCheck([FromBody] OtherCheck otherCheck)
    {
        try
        {
            if (otherCheck == null)
            {
                return BadRequest(new BaseResponse<bool>(false, "Request body is null", false));
            }

            var isSuccess = await _otherCheckService.CreateOtherCheckAsync(otherCheck);
            return Ok(new BaseResponse<bool>(isSuccess, "Tạo kiểm tra khác thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpPatch("submit-result/{otherCheckId}")]
    public async Task<IActionResult> SubmitOtherCheckResult(int otherCheckId)
    {
        try
        {
            var result = await _otherCheckService.SubmitResultAtHomeAsync(otherCheckId);
            if (!result)
            {
                return NotFound(new BaseResponse<string>(null, "Kiểm tra khác không tồn tại", false));
            }
            return Ok(new BaseResponse<bool>(true, "Gửi kết quả kiểm tra khác tại nhà thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("notification/{notificationId}")]
    public async Task<IActionResult> GetOtherChecksByNotificationId(int notificationId)
    {
        try
        {
            var otherChecks = await _otherCheckService.GetOtherChecksByNotificationIdAsync(notificationId);
            return Ok(new BaseResponse<List<OtherCheckDTO>>(otherChecks, "Lấy danh sách kiểm tra khác theo thông báo thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    

}