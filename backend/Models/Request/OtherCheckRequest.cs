using backend.Models.DTO;

namespace backend.Models.Request;
public class OtherCheckRequest
{
    public string Name { get; set; }
    public List<OtherCheckItemDTO> CheckList { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public string Conclusion { get; set; }
    public bool ResultAtHome { get; set; }
    public int NurseId { get; set; }
    public int StudentId { get; set; }
}