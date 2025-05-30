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

        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            return await _blogPostRepository.GetAllAsync();
        }
    }
}
