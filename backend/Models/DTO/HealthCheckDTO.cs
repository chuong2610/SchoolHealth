namespace backend.Models.DTO
{
    public class HealthCheckDTO
    {
        public int Id { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal Bmi { get; set; }
        public string Conclusion { get; set; } = string.Empty;
        public string NurseName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        
    }
}