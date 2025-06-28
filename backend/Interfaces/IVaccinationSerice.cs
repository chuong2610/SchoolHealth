using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IVaccinationService
    {
        Task<List<VaccinationDTO>> GetAllVaccinationsAsync();
        Task<VaccinationDetailDTO?> GetVaccinationByIdAsync(int id);
        Task<PageResult<VaccinationDTO>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
        Task<List<VaccinationDTO>> GetVaccinationByNotificationIdAsync(int notificationId);
        Task<bool> CreateVaccinationAsync(Vaccination vaccination);
    }
}