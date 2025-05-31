using backend.Models;
using backend.Models.DTO;

namespace backend.Interfaces
{
    public interface IBlogPostRepository
    {
        // Danh sách bài đăng
        Task<IEnumerable<BlogPost>> GetAllAsync();

        // Chi tiết bài đăng
        Task<BlogPost> GetByIdAsync(int id);
    }
}
