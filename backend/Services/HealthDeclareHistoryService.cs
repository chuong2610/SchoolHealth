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
                StudentId = h.StudentProfileId,
                StudentName = h.StudentProfile?.Student?.Name ?? string.Empty,
                ClassName = h.StudentProfile?.Student?.Class?.ClassName ?? string.Empty,
                Allergys = h.StudentProfile?.Allergys ?? string.Empty,
                ChronicIllnesss = h.StudentProfile?.ChronicIllnesss ?? string.Empty,
                LongTermMedications = h.StudentProfile?.LongTermMedications ?? string.Empty,
                OtherMedicalConditions = h.StudentProfile?.OtherMedicalConditions ?? string.Empty,
                DeclarationDate = h.DeclarationDate
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