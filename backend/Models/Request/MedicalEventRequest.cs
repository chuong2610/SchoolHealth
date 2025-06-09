using backend.Models.DTO;

namespace backend.Models.Request
{
    public class MedicalEventRequest
    {
        public string EventType { get; set; } = string.Empty; // "health_check" or "vaccination"
        public string Location { get; set; } = string.Empty; // Địa điểm diễn ra sự kiện
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow; // Ngày diễn ra sự kiện
        public List<MedicationEventSupplyDTO> MedicalEventSupplys { get; set; } = new List<MedicationEventSupplyDTO>();
        public string StudentNumber { get; set; } = string.Empty; // Số hiệu của học sinh liên quan đến sự kiện y tế
        public int NurseId { get; set; } // ID của người dùng (y tá) thực hiện sự kiện y tế

    }
}