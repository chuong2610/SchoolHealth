using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHomeService
    {
        Task<HomeNurseDTO> GetHomeNurseAsync(int nurseId);
        Task<HomeAdminDTO> GetHomeAdminAsync();
    }
}