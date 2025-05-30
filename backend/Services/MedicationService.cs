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
            var student = await _context.Students
        .FirstOrDefaultAsync(s => s.Name == request.Name && s.ClassName == request.ClassName);

            if (student == null)
            {
                throw new Exception("Không tìm thấy học sinh với tên và lớp đã cung cấp.");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Name == request.SenderFullName);
            if (user == null)
            {
                throw new Exception("Không tìm thấy User với UserName đã cung cấp.");
            }

            var entity = new Medication
            {
                Name = request.Name,
                Dosage = request.Dosage,
                StudentId = student.Id,
                UserId = user.Id
            };

            await _medicationRepository.AddAsync(entity);

            return new MedicationRequest
            {
                Id = entity.Id,
                Name = entity.Name,
                Dosage = entity.Dosage,
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
