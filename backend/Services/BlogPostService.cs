using backend.Models.DTO;
using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IBlogPostRepository _repository;
        private readonly IWebHostEnvironment _environment;

        public BlogPostService(IBlogPostRepository repository, IWebHostEnvironment environment)
        {
            _repository = repository;
            _environment = environment;
        }

        public async Task<IEnumerable<BlogPostDTO>> GetAllAsync()
        {
            var posts = await _repository.GetAllAsync();
            var postDtos = posts.Select(post =>
            {
                // Lấy tên file từ DB
                string fileName = post.ImageUrl;

                // Gắn đường dẫn tương đối
                string imageUrl = $"/uploads/{fileName}";

                // Kiểm tra file vật lý
                string imagePath = Path.Combine(_environment.WebRootPath, "uploads", fileName ?? "");

                if (string.IsNullOrEmpty(fileName) || !System.IO.File.Exists(imagePath))
                {
                    imageUrl = "/uploads/default.jpg"; // Hình mặc định nếu không tồn tại
                }

                return new BlogPostDTO
                {
                    Id = post.Id,
                    Title = post.Title,
                    ContentSummary = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                    ImageUrl = imageUrl
                };
            }).ToList();

            return postDtos;
        }

        public async Task<BlogPostDetailDTO> GetByIdAsync(int id)
        {
            var post = await _repository.GetByIdAsync(id);
            if (post == null)
            {
                return null;
            }

            string fileName = post.ImageUrl;
            string imageUrl = $"/uploads/{fileName}";

            string imagePath = Path.Combine(_environment.WebRootPath, "uploads", fileName ?? "");

            if (string.IsNullOrEmpty(fileName) || !System.IO.File.Exists(imagePath))
            {
                imageUrl = "/uploads/default.jpg";
            }

            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Author = post.Author,
                Content = post.Content,
                ImageUrl = imageUrl
            };
        }

    }
}