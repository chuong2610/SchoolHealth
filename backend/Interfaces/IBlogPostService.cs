using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostService
    {
        Task<IEnumerable<BlogPostDTO>> GetAllAsync();
    }
}
