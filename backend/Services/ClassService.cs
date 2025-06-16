using backend.Interfaces;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class ClassService : IClassService
    {
        public readonly IClassRepository _classRepository;
        public ClassService(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        public async Task<IEnumerable<ClassDTO>> GetAllClassAsync()
        {
            var classes = await _classRepository.GetAllAsync();
            var result = classes.Select(c => new ClassDTO
            {
                ClassId = c.Id,
                ClassName = c.ClassName
            });

            return result;
        }

    }
}