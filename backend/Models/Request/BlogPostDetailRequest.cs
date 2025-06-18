namespace backend.Models.Request
{
    public class BlogPostDetailRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public IFormFile ImageUrl { get; set; }
    }
}