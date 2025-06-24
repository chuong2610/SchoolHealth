namespace backend.Models.DTO
{
    public class HealthDeclareHistoryDTO
    {
        public int Id { get; set; }
        public DateTime DeclarationDate { get; set; }
        public int StudentId { get; set; }
        public string Allergys { get; set; } = string.Empty;
        public string ChronicIllnesss { get; set; } = string.Empty;
        public string LongTermMedications { get; set; } = string.Empty;
        public string OtherMedicalConditions { get; set; } = string.Empty;
    }
}