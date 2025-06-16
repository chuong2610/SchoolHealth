using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;
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

        public async Task<bool> CreateStudentProfileAsync(StudentProfileRequest request)
        {
            if (request == null)
            {
                throw new Exception("Yêu cầu không hợp lệ.");
            }

            var existingProfile = await _profileRepo.GetByIdAsync(request.StudentId);
            bool createdOrUpdated;

            if (existingProfile != null)
            {
                // Cập nhật profile
                existingProfile.Allergys = request.Allergys ?? string.Empty;
                existingProfile.ChronicIllnesss = request.ChronicIllnesss ?? string.Empty;
                existingProfile.LongTermMedications = request.LongTermMedications ?? string.Empty;
                existingProfile.OtherMedicalConditions = request.OtherMedicalConditions ?? string.Empty;

                createdOrUpdated = await _profileRepo.CreateOrUpdateAsync(existingProfile);
            }
            else
            {
                // Tạo profile mới
                var newProfile = new StudentProfile
                {
                    Id = request.StudentId,
                    Allergys = request.Allergys ?? string.Empty,
                    ChronicIllnesss = request.ChronicIllnesss ?? string.Empty,
                    LongTermMedications = request.LongTermMedications ?? string.Empty,
                    OtherMedicalConditions = request.OtherMedicalConditions ?? string.Empty
                };

                createdOrUpdated = await _profileRepo.CreateOrUpdateAsync(newProfile);
            }

            return createdOrUpdated;
        }

        public StudentProfileDTO ConvertToDTO(StudentProfile profile)
        {
            return new StudentProfileDTO
            {
                StudentId = profile.Id,
                Allergys = profile.Allergys,
                ChronicIllnesss = profile.ChronicIllnesss,
                LongTermMedications = profile.LongTermMedications,
                OtherMedicalConditions = profile.OtherMedicalConditions
            };
        }
    }

}
