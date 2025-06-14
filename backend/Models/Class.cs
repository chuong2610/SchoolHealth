namespace backend.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = null!;
        public List<Student> Students { get; set; } = new List<Student>();
    }
}