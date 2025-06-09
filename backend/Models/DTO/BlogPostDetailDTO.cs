using System.Text.Json.Serialization;

namespace backend.Models.DTO
{
    public class BlogPostDetailDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public BlogPostContent Content { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string ImageUrl { get; set; } = string.Empty;
    }
}