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
                // Kiểm tra nếu ImageUrl tồn tại và tệp hình ảnh tồn tại trong wwwroot
                string imageUrl = post.ImageUrl;
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    // Chuyển ImageUrl thành đường dẫn vật lý để kiểm tra
                    string relativePath = imageUrl.TrimStart('/'); // Loại bỏ "/" đầu tiên
                    string imagePath = Path.Combine(_environment.WebRootPath, relativePath);
                    imageUrl = System.IO.File.Exists(imagePath) ? imageUrl : "/uploads/default.jpg";
                }
                else
                {
                    imageUrl = "/uploads/default.jpg"; // Hình ảnh mặc định nếu ImageUrl null
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

            // Kiểm tra nếu ImageUrl tồn tại và tệp hình ảnh tồn tại trong wwwroot
            string imageUrl = post.ImageUrl;
            if (!string.IsNullOrEmpty(imageUrl))
            {
                string relativePath = imageUrl.TrimStart('/'); // Loại bỏ "/" đầu tiên
                string imagePath = Path.Combine(_environment.WebRootPath, relativePath);
                imageUrl = System.IO.File.Exists(imagePath) ? imageUrl : "/uploads/default.jpg";
            }
            else
            {
                imageUrl = "/uploads/default.jpg"; // Hình ảnh mặc định nếu ImageUrl null
            }

            return new BlogPostDetailDTO
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                ImageUrl = imageUrl
            };
        }

    }
}