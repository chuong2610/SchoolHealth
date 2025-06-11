using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IMedicalSupplyService
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<List<MedicalSupplyDTO>> GetAllMedicalSuppliesAsync();
        Task<bool> CreateMedicalSuppliesAsync(MedicalSupplyRequest request);
        Task<bool> UpdateMedicalSupplyAsync(MedicalSupplyRequest supplyRequest, int id);
        Task<bool> DeleteMeidcalSuppliesAsync(int id);
    }
}