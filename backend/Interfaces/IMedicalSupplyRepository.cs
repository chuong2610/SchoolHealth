using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalSupplyRepository
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync();
        Task<MedicalSupply> AddMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task<MedicalSupply> GetMeidcalSuppliesByIdAsync(int id);
        Task<MedicalSupply> UpdateMedicalSuppliesAsync(MedicalSupply medicalSupply);
        Task DeleteMedicalSuppliesAsync(MedicalSupply medicalSupply);
    }
}