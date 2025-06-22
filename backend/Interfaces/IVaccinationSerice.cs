using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IVaccinationService
    {
        Task<List<VaccinationDTO>> GetAllVaccinationsAsync();
        Task<VaccinationDetailDTO?> GetVaccinationByIdAsync(int id);
        Task<PageResult<VaccinationDTO>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize);
        Task<PageResult<VaccinationDTO>> GetVaccinationByNotificationIdAsync(int notificationId, int pageNumber, int pageSize);
        Task<bool> CreateVaccinationAsync(Vaccination vaccination);
    }
}