using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHomeService
    {
        Task<HomeNurseDTO> GetHomeNurseAsync(int nurseId, int pageNumber, int pageSize, string? search);
        Task<HomeAdminDTO> GetHomeAdminAsync(int pageNumber, int pageSize, string? search);
    }
}