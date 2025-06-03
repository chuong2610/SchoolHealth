using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalSupplyRepository
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync();
    }
}