using backend.Models.DTO;
using backend.Interfaces;


namespace backend.Services
{
    public class BlogPostDetailService : IBlogPostDetailService
    {
        private readonly IBlogPostDetailRepository _blogPostDetailRepository;

        public BlogPostDetailService(IBlogPostDetailRepository blogPostDetailRepository)
        {
            _blogPostDetailRepository = blogPostDetailRepository;
        }

        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            return await _blogPostDetailRepository.GetByIdAsync(id);
        }

    }

}

