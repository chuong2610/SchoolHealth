using backend.Interfaces;
using backend.Models;
using backend.Models.Request;

namespace backend.Services
{
    public class MedicalEventService : IMedicalEventService
    {
        private readonly IMedicalEventRepository _medicalEventRepository;
        private readonly IMedicalEventSupplyService _medicalEventSupplyService;
        private readonly IMedicalSupplyService _medicalSupplyService;

        public MedicalEventService(IMedicalEventRepository medicalEventRepository, IMedicalEventSupplyService medicalEventSupplyService, IMedicalSupplyService medicalSupplyService)
        {
            _medicalEventRepository = medicalEventRepository;
            _medicalEventSupplyService = medicalEventSupplyService;
            _medicalSupplyService = medicalSupplyService;
        }

        public async Task<bool> CreateMedicalEventAsync(MedicalEventRequest medicalEvent)
        {
            var newMedicalEvent = new MedicalEvent
            {
                EventType = medicalEvent.EventType,
                Location = medicalEvent.Location,
                Description = medicalEvent.Description,
                Date = medicalEvent.Date,
                Status = "Pending", // Default status
                StudentId = medicalEvent.StudentId,
                UserId = medicalEvent.NurseId, // Assuming NurseId corresponds to UserId

            };
            var createdMedicalEvent = await _medicalEventRepository.CreateMedicalEventAsync(newMedicalEvent);
            if (createdMedicalEvent == null || createdMedicalEvent.Id == 0)
            {
                return false;
            }
            else
            {
                foreach (var supply in medicalEvent.MedicalEventSupplys)
                {
                    if (await _medicalEventSupplyService.CreateMedicalEventSupplyAsync(createdMedicalEvent.Id, supply.MedicalSupplyId, supply.Quantity))
                    {
                        if(! await _medicalSupplyService.UpdateMedicalSupplyQuantityAsync(supply.MedicalSupplyId, -supply.Quantity))
                        {
                            return false; // If supply update fails, return false
                        }
                    }
                    else
                    {
                        return false; // If any supply creation fails, return false
                    }
                }
                return true;
            }
        }
    }
}