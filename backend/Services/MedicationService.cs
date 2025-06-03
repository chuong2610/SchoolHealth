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

        public async Task<List<MedicationDTO>> CreateMedicationAsync(List<MedicationRequest> requests)
        {
            var medicationList = new List<Medication>();

            foreach (var request in requests)
            {
                // Kiểm tra hợp lệ từng thuốc
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Id == request.StudentId);

                if (student == null)
                    throw new ArgumentException($"Không tìm thấy học sinh với ID {request.StudentId}.");

                if (string.IsNullOrWhiteSpace(request.MedicineName))
                    throw new ArgumentException("Tên thuốc không được để trống.");

                if (request.Quantity <= 0)
                    throw new ArgumentException("Số lượng thuốc phải lớn hơn 0.");

                var medication = new Medication
                {
                    Name = request.MedicineName,
                    Dosage = request.Dosage,
                    Quantity = request.Quantity,
                    Notes = request.Notes,
                    StudentId = student.Id,
                    CreatedAt = DateTime.Now,
                    Status = "Pending",
                    UserId = null
                };

                medicationList.Add(medication);
            }

            try
            {
                foreach (var med in medicationList)
                {
                    await _medicationRepository.AddAsync(med);
                }

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("Lỗi khi lưu thuốc vào cơ sở dữ liệu.", ex);
            }

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
    }
}

