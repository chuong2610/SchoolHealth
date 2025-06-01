namespace backend.Models.DTO
{
    public class BlogPostImageDTO
    {
        public string Title { get; set; } = string.Empty;
        public string ContentSummary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public IFormFile ImageFile { get; set; } = null!;
    }
}