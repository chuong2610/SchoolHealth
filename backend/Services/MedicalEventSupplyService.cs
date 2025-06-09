using backend.Interfaces;

namespace backend.Services
{
    public class MedicalEventSupplyService : IMedicalEventSupplyService
    {
        private readonly IMedicalEventSupplyRepository _medicalEventSupplyRepository;

        public MedicalEventSupplyService(IMedicalEventSupplyRepository medicalEventSupplyRepository)
        {
            _medicalEventSupplyRepository = medicalEventSupplyRepository;
        }

        public Task<bool> CreateMedicalEventSupplyAsync(int medicalEventId, int medicalSupplyId, int quantity)
        {
            return _medicalEventSupplyRepository.CreateMedicalEventSupplyAsync(medicalEventId, medicalSupplyId, quantity);
        }
    }
}