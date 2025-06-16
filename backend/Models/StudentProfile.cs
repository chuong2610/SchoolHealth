using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class StudentProfile
    {
        [Key, ForeignKey("Student")]
        public int Id { get; set; }
        public string Allergys { get; set; } = string.Empty;  // dị ứng
        public string ChronicIllnesss { get; set; } = string.Empty; // bệnh
        public string LongTermMedications { get; set; } = string.Empty; // thuốc dài hạn
        public string OtherMedicalConditions { get; set; } = string.Empty; // điều kiện y tế khác
        [JsonIgnore]
        public Student Student { get; set; } = null!;
    }
}