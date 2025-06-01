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

        public async Task<MedicationDTO> CreateMedicationAsync(MedicationRequest request)
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
                Name = request.MedicineName,
                Dosage = request.Dosage,
                Quantity = request.Quantity,
                Time = request.Time,
                StudentId = student.Id,
                UserId = 2   // Gán cố định UserId (nurse) là 2
            };

            await _medicationRepository.AddAsync(entity);
            await _context.SaveChangesAsync();

            // Trả về dữ liệu tương tự request (hoặc tạo DTO riêng nếu cần)
            return new MedicationDTO
            {
                Id = entity.Id,
                MedicationName = entity.Name,
                Dosage = entity.Dosage,
                Quantity = entity.Quantity,
                Time = entity.Time,
                StudentId = entity.StudentId,
                Status = entity.Status,
                UserId = entity.UserId
            };
        }
    }
}
