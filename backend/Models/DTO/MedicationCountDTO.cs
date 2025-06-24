namespace backend.Models.DTO
{
    public class MedicationCountDTO
    {
        public int PendingMedication { get; set; }
        public int ActiveMedication { get; set; }
        public int CompletedMedication { get; set; }
        public int MedicationInToday { get; set; }
    }

}