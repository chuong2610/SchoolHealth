using backend.Interfaces;
using backend.Models.DTO;

namespace backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<StudentDTO>> GetStudentIdsByParentIdAsync(int parentId)
        {
            return await _repository.GetStudentIdsByParentIdAsync(parentId);
        }
    }

}