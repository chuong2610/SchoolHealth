using backend.Models;

namespace backend.Interfaces
{
    public interface IOtherCheckRepository
    {
        Task<List<OtherCheck>> GetAllOtherChecksAsync();
        Task<OtherCheck?> GetOtherCheckByIdAsync(int id);
        Task<PageResult<OtherCheck>> GetOtherChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<bool> CreateOtherCheckAsync(OtherCheck otherCheck);
        Task<bool> SubmitResultAtHomeAsync(int otherCheckId);
        Task<List<OtherCheck>> GetOtherChecksByNotificationIdAsync(int notificationId);
    }
}