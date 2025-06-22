using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;

using backend.Interfaces;


namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _medicationRepository;

        private readonly IStudentRepository _studentRepository;

        public MedicationService(
            IMedicationRepository medicationRepository, IStudentRepository studentRepository)
        {
            _medicationRepository = medicationRepository;
            _studentRepository = studentRepository;

        }

        public async Task<bool> CreateMedicationAsync(MedicationRequest request)
        {
            // 1. Kiểm tra Medicines null hoặc rỗng
            if (request.Medicines == null || !request.Medicines.Any())
            {
                throw new Exception("Danh sách thuốc không được để trống.");
            }

            // 2. Kiểm tra dữ liệu từng thuốc
            if (request.Medicines.Any(m => string.IsNullOrWhiteSpace(m.MedicineName) || string.IsNullOrWhiteSpace(m.Dosage)))
            {
                throw new Exception("MedicineName hoặc Dosage không được để trống.");
            }

            // 3. Kiểm tra student tồn tại
            var student = await _studentRepository.GetByIdAsync(request.StudentId);
            if (student == null)
                throw new Exception("Không tìm thấy học sinh.");

            // 4. Tạo Medication và các MedicationDeclare
            var medication = new Medication
            {
                StudentId = request.StudentId,
                Status = "Pending",
                Date = DateTime.UtcNow,
                MedicationDeclares = request.Medicines.Select(m => new MedicationDeclare
                {
                    Name = m.MedicineName ?? "",
                    Dosage = m.Dosage ?? "",
                    Note = m.Notes ?? ""
                }).ToList()
            };

            // 5. Lưu vào DB
            var created = await _medicationRepository.AddAsync(medication);

            return created;
        }



        public async Task<PageResult<MedicationDTO>> GetMedicationsPendingAsync(int pageNumber, int pageSize, string? search)
        {
            var totalItems = await _medicationRepository.CountPendingMedicationsAsync(search);
            var medications = await _medicationRepository.GetMedicationsPendingAsync(pageNumber, pageSize, search);

            var dtos = medications
                .Select(m => MapToDTO(m))
                .ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PageResult<MedicationDTO>
            {
                Items = dtos,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }

        public async Task<PageResult<MedicationDTO>> GetMedicationsActiveByNurseIdAsync(int id, int pageNumber, int pageSize, string? search)
        {
            var totalItems = await _medicationRepository.CountMedicationsActiveByNurseIdAsync(id, search);

            var medications = await _medicationRepository.GetMedicationsActiveByNurseIdAsync(id, pageNumber, pageSize, search);

            var dtos = medications.Select(m => MapToDTO(m)).ToList();

            return new PageResult<MedicationDTO>
            {
                Items = dtos,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                CurrentPage = pageNumber
            };
        }

        public async Task<PageResult<MedicationDTO>> GetMedicationsCompletedByNurseIdAsync(int id, int pageNumber, int pageSize, string? search)
        {
            var totalItems = await _medicationRepository.CountMedicationsCompletedByNurseIdAsync(id, search);

            var medications = await _medicationRepository.GetMedicationsCompletedByNurseIdAsync(id, pageNumber, pageSize, search);

            var medicationDTOs = medications.Select(m => MapToDTO(m)).ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PageResult<MedicationDTO>
            {
                Items = medicationDTOs,
                TotalItems = totalItems,
                CurrentPage = pageNumber,
                TotalPages = totalPages
            };
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
                StudentClass = medication.Student?.Class?.ClassName ?? "",
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
                StudentClass = medication.Student?.Class?.ClassName ?? "",
                NurseName = medication.Nurse?.Name ?? "",
                StudentName = medication.Student?.Name ?? "",
                StudentClassName = medication.Student?.Class?.ClassName ?? "",
                ParentName = medication.Student?.Parent?.Name ?? ""
            };

        }

        public async Task<PageResult<MedicationDTO>> GetMedicationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var totalItems = await _medicationRepository.CountMedicationsByParentIdAsync(parentId, search);

            var medications = await _medicationRepository.GetMedicationsByParentIdAsync(parentId, pageNumber, pageSize, search);

            var dtos = medications
                .Select(m => MapToDTO(m))
                .ToList();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return new PageResult<MedicationDTO>
            {
                Items = dtos,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }


        public async Task<List<MedicationDTO>> GetMedicationsActiveAsync()
        {
            var medications = await _medicationRepository.GetMedicationsActiveAsync();
            return medications.Select(m => MapToDTO(m)).ToList();
        }

        public async Task<List<MedicationDTO>> GetMedicationsCompletedAsync()
        {
            var medications = await _medicationRepository.GetMedicationsCompletedAsync();
            return medications.Select(m => MapToDTO(m)).ToList();
        }
    }
}