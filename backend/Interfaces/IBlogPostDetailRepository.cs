using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostDetailRepository
    {
        Task<BlogPostDetailDTO> GetByIdAsync(int id);
    }

}
