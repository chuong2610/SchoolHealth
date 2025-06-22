namespace backend.Models.Request
{
    public class AssignNurseRequest
    {
        public int ParentId { get; set; }
        public int NurseId { get; set; }
    }
}