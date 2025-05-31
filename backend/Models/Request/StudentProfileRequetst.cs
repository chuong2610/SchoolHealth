namespace backend.Models.Request
{
    public class StudentProfileRequest
    {
        public int Id { get; set; }

        public string? Allergys { get; set; }
        public string? ChronicIllnesss { get; set; }
        public string? LongTermMedications { get; set; }
        public string? OtherMedicalConditions { get; set; }
    }
}
