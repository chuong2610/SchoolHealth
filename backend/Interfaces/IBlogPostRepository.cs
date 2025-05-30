using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostRepository
    {
        // Danh sách bài đăng
        Task<IEnumerable<BlogPostDTO>> GetAllAsync();

        // Chi tiết bài đăng
        Task<BlogPostDetailDTO> GetByIdAsync(int id);
    }
}
