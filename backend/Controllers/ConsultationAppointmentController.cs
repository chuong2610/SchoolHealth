using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConsultationAppointmentController : ControllerBase
{
    private readonly IConsultationAppointmentService _consultationAppointmentService;

    public ConsultationAppointmentController(IConsultationAppointmentService consultationAppointmentService)
    {
        _consultationAppointmentService = consultationAppointmentService;
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetConsultationAppointmentById(int id)
    {
        try
        {
            var result = await _consultationAppointmentService.GetConsultationAppointmentByIdAsync(id);
            if (result == null)
            {
                return NotFound(new BaseResponse<string>(null, "Cuộc hẹn tư vấn không tồn tại", false));
            }
            return Ok(new BaseResponse<ConsultationAppointmentDetailDTO>(result, "Lấy cuộc hẹn tư vấn thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("parent/{parentId}")]
    public async Task<IActionResult> GetConsultationAppointmentsByParentId(int parentId, int pageNumber, int pageSize, string? search)
    {
        try
        {
            var result = await _consultationAppointmentService.GetConsultationAppointmentsByParentIdAsync(parentId, pageNumber, pageSize, search);
            return Ok(new BaseResponse<PageResult<ConsultationAppointmentDTO>>(result, "Lấy danh sách cuộc hẹn tư vấn thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("nurse/{nurseId}")]
    public async Task<IActionResult> GetConsultationAppointmentsByNurseId(int nurseId, int pageNumber, int pageSize, string? search)
    {
        try
        {
            var result = await _consultationAppointmentService.GetConsultationAppointmentsByNurseIdAsync(nurseId, pageNumber, pageSize, search);
            return Ok(new BaseResponse<PageResult<ConsultationAppointmentDTO>>(result, "Lấy danh sách cuộc hẹn tư vấn theo y tá thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("parent/{parentId}/pending")]
    public async Task<IActionResult> GetConsultationAppointmentsByParentIdAndPending(int parentId, int pageNumber, int pageSize, string? search)
    {
        try
        {
            var result = await _consultationAppointmentService.GetConsultationAppointmentsByParentIdAndPendingAsync(parentId, pageNumber, pageSize, search);
            return Ok(new BaseResponse<PageResult<ConsultationAppointmentDTO>>(result, "Lấy danh sách cuộc hẹn tư vấn đang chờ theo phụ huynh thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpPost]
    public async Task<IActionResult> CreateConsultationAppointment([FromBody] ConsultationAppointmentRequest request)
    {
        if (request == null)
        {
            return BadRequest(new BaseResponse<string>(null, "Yêu cầu không hợp lệ", false));
        }

        try
        {
            var result = await _consultationAppointmentService.CreateConsultationAppointmentAsync(request);
            if (result)
            {
                return Ok(new BaseResponse<string>(null, "Tạo cuộc hẹn tư vấn thành công", true));
            }
            return BadRequest(new BaseResponse<string>(null, "Tạo cuộc hẹn tư vấn thất bại", false));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpPatch]
    public async Task<IActionResult> UpdateConsultationAppointment([FromBody] ConsultationAppointmentDetailRequest request)
    {
        if (request == null)
        {
            return BadRequest(new BaseResponse<string>(null, "Yêu cầu không hợp lệ", false));
        }

        try
        {
            var result = await _consultationAppointmentService.UpdateConsultationAppointmentAsync(request);
            if (result)
            {
                return Ok(new BaseResponse<string>(null, "Cập nhật cuộc hẹn tư vấn thành công", true));
            }
            return BadRequest(new BaseResponse<string>(null, "Cập nhật cuộc hẹn tư vấn thất bại", false));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }
    [HttpGet("today/{userId}")]
    public async Task<IActionResult> GetConsultationAppointmentsTodayByUserId(int userId, int pageNumber, int pageSize, string? search)
    {
        try
        {
            var result = await _consultationAppointmentService.GetConsultationAppointmentsTodayByUserIdAsync(userId, pageNumber, pageSize, search);
            return Ok(new BaseResponse<PageResult<ConsultationAppointmentDTO>>(result, "Lấy danh sách cuộc hẹn tư vấn hôm nay theo người dùng thành công", true));
        }
        catch (Exception ex)
        {
            return BadRequest(new BaseResponse<string>(null, $"Lỗi: {ex.Message}", false));
        }
    }

}
