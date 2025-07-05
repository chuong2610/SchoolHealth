namespace backend.Models.Request;

public class ConsultationAppointmentDetailRequest
{
    public int ConsultationAppointmentId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
}