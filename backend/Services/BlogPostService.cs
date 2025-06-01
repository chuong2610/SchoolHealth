using backend.Models.DTO;
using backend.Interfaces;
using backend.Models;

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
            var posts = await _blogPostRepository.GetAllAsync();
            return posts.Select(post => new BlogPostDTO
            {
                Id = post.Id,
                Title = post.Title,
                ContentSummary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                CreatedAt = post.CreatedAt,
                ImageName = post.ImageName
            });
        }

        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            var post = await _blogPostRepository.GetByIdAsync(id);
            if (post == null) return null;

            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Author = post.Author,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                ImageName = post.ImageName
            };
        }
    }
}
