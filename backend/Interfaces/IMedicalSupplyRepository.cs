using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicalSupplyRepository
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync(int? pageNumber, int? pageSize, string? search);
        Task<int> CountAllMedicalSuppliesAsync(string? search);
        Task<bool> AddMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<MedicalSupply> GetMeidcalSuppliesByIdAsync(int id);
        Task<bool> UpdateMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<bool> DeleteMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<MedicalSuppliesCountDTO> GetMedicalSuppliesCountsAsync();
    }
}