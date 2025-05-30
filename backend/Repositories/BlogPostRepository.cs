using backend.Data;
using backend.Models;
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

        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            return await _context.BlogPosts
                .Select(post => new BlogPostDTO
                {
                    Id = post.Id,
                    Title = post.Title,
                    // Nếu BlogPost không có ContentSummary, bạn có thể tính từ Content
                    ContentSummary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                    CreatedAt = post.CreatedAt,
                    ImageUrl = post.ImageUrl
                })
                .ToListAsync();
        }
    }
}
