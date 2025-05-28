namespace backend.Models.DTO
{
    public class VaccinationDTO
    {
        public int Id { get; set; }
        public string VaccineName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateOnly date { get; set; }
        public string NurseName { get; set; } = null!;
        public string StudentName { get; set; } = null!;
    }
}