namespace backend.Models.Request
{
    public class GoogleAuthRequest
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
    }
}
