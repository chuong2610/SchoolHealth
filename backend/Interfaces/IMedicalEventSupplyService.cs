namespace backend.Interfaces
{
    public interface IMedicalEventSupplyService
    {
        Task<bool> CreateMedicalEventSupplyAsync(int medicalEventId, int medicalSupplyId, int quantity);
    }
}