using backend.Models;
namespace backend.Interfaces
{
    public interface IStudentProfileRepository
    {
        Task<bool> CreateOrUpdateAsync(StudentProfile profile);
        Task<StudentProfile?> GetByIdAsync(int id);
    }
}
