using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IExcelService
    {
        Task<ImportPSResult> ImportStudentsAndParentsFromExcelAsync(IFormFile file);
        Task<byte[]> ExportFormResultAsync(int id, int pageNumber, int pageSize);
        Task<ImportResult> ImportFormResultAsync(IFormFile file, int notificationId, int pageNumber, int pageSize);
    }
}