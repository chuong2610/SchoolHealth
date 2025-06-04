using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;


namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _medicationRepository;
        private readonly ApplicationDbContext _context;

        public MedicationService(
            IMedicationRepository medicationRepository, ApplicationDbContext context)

        {
            _medicationRepository = medicationRepository;
            _context = context;
            _medicationRepository = medicationRepository;

        }

        public async Task<MedicationDTO> CreateMedicationAsync(BulkMedicationRequest request)
        {
            var student = await _context.Students.FindAsync(request.StudentId);
            if (student == null)
                throw new Exception("Không tìm thấy học sinh");

            // Tạo đơn Medication
            var medication = new Medication
            {
                StudentId = request.StudentId,
                Status = "Pending",
                Date = DateTime.UtcNow
            };

            // Gắn các thuốc cụ thể
            medication.MedicationDeclares = request.Medicines.Select(m => new MedicationDeclare
            {
                Name = m.MedicineName,
                Dosage = m.Dosage,
                Note = m.Notes
            }).ToList();

            _context.Medications.Add(medication);
            await _context.SaveChangesAsync();

            // Trả về DTO
            return new MedicationDTO
            {
                Id = medication.StudentId,
                Status = medication.Status,
                CreatedDate = medication.Date,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                StudentClassName = medication.Student?.ClassName ?? "",
                ParentName = medication.Student?.Parent?.Name ?? "",
                Medications = medication.MedicationDeclares.Select(d => new MedicationDeclareDTO
                {
                    MedicationName = d.Name,
                    Dosage = d.Dosage,
                    Note = d.Note
                }).ToList(),
            };
        }



        public async Task<List<MedicationDTO>> GetMedicationsPendingAsync()
        {
            var medications = await _medicationRepository.GetMedicationsPendingAsync();
            return medications.Select(m => MapToDTO(m)).ToList();
        }

        public async Task<List<MedicationDTO>> GetMedicationsByNurseIdAsync(int id)
        {
            var medications = await _medicationRepository.GetMedicationsByNurseIdAsync(id);
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
                Status = medication.Status,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                StudentClassName = medication.Student?.ClassName ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };

        }
    }
}