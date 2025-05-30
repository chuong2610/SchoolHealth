using backend.Data;
using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogPostRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả bài viết
        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            return await _context.BlogPosts
                .Select(post => new BlogPostDTO
                {
                    Id = post.Id,
                    Title = post.Title,
                    ContentSummary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                    CreatedAt = post.CreatedAt,
                    ImageUrl = post.ImageUrl
                })
                .ToListAsync();
        }

        // Lấy chi tiết 1 bài viết
        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            return await _context.BlogPosts
                .Where(b => b.Id == id)
                .Select(b => new BlogPostDetailDTO
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Content = b.Content,
                    CreatedAt = b.CreatedAt,
                    ImageUrl = b.ImageUrl
                })
                .FirstOrDefaultAsync();
        }
    }
}
