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

        public async Task<List<MedicationDTO>> CreateMedicationAsync(List<BulkMedicationRequest> requests)
        {
            var medicationList = new List<Medication>();

            foreach (var request in requests)
            {
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Id == request.StudentId);

                if (student == null)
                    throw new ArgumentException($"Không tìm thấy học sinh với ID {request.StudentId}.");

                foreach (var item in request.Medicines)
                {
                    if (string.IsNullOrWhiteSpace(item.MedicineName))
                        throw new ArgumentException("Tên thuốc không được để trống.");

                    if (item.Quantity <= 0)
                        throw new ArgumentException("Số lượng thuốc phải lớn hơn 0.");

                    medicationList.Add(new Medication
                    {
                        Name = item.MedicineName,
                        Dosage = item.Dosage,
                        Quantity = item.Quantity,
                        Notes = item.Notes,
                        StudentId = request.StudentId,
                        CreatedAt = DateTime.Now,
                        Status = "Pending",
                        UserId = null
                    });
                }
            }

            foreach (var med in medicationList)
            {
                await _medicationRepository.AddAsync(med);
            }

            await _context.SaveChangesAsync();

            return medicationList.Select(med => new MedicationDTO
            {
                Id = med.Id,
                MedicationName = med.Name,
                Dosage = med.Dosage,
                Quantity = med.Quantity,
                Notes = med.Notes,
                CreatedAt = med.CreatedAt,
                StudentId = med.StudentId,
                Status = med.Status,
                UserId = med.UserId
            }).ToList();
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