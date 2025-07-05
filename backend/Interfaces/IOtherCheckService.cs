using Azure;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services;
public interface IOtherCheckService
{
    Task<List<OtherCheckDTO>> GetAllOtherChecksAsync();
    Task<OtherCheckDetailDTO?> GetOtherCheckByIdAsync(int id);
    Task<PageResult<OtherCheckDTO>> GetOtherChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
    Task<bool> CreateOtherCheckAsync(OtherCheck otherCheck);
    Task<bool> SubmitResultAtHomeAsync(int otherCheckId);
    Task<List<OtherCheckDTO>> GetOtherChecksByNotificationIdAsync(int notificationId);
}