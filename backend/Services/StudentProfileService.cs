using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.Extensions.Logging;


namespace backend.Services
{
    public class StudentProfileService : IStudentProfileService
    {
        private readonly IStudentProfileRepository _profileRepo;
        private readonly ILogger<StudentProfileService> _logger;

        public StudentProfileService(IStudentProfileRepository profileRepo, ILogger<StudentProfileService> logger)
        {
            _profileRepo = profileRepo;
            _logger = logger;
        }

        public async Task<StudentProfileDTO?> CreateStudentProfileAsync(StudentProfileRequest request)
        {
            var existingProfile = await _profileRepo.GetByIdAsync(request.Id);
            if (existingProfile != null)
            {
                // Cập nhật profile đã có
                existingProfile.Allergys = request.Allergys ?? string.Empty;
                existingProfile.ChronicIllnesss = request.ChronicIllnesss ?? string.Empty;
                existingProfile.LongTermMedications = request.LongTermMedications ?? string.Empty;
                existingProfile.OtherMedicalConditions = request.OtherMedicalConditions ?? string.Empty;

                await _profileRepo.CreateOrUpdateAsync(existingProfile);
            }
            else
            {
                // Tạo profile mới
                var newProfile = new StudentProfile
                {
                    Id = request.Id,
                    Allergys = request.Allergys ?? string.Empty,
                    ChronicIllnesss = request.ChronicIllnesss ?? string.Empty,
                    LongTermMedications = request.LongTermMedications ?? string.Empty,
                    OtherMedicalConditions = request.OtherMedicalConditions ?? string.Empty
                };

                await _profileRepo.CreateOrUpdateAsync(newProfile);
            }

            var savedProfile = await _profileRepo.GetByIdAsync(request.Id);
            return savedProfile == null ? null : ConvertToDTO(savedProfile);
        }

        public StudentProfileDTO ConvertToDTO(StudentProfile profile)
        {
            return new StudentProfileDTO
            {
                Id = profile.Id,
                Allergys = profile.Allergys,
                ChronicIllnesss = profile.ChronicIllnesss,
                LongTermMedications = profile.LongTermMedications,
                OtherMedicalConditions = profile.OtherMedicalConditions
            };
        }
    }

}
