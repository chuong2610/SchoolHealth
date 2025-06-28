namespace backend.Models.DTO
{
    public class StudentsDTO
    {
        public int Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
    }
}