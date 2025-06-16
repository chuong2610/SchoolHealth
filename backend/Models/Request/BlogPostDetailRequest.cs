namespace backend.Models.Request
{
    public class BlogPostDetailRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public BlogPostContent Content { get; set; } = new();
        public string ImageUrl { get; set; } = string.Empty;
    }
}