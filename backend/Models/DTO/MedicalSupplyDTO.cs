namespace backend.Models.DTO
{
    public class MedicalSupplyDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}