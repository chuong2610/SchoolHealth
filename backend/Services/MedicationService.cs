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
            if (string.IsNullOrWhiteSpace(request.MedicineName))
            {
                throw new ArgumentException("Tên thuốc không được để trống.");
            }

            if (request.Quantity <= 0)
            {
                throw new ArgumentException("Số lượng thuốc phải lớn hơn 0.");
            }

            var entity = new Medication
            {
                Name = request.MedicineName,
                Dosage = request.Dosage,
                Quantity = request.Quantity,
                Notes = request.Notes,
                StudentId = student.Id,
                Status = "Pending",
                UserId = null
            };

            try
            {
                await _medicationRepository.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("Gửi thuốc thất bại do lỗi cơ sở dữ liệu.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Đã xảy ra lỗi khi gửi thuốc.", ex);
            }

            // Trả về dữ liệu tương tự request (hoặc tạo DTO riêng nếu cần)
            return new MedicationDTO
            {
                Id = entity.Id,
                MedicationName = entity.Name,
                Dosage = entity.Dosage,
                Quantity = entity.Quantity,
                Notes = entity.Notes,
                CreatedAt = entity.CreatedAt,
                StudentId = entity.StudentId,
                Status = entity.Status,
                UserId = entity.UserId
            };
        }
    }
}
