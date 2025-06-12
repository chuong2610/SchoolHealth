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

        public async Task<bool> CreateBlogPostDetailAsync(BlogPostDetailRequest request)
        {
            var post = new BlogPost
            {
                Title = request.Title,
                Content = JsonSerializer.Serialize(request.Content),
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
            if (request.Content != null)
            {
                var oldContent = JsonSerializer.Deserialize<BlogPostContent>(existingBlogPost.Content ?? "{}") ?? new BlogPostContent();

                if (!string.IsNullOrWhiteSpace(request.Content.Introduction))
                    oldContent.Introduction = request.Content.Introduction;

                if (request.Content.Symptoms != null && request.Content.Symptoms.Any(s => !string.IsNullOrWhiteSpace(s)))
                    oldContent.Symptoms = request.Content.Symptoms;

                if (request.Content.WhenToSeeDoctor != null && request.Content.WhenToSeeDoctor.Any(s => !string.IsNullOrWhiteSpace(s)))
                    oldContent.WhenToSeeDoctor = request.Content.WhenToSeeDoctor;

                if (request.Content.Prevention != null)
                {
                    oldContent.Prevention ??= new Prevention();

                    if (!string.IsNullOrWhiteSpace(request.Content.Prevention.Vaccination))
                        oldContent.Prevention.Vaccination = request.Content.Prevention.Vaccination;

                    if (request.Content.Prevention.PersonalHygiene != null && request.Content.Prevention.PersonalHygiene.Any(s => !string.IsNullOrWhiteSpace(s)))
                        oldContent.Prevention.PersonalHygiene = request.Content.Prevention.PersonalHygiene;

                    if (request.Content.Prevention.ImmunityBoost != null && request.Content.Prevention.ImmunityBoost.Any(s => !string.IsNullOrWhiteSpace(s)))
                        oldContent.Prevention.ImmunityBoost = request.Content.Prevention.ImmunityBoost;
                }

                // Serialize lại content sau khi chỉnh sửa
                existingBlogPost.Content = JsonSerializer.Serialize(oldContent);
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