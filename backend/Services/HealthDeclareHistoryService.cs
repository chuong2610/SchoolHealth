using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class HealthDeclareHistoryService : IHealthDeclareHistoryService
    {
        private readonly IHealthDeclareHistoryRepository _repository;

        public HealthDeclareHistoryService(IHealthDeclareHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<PageResult<HealthDeclareHistoryDTO>> GetHealthDeclareHistoriesAsync(
    int parentId, int pageNumber, int pageSize, string? search)
        {
            var histories = await _repository.GetHistoryByParentIdAsync(parentId, pageNumber, pageSize, search);
            var totalItems = await _repository.CountByParentIdAsync(parentId, search);

            var result = histories.Select(h => new HealthDeclareHistoryDTO
            {
                Id = h.Id,
                DeclarationDate = h.DeclarationDate,
                StudentId = h.StudentProfileId,
                Allergys = h.StudentProfile.Allergys,
                ChronicIllnesss = h.StudentProfile.ChronicIllnesss,
                LongTermMedications = h.StudentProfile.LongTermMedications,
                OtherMedicalConditions = h.StudentProfile.OtherMedicalConditions
            }).ToList();

            return new PageResult<HealthDeclareHistoryDTO>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                CurrentPage = pageNumber
            };
        }

        public async Task<HealthHistoryCountDTO> GetHealthHistoryCountsByParentIdAsync(int parentId)
        {
            return await _repository.GetCountsByParentIdAsync(parentId);
        }
    }
}