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
    }
}