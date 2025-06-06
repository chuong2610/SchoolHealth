namespace backend.Interfaces
{
    public interface IMedicalEventSupplyRepository
    {
        Task<bool> CreateMedicalEventSupplyAsync(int medicalEventId, int medicalSupplyId, int quantity);
    }
}