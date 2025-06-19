

using System.ComponentModel.DataAnnotations;

namespace backend.Models.Request
{
    public class MedicationRequest
    {
        public int StudentId { get; set; }
        public List<MedicationDeclareRequest> Medicines { get; set; }
    }
}