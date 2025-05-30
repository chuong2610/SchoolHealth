using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;

namespace backend.Services
{
    public class HealthDeclarationService : IHealthDeclarationService
    {
        private readonly IHealthDeclarationRepository _repository;

        public HealthDeclarationService(IHealthDeclarationRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> SubmitHealthDeclarationAsync(HealthDeclarationDTO dto)
        {
            var student = await _repository.GetStudentByInfoAsync(dto.StudentName, dto.Class, dto.DateOfBirth);

            if (student == null)
                return "Student not found.";

            if (student.Profile == null)
            {
                student.Profile = new StudentProfile
                {
                    Student = student
                };
            }

            student.Profile.Allergys = dto.Allergies;
            student.Profile.ChronicIllnesss = dto.ExistingDiseases;
            student.Profile.LongTermMedications = dto.TreatmentHistory;
            student.Profile.OtherMedicalConditions =
                $"Thị lực: {dto.Vision}, Thính lực: {dto.Hearing}, Tiêm chủng: {dto.VaccinationHistory}, Ghi chú: {dto.AdditionalNotes}";

            await _repository.SaveChangesAsync();

            return "Health declaration submitted successfully.";
        }
    }
}
