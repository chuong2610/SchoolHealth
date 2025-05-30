using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/BlogPosts")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _service;

        public BlogPostController(IBlogPostService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostDTO>>> GetAll()
        {
            var posts = await _service.GetAllAsync();
            return Ok(posts);
        }
    }
}
