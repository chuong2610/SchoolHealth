using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostService
    {
        // Lấy danh sách tất cả các bài đăng
        Task<IEnumerable<BlogPostDTO>> GetAllAsync();

        // Lấy chi tiết của 1 bài đăng
        Task<BlogPostDetailDTO> GetByIdAsync(int id);

    }
}
