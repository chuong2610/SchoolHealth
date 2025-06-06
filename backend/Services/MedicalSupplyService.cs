using backend.Interfaces;
using backend.Models.DTO;

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

        public Task<List<MedicalSupplyDTO>> GetAllMedicalSuppliesAsync()
        {
            return _medicalSupplyRepository.GetAllMedicalSuppliesAsync()
            .ContinueWith(task => task.Result.Select(supply => new MedicalSupplyDTO
            {
                Id = supply.Id,
                Name = supply.Name,
                Quantity = supply.Quantity
            }).ToList());
        }
    }
}