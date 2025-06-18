using backend.Models.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using backend.Models.Request;

namespace backend.Controllers
{
    [Route("api/BlogPosts")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;


        public BlogPostController(IBlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }

        // GET: api/BlogPosts
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 3)
        {
            var result = await _blogPostService.GetAllAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostDetailDTO>> GetDetails(int id)
        {
            var postDetail = await _blogPostService.GetByIdAsync(id);
            return Ok(postDetail);
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponse<object>>> CreateBlogPostDetail([FromBody] BlogPostDetailRequest blogPostDetailRequest)
        {
            try
            {
                if (blogPostDetailRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Tạo bài viết thất bại", false));
                }

                var isSuccess = await _blogPostService.CreateBlogPostDetailAsync(blogPostDetailRequest);
                return Ok(new BaseResponse<bool>(isSuccess, "Tạo bài viết thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
        [HttpPatch("{id}")]
        public async Task<ActionResult<BaseResponse<BlogPostDetailDTO>>> UpdateBlogPostDetail([FromBody] BlogPostDetailRequest blogPostDtailRequest, int id)
        {
            try
            {
                if (blogPostDtailRequest == null)
                {
                    return BadRequest(new BaseResponse<bool>(false, "Cập nhật bài viết thất bại", false));
                }

                var isSuccess = await _blogPostService.UpdateBlogPostDetailAsync(id, blogPostDtailRequest);
                return Ok(new BaseResponse<bool>(isSuccess, "Cập nhật bài viết thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<bool>>> DeleteBlogPostDetail(int id)
        {
            try
            {
                var isDeleted = await _blogPostService.DeleteBlogPostDetailAsync(id);
                if (!isDeleted)
                {
                    return NotFound(new BaseResponse<bool>(false, "Không tìm thấy bài viết cần xóa", false));
                }

                return Ok(new BaseResponse<bool>(true, "Xóa bài viết thành công", true));
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse<bool>(false, $"Lỗi: {ex.Message}", false));
            }
        }
    }
}
