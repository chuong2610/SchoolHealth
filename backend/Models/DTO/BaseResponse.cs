namespace backend.Models.DTO
{
    public class BaseResponse<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; }
        public bool Success { get; set; }
        public BaseResponse() { }
        public BaseResponse(T? data = default, string? message = null, bool success = true)
        {
            Data = data;
            Message = message;
            Success = success;
        }
    }
}