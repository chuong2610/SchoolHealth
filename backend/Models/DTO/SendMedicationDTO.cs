namespace backend.Models.DTO
{
    public class SendMedicationDTO
    {
        // Thông tin học sinh
        public string StudentName { get; set; } = string.Empty; // Họ và tên học sinh
        public string ClassName { get; set; } = string.Empty; // Lớp

        // Thông tin thuốc
        public string MedicineName { get; set; } = string.Empty;   // Tên thuốc
        public int Quantity { get; set; }            // Số lượng
        public string Dosage { get; set; } = string.Empty;     // Liều dùng
        public string UsageTime { get; set; } = string.Empty;    // Thời gian uống
        public string Notes { get; set; } = string.Empty;     // Ghi chú (hướng dẫn sử dụng...)

        // Thông tin người gửi
        public string SenderFullName { get; set; } = string.Empty; // Họ và tên người gửi
        public string SenderPhone { get; set; } = string.Empty;  // Số điện thoại người gửi
        public string AdditionalInfo { get; set; } = string.Empty; // Ghi chú thêm
    }
}
