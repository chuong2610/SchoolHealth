namespace backend.Models.DTO
{

    public class HealthDeclarationDTO
    {
        // Thông tin học sinh
        public string StudentName { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string Class { get; set; } = string.Empty;

        // Thông tin sức khỏe
        public string Allergies { get; set; } = string.Empty;
        public string ExistingDiseases { get; set; } = string.Empty;
        public string TreatmentHistory { get; set; } = string.Empty;
        public string Vision { get; set; } = string.Empty;
        public string Hearing { get; set; } = string.Empty;
        public string VaccinationHistory { get; set; } = string.Empty;

        // Thông tin liên hệ khẩn cấp
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;

        // Ghi chú thêm
        public string AdditionalNotes { get; set; } = string.Empty;
    }
}
