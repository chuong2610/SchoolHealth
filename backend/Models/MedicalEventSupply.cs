namespace backend.Models
{
    public class MedicalEventSupply
    {
        public int MedicalEventId { get; set; }
        public MedicalEvent MedicalEvent { get; set; } = null!;
        public int MedicalSupplyId { get; set; }
        public MedicalSupply MedicalSupply { get; set; } = null!;
        public int Quantity { get; set; }
    }    
}