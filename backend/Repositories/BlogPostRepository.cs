using backend.Data;
using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace backend.Repositories
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogPostRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<BlogPost>> GetAllAsync(int pageNumber, int pageSize)
        {
            return await _context.BlogPosts
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<int> CountAsync()
        {
            return await _context.BlogPosts
                .Where(p => p.IsActive)
                .CountAsync();
        }

        public async Task<BlogPost> GetByIdAsync(int id)
        {
            return await _context.BlogPosts
                    .FirstOrDefaultAsync(ms => ms.Id == id && ms.IsActive);
        }

        public async Task<bool> AddAsync(BlogPost post)
        {
            _context.BlogPosts.Add(post);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<bool> UpdateAsync(BlogPost blogPost)
        {
            _context.BlogPosts.Update(blogPost);
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }
        public async Task<bool> DeleteAsync(BlogPost blogPostDetail)
        {
            blogPostDetail.IsActive = false;
            _context.BlogPosts.Update(blogPostDetail);
            var deleted = await _context.SaveChangesAsync();
            return deleted > 0;
        }
    }
}
