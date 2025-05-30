using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _repository;

        public MedicationService(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> SendMedicationAsync(SendMedicationDTO dto)
        {
            var student = await _repository.GetStudentByNameAndClassAsync(dto.StudentName, dto.ClassName);
            if (student == null)
                return "Student not found.";

            var nurse = await _repository.GetUserByFullNameAsync(dto.SenderFullName);
            if (nurse == null)
                return "Sender (Nurse) not found.";

            var medication = new Medication
            {
                Name = dto.MedicineName,
                Dosage = dto.Dosage,
                Status = "Pending", // mặc định trạng thái
                StudentId = student.Id,
                UserId = nurse.Id
            };

            await _repository.AddMedicationAsync(medication);
            await _repository.SaveChangesAsync();

            return "Medication sent and saved successfully.";
        }
    }
}
