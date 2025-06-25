namespace backend.Models.DTO
{
    public class MedicalEventCountDTO
    {
        public int TotalCount { get; set; }
        public int Last7DaysCount { get; set; }
        public int TodayCount { get; set; }
    }
}