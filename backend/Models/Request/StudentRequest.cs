namespace backend.Models.Request
{
    public class StudentRequest
    {
        public string Name { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public int? ClassId { get; set; }
        public int? ParentId { get; set; }
    }
}