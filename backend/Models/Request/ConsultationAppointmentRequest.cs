namespace backend.Models.Request;

public class ConsultationAppointmentRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Location { get; set; } = string.Empty;
    public int NurseId { get; set; }
    public string StudentNumber { get; set; } = string.Empty;
    
}