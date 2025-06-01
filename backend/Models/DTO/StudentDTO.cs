namespace backend.Models.DTO
{
    public class StudentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
    }
}