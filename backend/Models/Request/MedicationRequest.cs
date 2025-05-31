namespace backend.Models.Request
{
    public class MedicationRequest
    {
        // Thông tin học sinh
        public int Id { get; set; }

        // Thông tin thuốc
        public string MedicineName { get; set; } = string.Empty;   // Tên thuốc
        public string Dosage { get; set; } = string.Empty;     // Liều dùng
        public string Status { get; set; } = string.Empty;

        public int UserId { get; set; }

        public int StudentId { get; set; }
    }
}
