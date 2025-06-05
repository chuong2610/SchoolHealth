using backend.Models.DTO;
using backend.Models.Request;
namespace backend.Interfaces
{
    public interface IStudentProfileService
    {
        Task<bool> CreateStudentProfileAsync(StudentProfileRequest request);
    }
}
