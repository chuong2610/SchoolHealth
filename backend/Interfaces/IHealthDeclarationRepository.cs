using backend.Models;

namespace backend.Interfaces
{
    public interface IHealthDeclarationRepository
    {
        Task<Student?> GetStudentByInfoAsync(string name, string className, DateOnly dob);

        Task SaveChangesAsync();
    }
}

