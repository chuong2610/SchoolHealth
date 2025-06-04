using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _medicationRepository;

        public MedicationService(IMedicationRepository medicationRepository)
        {
            _medicationRepository = medicationRepository;
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