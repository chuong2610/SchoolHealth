namespace backend.Models.DTO
{
    public class HomeNurseDTO
    {
        public int PendingMedicationsNumber { get; set; }
        public int ActiveMedicationsNumber { get; set; }
        public int CompletedMedicationsNumber { get; set; }
        public int NotificationsNumber { get; set; }
        public List<MedicationDTO> Medications { get; set; } = new List<MedicationDTO>();
        public List<NotificationNurseDTO> Notifications { get; set; } = new List<NotificationNurseDTO>();
        public List<MedicalEventDTO> MedicalEvents { get; set; } = new List<MedicalEventDTO>();
        public Dictionary<string, int> WeeklyMedicalEventCounts { get; set; } = new Dictionary<string, int>();
    }
}