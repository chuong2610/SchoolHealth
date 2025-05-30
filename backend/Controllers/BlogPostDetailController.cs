using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/BlogPostDetails")]
    [ApiController]
    public class BlogPostDetailController : ControllerBase
    {
        private readonly IBlogPostDetailService _blogPostDetailService;

        public BlogPostDetailController(IBlogPostDetailService blogPostDetailService)
        {
            _blogPostDetailService = blogPostDetailService;
        }


        // GET: api/BlogPostDetails/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostDetailDTO>> GetById(int id)
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
