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
            // Tạo profile chỉ với StudentId (không cần Student object)
            var profile = new StudentProfile
            {
                Id = request.Id,
                Allergys = request.Allergys,
                ChronicIllnesss = request.ChronicIllnesss,
                LongTermMedications = request.LongTermMedications,
                OtherMedicalConditions = request.OtherMedicalConditions
            };

            await _profileRepo.CreateAsync(profile);

            // Truy vấn lại để lấy Student info sau khi thêm
            var newProfile = await _profileRepo.GetByIdAsync(profile.Id);
            if (newProfile == null) return null;

            return ConvertToDTO(newProfile);
        }

        public async Task<StudentProfileDTO?> GetStudentProfileByIdAsync(int id)
        {
            var profile = await _profileRepo.GetByIdAsync(id);
            if (profile == null) return null;
            return ConvertToDTO(profile);
        }

        public async Task<IEnumerable<StudentProfileDTO>> GetStudentProfilesByStudentIdAsync(int studentId)
        {
            var profiles = await _profileRepo.GetAllByStudentIdAsync(studentId);
            return profiles.Select(ConvertToDTO);
        }

        public StudentProfileDTO ConvertToDTO(StudentProfile profile)
        {
            return new StudentProfileDTO
            {
                Id = profile.Id,
                StudentId = profile.Student?.Id ?? 0,
                Allergys = profile.Allergys,
                ChronicIllnesss = profile.ChronicIllnesss,
                LongTermMedications = profile.LongTermMedications,
                OtherMedicalConditions = profile.OtherMedicalConditions
            };
        }
    }

}
