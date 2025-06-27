namespace backend.Models.Request
{
    public class StudentCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public int ClassId { get; set; }
        public string ParentName { get; set; } = string.Empty;
        public string ParentPhone { get; set; } = string.Empty;
        public string ParentEmail { get; set; } = string.Empty;
        public string ParentAddress { get; set; } = string.Empty;
        public string ParentGender { get; set; } = string.Empty;
    }
}