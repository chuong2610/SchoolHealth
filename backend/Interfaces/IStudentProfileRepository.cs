using backend.Models;
namespace backend.Interfaces
{
    public interface IStudentProfileRepository
    {
        Task<StudentProfile> CreateAsync(StudentProfile profile);
        Task<StudentProfile?> GetByIdAsync(int id);
        Task<IEnumerable<StudentProfile>> GetAllByStudentIdAsync(int studentId);
    }
}
