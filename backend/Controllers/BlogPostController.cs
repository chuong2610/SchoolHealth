using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/BlogPosts")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;
        private readonly IBlogPostService _blogPostDetailService;

        public BlogPostController(IBlogPostService blogPostService, IBlogPostService blogPostDetailService)
        {
            _blogPostService = blogPostService;
            _blogPostDetailService = blogPostDetailService;
        }

        // GET: api/BlogPosts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostDTO>>> GetAll()
        {
            var posts = await _blogPostService.GetAllAsync();
            return Ok(posts);
        }

        // GET: api/BlogPosts/{id}/details
        [HttpGet("{id}/details")]
        public async Task<ActionResult<BlogPostDetailDTO>> GetDetails(int id)
        {
            var postDetail = await _blogPostDetailService.GetByIdAsync(id);
            if (postDetail == null)
            {
                return NotFound();
            }
            return Ok(postDetail);
        }
    }
}
