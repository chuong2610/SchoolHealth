namespace backend.Models
{
    public class HealthHistoryCountDTO
    {
        public int TotalHealthChecks { get; set; }
        public int TotalVaccinations { get; set; }
        public int TotalMedicationsSent { get; set; }
    }
}