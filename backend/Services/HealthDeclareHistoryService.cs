using System.Globalization;
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
            // Tách DateTime nếu chuỗi là ngày hợp lệ
            DateTime? searchDate = null;
            bool isDate = false;

            if (!string.IsNullOrEmpty(search) &&
                DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                searchDate = parsedDate;
                isDate = true;
            }

            // 👉 Nếu là tìm theo ngày → bỏ text search
            search = isDate ? null : search;

            // Truyền searchDate xuống repo
            var histories = await _repository.GetHistoryByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);
            var totalItems = await _repository.CountByParentIdAsync(parentId, search, searchDate);

            var result = histories.Select(h => new HealthDeclareHistoryDTO
            {
                Id = h.Id,
                StudentId = h.StudentProfileId,
                StudentName = h.StudentProfile?.Student?.Name ?? string.Empty,
                ClassName = h.StudentProfile?.Student?.Class?.ClassName ?? string.Empty,
                Allergys = h.Allergys ?? string.Empty,
                ChronicIllnesss = h.ChronicIllnesss ?? string.Empty,
                LongTermMedications = h.LongTermMedications ?? string.Empty,
                OtherMedicalConditions = h.OtherMedicalConditions ?? string.Empty,
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