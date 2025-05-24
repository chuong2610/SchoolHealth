namespace backend.Models
{
    public class Parent : User
    {
        public List<Student> Students { get; set; } = new List<Student>();
    }
}