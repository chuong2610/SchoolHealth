using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Class
    {
        [Key]
        public int Id { get; set; }
        public string ClassName { get; set; } = null!;
        public List<Student> Students { get; set; } = new List<Student>();
    }
}