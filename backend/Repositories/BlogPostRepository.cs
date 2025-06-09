using backend.Data;
using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using backend.Models;

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
        public async Task<IEnumerable<BlogPost>> GetAllAsync()
        {
            return await _context.BlogPosts.ToListAsync();
        }

        public async Task<BlogPost> GetByIdAsync(int id)
        {
            return await _context.BlogPosts.FindAsync(id);
        }

        public async Task<BlogPost> AddAsync(BlogPost post)
        {
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<BlogPost> UpdateAsync(BlogPost blogPost)
        {
            _context.BlogPosts.Update(blogPost);
            await _context.SaveChangesAsync();
            return blogPost;
        }
        public async Task DeleteAsync(BlogPost blogPostDetail)
        {
            _context.BlogPosts.Remove(blogPostDetail);
            await _context.SaveChangesAsync();
        }
    }
}
