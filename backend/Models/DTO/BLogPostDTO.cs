using System.Text.Json.Serialization;

namespace backend.Models.DTO
{
    public class BlogPostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public string ContentSummary { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string ImageName { get; set; } = string.Empty;
        [JsonIgnore]
        public string BaseUrl { get; set; }

        public string ImageUrl => string.IsNullOrEmpty(ImageName) ? null : $"{BaseUrl}/uploads/{ImageName}";
    }
}