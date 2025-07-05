using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;
public class OtherCheck
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<OtherCheckItem> CheckList { get; set; } = new List<OtherCheckItem>();
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Conclusion { get; set; } = string.Empty;
    public string? ResultAtHome { get; set; } = string.Empty;
    public int NotificationId { get; set; }
    public int NurseId { get; set; }
    [ForeignKey("NurseId")]
    public User Nurse { get; set; } = null!;
    public int StudentId { get; set; }
    [ForeignKey("StudentId")]
    public Student Student { get; set; } = null!;

}