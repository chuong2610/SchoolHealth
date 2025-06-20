using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services
{
    public class MedicalEventService : IMedicalEventService
    {
        private readonly IMedicalEventRepository _medicalEventRepository;
        private readonly IMedicalEventSupplyService _medicalEventSupplyService;
        private readonly IMedicalSupplyService _medicalSupplyService;
        private readonly IStudentService _studentService;

        public MedicalEventService(IMedicalEventRepository medicalEventRepository, IMedicalEventSupplyService medicalEventSupplyService, IMedicalSupplyService medicalSupplyService, IStudentService studentService)
        {
            _medicalEventRepository = medicalEventRepository;
            _medicalEventSupplyService = medicalEventSupplyService;
            _medicalSupplyService = medicalSupplyService;
            _studentService = studentService;
        }

        public async Task<bool> CreateMedicalEventAsync(MedicalEventRequest medicalEvent)
        {
            var student = await _studentService.GetStudentByStudentNumberAsync(medicalEvent.StudentNumber);
            if (student == null)
            {
                return false; // Student not found
            }
            var newMedicalEvent = new MedicalEvent
            {
                EventType = medicalEvent.EventType,
                Location = medicalEvent.Location,
                Description = medicalEvent.Description,
                Date = medicalEvent.Date,
                Status = "Pending", // Default status
                StudentId = student.Id,
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
                        if (!await _medicalSupplyService.UpdateMedicalSupplyQuantityAsync(supply.MedicalSupplyId, -supply.Quantity))
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
        public async Task<MedicalEventDetailDTO?> GetMedicalEventByIdAsync(int id)
        {
            var medicalEvent = await _medicalEventRepository.GetMedicalEventByIdAsync(id);
            if (medicalEvent == null)
            {
                return null; // Medical event not found
            }

            return new MedicalEventDetailDTO
            {
                EventType = medicalEvent.EventType,
                Location = medicalEvent.Location,
                Description = medicalEvent.Description,
                Date = medicalEvent.Date,
                StudentName = medicalEvent.Student.Name, // Assuming Student has a Name property
                NurseName = medicalEvent.Nurse.Name, // Assuming Nurse has a Name property
                Supplies = medicalEvent.MedicalEventSupplys.Select(s => new MedicationEventSupplyDetailDTO
                {
                    MedicalSupplyName = s.MedicalSupply.Name, // Assuming MedicalSupply has a Name property
                    Quantity = s.Quantity
                }).ToList()
            };
        }
        public async Task<PageResult<MedicalEventDTO>> GetAllMedicalEventsAsync(int pageNumber, int pageSize)
        {
            var totalItems = await _medicalEventRepository.CountMedicalEventsAsync();

            var medicalEvents = await _medicalEventRepository.GetAllMedicalEventsAsync(pageNumber, pageSize);

            var eventDTOs = medicalEvents.Select(me => new MedicalEventDTO
            {
                Id = me.Id,
                EventType = me.EventType,
                Location = me.Location,
                Date = me.Date,
                StudentName = me.Student?.Name,
                NurseName = me.Nurse?.Name
            }).ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PageResult<MedicalEventDTO>
            {
                Items = eventDTOs,
                TotalItems = totalItems,
                CurrentPage = pageNumber,
                TotalPages = totalPages
            };
        }
        public async Task<List<MedicalEventDTO>> GetMedicalEventsTodayAsync()
        {
            var medicalEvents = await _medicalEventRepository.GetMedicalEventsTodayAsync();
            return medicalEvents.Select(me => new MedicalEventDTO
            {
                Id = me.Id,
                EventType = me.EventType,
                Location = me.Location,
                Date = me.Date,
                StudentName = me.Student.Name, // Assuming Student has a Name property
                NurseName = me.Nurse.Name // Assuming Nurse has a Name property
            }).ToList();
        }
        public async Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync()
        {
            return await _medicalEventRepository.GetWeeklyMedicalEventCountsAsync();
        }
    }
}