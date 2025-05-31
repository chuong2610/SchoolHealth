namespace backend.Models.DTO
{
    public class StudentProfileDTO
    {
        // Thông tin học sinh
        public int Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string ClassName { get; set; } = string.Empty;

        // Thông tin sức khỏe
        public string Allergys { get; set; } = string.Empty;
        public string ChronicIllnesss { get; set; } = string.Empty;
        public string LongTermMedications { get; set; } = string.Empty;
        public string OtherMedicalConditions { get; set; } = string.Empty;
        public string Vision { get; set; } = string.Empty;
        public string Hearing { get; set; } = string.Empty;
        public string VaccinationHistory { get; set; } = string.Empty;

        // Thông tin liên hệ khẩn cấp
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;

        // Ghi chú thêm
        public string AdditionalNotes { get; set; } = string.Empty;
        public int StudentId { get; set; }

    }
}
