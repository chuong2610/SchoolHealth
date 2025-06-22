using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostRepository
    {
        Task<IEnumerable<BlogPost>> GetAllAsync(int pageNumber, int pageSize);
        // Chi tiết bài đăng
        Task<BlogPost> GetByIdAsync(int id);
        Task<bool> AddAsync(BlogPost post);
        Task<bool> UpdateAsync(BlogPost blogPost);
        Task<bool> DeleteAsync(BlogPost blogPostDetail);
        Task<int> CountAsync();
    }
}
