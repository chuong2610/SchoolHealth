using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;
using backend.Interfaces;


namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _medicationRepository;

        private readonly ApplicationDbContext _context;
        private readonly IStudentService _studentService;

        public MedicationService(
            IMedicationRepository medicationRepository, ApplicationDbContext context, IStudentService studentService)
        {
            _medicationRepository = medicationRepository;
            _context = context;
            _studentService = studentService;

        }

        public async Task<bool> CreateMedicationAsync(MedicationRequest request)
        {
            // kiểm tra studentId
            var student = await _studentService.GetStudentByIdAsync(request.StudentId);
            // kiểm tra tên thuốc và liều dùng có null hay không
            if (request.Medicines.Any(m => string.IsNullOrWhiteSpace(m.MedicineName) || string.IsNullOrWhiteSpace(m.Dosage)))
            {
                throw new Exception("MedicineName hoặc Dosage không được để trống.");
            }

            // Tạo mới Medication
            var medication = new Medication
            {
                StudentId = request.StudentId,
                Status = "Pending",
                Date = DateTime.UtcNow,
                MedicationDeclares = request.Medicines.Select(m => new MedicationDeclare
                {
                    Name = m.MedicineName,
                    Dosage = m.Dosage,
                    Note = m.Notes
                }).ToList()
            };

            // Lưu vào DB
            await _medicationRepository.AddAsync(medication);

            return true;
        }


        public async Task<List<MedicationDTO>> GetMedicationsPendingAsync()
        {
            var medications = await _medicationRepository.GetMedicationsPendingAsync();
            return medications.Select(m => MapToDTO(m)).ToList();
        }

        public async Task<List<MedicationDTO>> GetMedicationsActiveByNurseIdAsync(int id)
        {
            var medications = await _medicationRepository.GetMedicationsActiveByNurseIdAsync(id);
            return medications.Select(m => MapToDTO(m)).ToList();
        }

        public async Task<List<MedicationDTO>> GetMedicationsCompletedByNurseIdAsync(int id)
        {
            var medications = await _medicationRepository.GetMedicationsCompletedByNurseIdAsync(id);
            return medications.Select(m => MapToDTO(m)).ToList();
        }

        public async Task<MedicationDetailDTO> GetMedicationDetailDTOAsync(int id)
        {
            var medication = await _medicationRepository.GetMedicationByIdAsync(id);
            if (medication == null)
            {
                throw new KeyNotFoundException("Medication not found");
            }

            return new MedicationDetailDTO
            {
                Medications = medication.MedicationDeclares.Select(m => new MedicationDeclareDTO
                {
                    MedicationName = m.Name,
                    Dosage = m.Dosage,
                    Note = m.Note ?? ""
                }).ToList(),
                CreatedDate = medication.Date,
                ReviceDate = medication.ReviceDate,
                Status = medication.Status,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };
        }

        public async Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId)
        {
            return await _medicationRepository.UpdateNurseIdAsync(medicationId, nurseId);
        }

        private MedicationDTO MapToDTO(Medication medication)
        {
            return new MedicationDTO
            {
                Id = medication.Id,
                Medications = medication.MedicationDeclares.Select(m => new MedicationDeclareDTO
                {
                    MedicationName = m.Name,
                    Dosage = m.Dosage,
                    Note = m.Note ?? ""
                }).ToList(),
                CreatedDate = medication.Date,
                ReviceDate = medication.ReviceDate,
                Status = medication.Status,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                StudentClassName = medication.Student?.ClassName ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };

        }

        public async Task<List<MedicationDTO>> GetMedicationsByParentIdAsync(int parentId)
        {
            var medications = await _medicationRepository.GetMedicationsByParentIdAsync(parentId);
            return medications.Select(m => MapToDTO(m)).ToList();
        }
    }
}