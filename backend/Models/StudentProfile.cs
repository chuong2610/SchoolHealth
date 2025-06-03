using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class StudentProfile
    {
        [Key]
        public int Id { get; set; }
        public string Allergys { get; set; } = string.Empty;  // dị ứng
        public string ChronicIllnesss { get; set; } = string.Empty; // bệnh
        public string LongTermMedications { get; set; } = string.Empty; // thuốc dài hạn
        public string OtherMedicalConditions { get; set; } = string.Empty; // điều kiện y tế khác
        public Student Student { get; set; }= null!;
        
    }    
}