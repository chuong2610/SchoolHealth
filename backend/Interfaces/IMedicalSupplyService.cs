namespace backend.Interfaces
{
    public interface IMedicalSupplyService
    {
        Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity);
    }
}