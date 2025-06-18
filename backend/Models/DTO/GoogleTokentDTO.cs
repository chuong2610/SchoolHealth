namespace backend.Models.DTO
{
    public class GoogleTokenDTO
    {
         public string AccessToken { get; set; }
        public string IdToken { get; set; }
        public string TokenType { get; set; }
        public int ExpiresIn { get; set; }
    }
}