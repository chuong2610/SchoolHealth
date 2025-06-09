namespace backend.Models
{
    public class BlogPostContent
    {
        public string Introduction { get; set; } = string.Empty;
        public List<string> Symptoms { get; set; } = new();
        public Prevention Prevention { get; set; } = new();
        public List<string> WhenToSeeDoctor { get; set; } = new();
    }

    public class Prevention
    {
        public string Vaccination { get; set; } = string.Empty;
        public List<string> PersonalHygiene { get; set; } = new();
        public List<string> ImmunityBoost { get; set; } = new();
    }

}