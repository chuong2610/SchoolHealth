using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface IBlogPostService
    {
        // Lấy danh sách tất cả các bài đăng
        Task<PageResult<BlogPostDTO>> GetAllAsync(int pageNumber, int pageSize);
        // Lấy chi tiết của 1 bài đăng
        Task<BlogPostDetailDTO> GetByIdAsync(int id);
        Task<bool> CreateBlogPostDetailAsync(BlogPostDetailRequest request);
        Task<bool> UpdateBlogPostDetailAsync(int id, BlogPostDetailRequest request);
        Task<bool> DeleteBlogPostDetailAsync(int id);

    }
}
