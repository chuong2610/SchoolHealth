namespace backend.Models.DTO
{
    public class StudentProfileDTO
    {
        // Thông tin học sinh
        public string StudentName { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string Allergys { get; set; } = string.Empty;
        public string ChronicIllnesss { get; set; } = string.Empty;
        public string LongTermMedications { get; set; } = string.Empty;
        public string OtherMedicalConditions { get; set; } = string.Empty;
        public DateTime LastChangeDate { get; set; } = DateTime.UtcNow;

    }
}
