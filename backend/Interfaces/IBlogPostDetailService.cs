using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostDetailService
    {
        Task<BlogPostDetailDTO> GetByIdAsync(int id);
    }

}
