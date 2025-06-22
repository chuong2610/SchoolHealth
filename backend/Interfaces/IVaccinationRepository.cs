using backend.Models;

namespace backend.Repositories
{
    public interface IVaccinationRepository
    {
        Task<List<Vaccination>> GetAllVaccinationsAsync();
        Task<Vaccination?> GetVaccinationByIdAsync(int id);
        Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize);
        Task<int> CountVaccinationsByParentIdAsync(int parentId);
        Task<List<Vaccination>> GetVaccinationsByNotificationIdAsync(int notificationId, int pageNumber, int pageSize);
        Task<int> CountVaccinationsByNotificationIdAsync(int notificationId);
        Task<bool> CreateVaccinationAsync(Vaccination vaccination);

    }
}