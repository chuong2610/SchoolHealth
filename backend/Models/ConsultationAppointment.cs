using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ConsultationAppointment
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public string? Reason { get; set; } = null;
    public int StudentId { get; set; }
    [ForeignKey("StudentId")]
    public Student Student { get; set; } = null!;
    public int NurseId { get; set; }
    [ForeignKey("NurseId")]
    public User Nurse { get; set; } = null!;

}