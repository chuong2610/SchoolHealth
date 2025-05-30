using backend.Models.DTO;
using backend.Interfaces;

namespace backend.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IBlogPostRepository _blogPostRepository;

        public BlogPostService(IBlogPostRepository blogPostRepository)
        {
            _blogPostRepository = blogPostRepository;
        }

        // Lấy danh sách bài đăng
        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            return await _blogPostRepository.GetAllAsync();
        }

        // Lấy chi tiết bài đăng
        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            return await _blogPostRepository.GetByIdAsync(id);
        }
    }
}
