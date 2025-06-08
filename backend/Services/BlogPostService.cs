using backend.Models.DTO;
using backend.Interfaces;
using backend.Models;
using System.Text.Json;

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

                string summary = "";

                try
                {
                    // Cố gắng deserialize JSON
                    var contentObj = JsonSerializer.Deserialize<BlogPostContent>(post.Content);

                    // Nếu deserialize thành công và Introduction có giá trị
                    if (contentObj != null && !string.IsNullOrWhiteSpace(contentObj.Introduction))
                    {
                        summary = contentObj.Introduction;

                        // Nếu bạn muốn giới hạn độ dài summary (ví dụ 100 ký tự)
                        if (summary.Length > 100)
                            summary = summary.Substring(0, 100) + "...";
                    }
                    else
                    {
                        // Nếu không có Introduction, fallback lấy raw substring
                        summary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content;
                    }
                }
                catch
                {
                    // Nếu deserialize fail thì fallback lấy raw substring
                    summary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content;
                }

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

            var content = JsonSerializer.Deserialize<BlogPostContent>(post.Content);

            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Author = post.Author,
                Content = content ?? new(),
                CreatedAt = post.CreatedAt,
                ImageUrl = imageUrl
            };
        }

    }
}