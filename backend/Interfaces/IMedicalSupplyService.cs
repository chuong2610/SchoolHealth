using backend.Models.DTO;
using backend.Models.Request;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicalSupplyService
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
        Task<PageResult<MedicalSupplyDTO>> GetAllMedicalSuppliesAsync(int? pageNumber, int? pageSize, string? search);
        Task<bool> CreateMedicalSuppliesAsync(MedicalSupplyRequest request);
        Task<bool> UpdateMedicalSupplyAsync(MedicalSupplyRequest supplyRequest, int id);
        Task<bool> DeleteMeidcalSuppliesAsync(int id);
        Task<MedicalSuppliesCountDTO> GetInventoryCountsAsync();
    }
}