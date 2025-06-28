using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;


namespace backend.Services
{
    public class StudentProfileService : IStudentProfileService
    {
        private readonly IStudentProfileRepository _profileRepo;

        public StudentProfileService(IStudentProfileRepository profileRepo)
        {
            _profileRepo = profileRepo;
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
                existingProfile.LastChangeDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
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
                    OtherMedicalConditions = request.OtherMedicalConditions ?? string.Empty,
                    LastChangeDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"))

                };
                createdOrUpdated = await _profileRepo.CreateOrUpdateAsync(newProfile);
            }


            return createdOrUpdated;
        }

        public StudentProfileDTO ConvertToDTO(StudentProfile profile)
        {
            return new StudentProfileDTO
            {
                StudentName = profile.Student.Name,
                StudentNumber = profile.Student.StudentNumber,
                ClassName = profile.Student.Class.ClassName,
                Allergys = profile.Allergys,
                ChronicIllnesss = profile.ChronicIllnesss,
                LongTermMedications = profile.LongTermMedications,
                OtherMedicalConditions = profile.OtherMedicalConditions,
                LastChangeDate = profile.LastChangeDate
            };
        }

        public async Task<StudentProfileDTO?> GetStudentProfileByIdAsync(int studentId)
        {
            var profile = await _profileRepo.GetByStudentIdAsync(studentId);
            return profile != null ? ConvertToDTO(profile) : null;
        }
    }

}
