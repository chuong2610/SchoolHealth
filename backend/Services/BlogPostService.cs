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
            var posts = await _blogPostRepository.GetAllAsync(); // trả về IEnumerable<BlogPost>
            return posts.Select(post => new BlogPostDTO
            {
                Id = post.Id,
                Title = post.Title,
                ContentSummary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                CreatedAt = post.CreatedAt,
                ImageUrl = post.ImageUrl
            });
        }

        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            var post = await _blogPostRepository.GetByIdAsync(id); // trả về BlogPost hoặc BlogPostDetailDTO tùy repo
            if (post == null) return null;

            // Nếu repo trả về BlogPost entity, map sang DTO:
            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Author = post.Author,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                ImageUrl = post.ImageUrl
            };
        }
    }
}
