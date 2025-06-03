using backend.Interfaces;

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
    }
}