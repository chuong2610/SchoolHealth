using backend.Models;

namespace backend.Interfaces
{
    public interface IMedicationRepository
    {
        Task<Student?> GetStudentByNameAndClassAsync(string studentName, string className);
        Task<User?> GetUserByFullNameAsync(string fullName);
        Task AddMedicationAsync(Medication medication);
        Task SaveChangesAsync();
    }
}
