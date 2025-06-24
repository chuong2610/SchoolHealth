namespace backend.Models.DTO
{
    public class MedicalSuppliesCountDTO
    {
        public int TotalMedications { get; set; }
        public int InStock { get; set; }
        public int LowStock { get; set; }
        public int OutOfStock { get; set; }
    }
}