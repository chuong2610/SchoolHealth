using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IMedicalSupplyService
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupplyDTO>> GetAllMedicalSuppliesAsync();
    }
}