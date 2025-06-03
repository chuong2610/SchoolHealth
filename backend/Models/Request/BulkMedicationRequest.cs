namespace backend.Models.Request
{
    public class BulkMedicationRequest
    {
        public int StudentId { get; set; }
        public List<MedicationRequest> Medicines { get; set; }
    }
}