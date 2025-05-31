using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

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

        }

        public async Task<MedicationRequest> CreateMedicationAsync(MedicationRequest request)
        {
            // Tìm học sinh theo ID
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == request.StudentId);

            if (student == null)
            {
                throw new Exception("Không tìm thấy học sinh với ID đã cung cấp.");
            }

            var entity = new Medication
            {
                Name = request.MedicineName,    // Lưu ý trùng với request field
                Dosage = request.Dosage,
                Status = request.Status,
                StudentId = student.Id,
                UserId = 2   // Gán cố định UserId (nurse) là 2
            };

            await _medicationRepository.AddAsync(entity);

            // Trả về dữ liệu tương tự request (hoặc tạo DTO riêng nếu cần)
            return new MedicationRequest
            {
                Id = entity.Id,
                MedicineName = entity.Name,
                Dosage = entity.Dosage,
                Status = entity.Status,
                StudentId = entity.StudentId,
                UserId = entity.UserId
            };
        }

        public async Task<MedicationDTO> GetMedicationByIdAsync(int id)
        {
            var entity = await _medicationRepository.GetByIdAsync(id);
            if (entity == null) return null;

            return new MedicationDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                Dosage = entity.Dosage,
            };
        }

        public async Task<IEnumerable<MedicationDTO>> GetAllMedicationsAsync()
        {
            var entities = await _medicationRepository.GetAllAsync();
            return entities.Select(entity => new MedicationDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                Dosage = entity.Dosage,
            });
        }
    }
}
