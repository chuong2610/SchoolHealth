using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IHealthDeclarationService
    {
        Task<string> SubmitHealthDeclarationAsync(HealthDeclarationDTO dto);
    }
}

