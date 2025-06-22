using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class MedicalSupplyService : IMedicalSupplyService
    {
        private readonly IMedicalSupplyRepository _medicalSupplyRepository;

        public MedicalSupplyService(IMedicalSupplyRepository medicalSupplyRepository)
        {
            _medicalSupplyRepository = medicalSupplyRepository;
        }

        public Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity)
        {
            return _medicalSupplyRepository.UpdateMedicalSupplyQuantityAsync(supplyId, quantity);
        }

        public async Task<PageResult<MedicalSupplyDTO>> GetAllMedicalSuppliesAsync(int pageNumber, int pageSize)
        {
            var supplies = await _medicalSupplyRepository.GetAllMedicalSuppliesAsync(pageNumber, pageSize);
            var totalCount = await _medicalSupplyRepository.CountAllMedicalSuppliesAsync();

            var items = supplies.Select(s => new MedicalSupplyDTO
            {
                Id = s.Id,
                Name = s.Name,
                Quantity = s.Quantity
            }).ToList();

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            return new PageResult<MedicalSupplyDTO>
            {
                Items = items,
                TotalItems = totalCount,
                CurrentPage = pageNumber,
                TotalPages = totalPages
            };
        }

        public async Task<bool> CreateMedicalSuppliesAsync(MedicalSupplyRequest request)
        {
            var supply = new MedicalSupply
            {
                Name = request.Name,
                Description = request.Description,
                Quantity = request.Quantity ?? 0
            };
            var created = await _medicalSupplyRepository.AddMedicalSuppliesAsync(supply);
            return created;
        }

        public async Task<bool> UpdateMedicalSupplyAsync(MedicalSupplyRequest supplyRequest, int id)
        {
            var existingMedicalSupply = await _medicalSupplyRepository.GetMeidcalSuppliesByIdAsync(id);
            if (existingMedicalSupply == null)
            {
                return false;
            }
            // update Name if not null
            if (!string.IsNullOrWhiteSpace(supplyRequest.Name))
            {
                existingMedicalSupply.Name = supplyRequest.Name;
            }
            // update Description if not null
            if (!string.IsNullOrWhiteSpace(supplyRequest.Description))
            {
                existingMedicalSupply.Description = supplyRequest.Description;
            }
            // update Quantity if not null
            if (supplyRequest.Quantity.HasValue)
            {
                existingMedicalSupply.Quantity = supplyRequest.Quantity.Value;
            }
            var updated = await _medicalSupplyRepository.UpdateMedicalSuppliesAsync(existingMedicalSupply);
            return updated;

        }

        public async Task<bool> DeleteMeidcalSuppliesAsync(int id)
        {
            var medicalSupply = await _medicalSupplyRepository.GetMeidcalSuppliesByIdAsync(id);
            if (medicalSupply == null)
            {
                return false;
            }

            var deleted = await _medicalSupplyRepository.DeleteMedicalSuppliesAsync(medicalSupply);
            return deleted;
        }
    }
}