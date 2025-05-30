using backend.Data;
using backend.Models;
using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BlogPostDetailRepository : IBlogPostDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogPostDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }

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
