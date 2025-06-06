using backend.Models;

namespace backend.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student?> GetStudentByStudentNumberAsync(string studentNumber);

    }
}