using backend.Models;

namespace backend.Repositories
{
    public interface IVaccinationRepository
    {
        Task<List<Vaccination>> GetAllVaccinationsAsync();
        Task<Vaccination?> GetVaccinationByIdAsync(int id);
        Task<List<Vaccination>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
        Task<int> CountVaccinationsByParentIdAsync(int parentId, string? search, DateTime? searchDate);
        Task<List<Vaccination>> GetVaccinationByNotificationIdAsync(int notificationId);
        Task<bool> CreateVaccinationAsync(Vaccination vaccination);

    }
}