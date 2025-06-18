using backend.Models.DTO;
using backend.Interfaces;
using backend.Models;
using System.Text.Json;
using backend.Models.Request;

namespace backend.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IBlogPostRepository _repository;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BlogPostService(IBlogPostRepository repository, IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            var posts = await _repository.GetAllAsync();

            var postDtos = posts.Select(post =>
            {
                if (post == null) return null;

                var request = _httpContextAccessor.HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}";

                string fileName = post.ImageUrl;
                string imageUrl = $"{baseUrl}/uploads/{fileName}";
                string imagePath = Path.Combine(_environment.WebRootPath, "uploads", fileName ?? "");

                if (string.IsNullOrEmpty(fileName) || !System.IO.File.Exists(imagePath))
                {
                    imageUrl = $"{baseUrl}/uploads/default.jpg";
                }

                // Tạo ContentSummary từ string thuần
                string summary = string.IsNullOrWhiteSpace(post.Content)
                    ? ""
                    : (post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content);

                return new BlogPostDTO
                {
                    Id = post.Id,
                    Title = post.Title,
                    ContentSummary = summary,
                    ImageUrl = imageUrl
                };
            }).ToList();

            return postDtos;
        }



        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            var post = await _repository.GetByIdAsync(id);
            if (post == null) return null;

            var request = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            string fileName = post.ImageUrl;
            string imageUrl = $"{baseUrl}/uploads/{fileName}";
            string imagePath = Path.Combine(_environment.WebRootPath, "uploads", fileName ?? "");

            if (string.IsNullOrEmpty(fileName) || !System.IO.File.Exists(imagePath))
            {
                imageUrl = $"{baseUrl}/uploads/default.jpg";
            }

            // Không deserialize nữa, dùng trực tiếp Content chuỗi thuần
            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Author = post.Author,
                Content = post.Content, // Dùng trực tiếp
                CreatedAt = post.CreatedAt,
                ImageUrl = imageUrl
            };
        }


        public async Task<bool> CreateBlogPostDetailAsync(BlogPostDetailRequest request)
        {
            var post = new BlogPost
            {
                Title = request.Title,
                Content = request.Content,
                Author = request.Author,
                ImageUrl = request.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UserId = 1 // hoặc lấy từ context
            };

            var created = await _repository.AddAsync(post);

            return true;
        }

        public async Task<bool> UpdateBlogPostDetailAsync(int id, BlogPostDetailRequest request)
        {
            var existingBlogPost = await _repository.GetByIdAsync(id);
            if (existingBlogPost == null)
            {
                return false; // hoặc xử lý phù hợp
            }
            // Title
            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                existingBlogPost.Title = request.Title;
            }
            // Content
            if (!string.IsNullOrWhiteSpace(request.Content))
            {
                existingBlogPost.Content = request.Content;
            }
            // Author
            if (!string.IsNullOrWhiteSpace(request.Author))
            {
                existingBlogPost.Author = request.Author;
            }
            // ImageUrl
            if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            {
                existingBlogPost.ImageUrl = request.ImageUrl;
            }

            var updated = await _repository.UpdateAsync(existingBlogPost);

            return updated;
        }

        public async Task<bool> DeleteBlogPostDetailAsync(int id)
        {
            var blogPost = await _repository.GetByIdAsync(id);
            if (blogPost == null)
            {
                return false;
            }

            var deleted = await _repository.DeleteAsync(blogPost);
            return deleted;
        }

    }
}