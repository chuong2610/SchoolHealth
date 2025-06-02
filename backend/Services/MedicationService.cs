using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepsitory _medicationRepository;

        public MedicationService(IMedicationRepsitory medicationRepository)
        {
            _medicationRepository = medicationRepository;
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
                MedicationName = medication.Name,
                Dosage = medication.Dosage,
                CreatedDate = medication.Date,
                Description = medication.Note,
                Status = medication.Status,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };
        }

        private MedicationDTO MapToDTO(Medication medication)
        {
            return new MedicationDTO
            {
                Id = medication.Id,
                MedicationName = medication.Name,
                Dosage = medication.Dosage,
                CreatedDate = medication.Date,
                Status = medication.Status,
                StudentClass = medication.Student?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };
        }
    }
}