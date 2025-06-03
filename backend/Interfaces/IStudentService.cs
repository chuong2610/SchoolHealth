using backend.Models;

namespace backend.Interfaces
{
    public interface IStudentService
    {
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);
    }
}