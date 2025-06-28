using backend.Models;
namespace backend.Interfaces
{
    public interface IStudentProfileRepository
    {
        Task<bool> CreateOrUpdateAsync(StudentProfile profile);
        Task<StudentProfile?> GetByIdAsync(int id);
        Task<StudentProfile> GetByIdWithIncludesAsync(int studentId);
        Task<StudentProfile?> GetByStudentIdAsync(int studentId);
    }
}
