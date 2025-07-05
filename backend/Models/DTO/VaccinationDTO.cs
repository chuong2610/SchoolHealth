namespace backend.Models.DTO
{
    public class VaccinationDTO
    {
        public int Id { get; set; }
        public string VaccineName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateOnly Date { get; set; }
        public string Conclusion { get; set; } = null!;
        public string ResultAtHome { get; set; } = null!;
        public string NurseName { get; set; } = null!;
        public string StudentName { get; set; } = null!;
        public string StudentNumber { get; set; } = string.Empty;
    }
}