namespace backend.Models.DTO
{
    public class HomeAdminDTO
    {
        public int NumberOfStudents { get; set; }
        public int NumberOfNurses { get; set; }
        public int NumberOfParents { get; set; }
        public int PendingMedicationsNumber { get; set; }
        public int ActiveMedicationsNumber { get; set; }
        public int CompletedMedicationsNumber { get; set; }
        public List<MedicalSupplyDTO> MedicalSupplies { get; set; } = new List<MedicalSupplyDTO>();
        public List<MedicationDTO> Medications { get; set; } = new List<MedicationDTO>();
        public List<MedicalEventDTO> MedicalEvents { get; set; } = new List<MedicalEventDTO>();
        public List<NotificationSummaryDTO> Notifications { get; set; } = new List<NotificationSummaryDTO>();
        public Dictionary<string, int> WeeklyMedicalEventCounts { get; set; } = new Dictionary<string, int>();
    }
}