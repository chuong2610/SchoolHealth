using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IExcelService
    {
        Task<ImportPSResult> ImportStudentsAndParentsFromExcelAsync(IFormFile file);
    }
}