using backend.Models;
namespace backend.Interfaces
{
    public interface IStudentProfileRepository
    {
        Task<StudentProfile> CreateOrUpdateAsync(StudentProfile profile);
        Task<StudentProfile?> GetByIdAsync(int id);
    }
}
