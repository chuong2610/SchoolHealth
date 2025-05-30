using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostRepository
    {
        Task<IEnumerable<BlogPostDTO>> GetAllAsync();
    }
}
