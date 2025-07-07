namespace backend.Models.DTO;
public class OtherCheckDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Location { get; set; } = string.Empty;
    public List<OtherCheckItemDTO> CheckList { get; set; } = new List<OtherCheckItemDTO>();
    public string Description { get; set; } = string.Empty;
    public string Conclusion { get; set; } = string.Empty;
    public string? ResultAtHome { get; set; } = string.Empty;
    public int NotificationId { get; set; }
    public string NurseName { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
}