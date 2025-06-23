using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IVaccinationService
    {
        Task<List<VaccinationDTO>> GetAllVaccinationsAsync();
        Task<VaccinationDetailDTO?> GetVaccinationByIdAsync(int id);
        Task<PageResult<VaccinationDTO>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<PageResult<VaccinationDTO>> GetVaccinationByNotificationIdAsync(int notificationId, int pageNumber, int pageSize, string? search);
        Task<bool> CreateVaccinationAsync(Vaccination vaccination);
    }
}