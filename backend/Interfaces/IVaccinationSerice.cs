using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IVaccinationService
    {
        Task<List<VaccinationDTO>> GetAllVaccinationsAsync();
        Task<VaccinationDetailDTO?> GetVaccinationByIdAsync(int id);
        Task<List<VaccinationDTO>> GetVaccinationsByParentIdAsync(int parentId);
        Task<List<VaccinationDTO>> GetVaccinationByNotificationIdAsync(int notificationId);
        
    }
}