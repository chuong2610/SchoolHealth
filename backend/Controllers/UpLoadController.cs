using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly FileUploadSettings _fileUploadSettings;
        private readonly IWebHostEnvironment _env;

        public UploadController(FileUploadSettings fileUploadSettings, IWebHostEnvironment env)
        {
            _fileUploadSettings = fileUploadSettings;
            _env = env;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new FileUploadResponse
                    {
                        Message = "No file uploaded",
                        Success = false
                    });
                }

                if (file.Length > _fileUploadSettings.MaxFileSize)
                {
                    return BadRequest(new FileUploadResponse
                    {
                        Message = "File size exceeds the limit",
                        Success = false
                    });
                }

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_fileUploadSettings.AllowedExtensions.Contains(extension))
                {
                    return BadRequest(new FileUploadResponse
                    {
                        Message = "Invalid file type",
                        Success = false
                    });
                }

                var uploadsPath = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, _fileUploadSettings.UploadPath);
                Directory.CreateDirectory(uploadsPath); // Tạo thư mục nếu chưa tồn tại

                var fileName = Guid.NewGuid().ToString() + extension;
                var fullPath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = Path.Combine("/", _fileUploadSettings.UploadPath, fileName).Replace("\\", "/");

                return Ok(new FileUploadResponse
                {
                    Success = true,
                    Message = "File uploaded successfully",
                    FileName = fileName
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new FileUploadResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
