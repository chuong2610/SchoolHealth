using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalSupplyRepository
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync();
        Task<bool> AddMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<MedicalSupply> GetMeidcalSuppliesByIdAsync(int id);
        Task<bool> UpdateMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<bool> DeleteMedicalSuppliesAsync(MedicalSupply medicalSupply);
    }
}