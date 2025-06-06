using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Medication
    {
        [Key]
        public int Id { get; set; }
<<<<<<< HEAD
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
<<<<<<< HEAD
        public string Note { get; set; } = string.Empty;
=======
>>>>>>> LoginHistory
        public int UserId { get; set; }
=======
        // public string Name { get; set; } = string.Empty;
        // public string Dosage { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;   // Chờ xác nhận, Đang sử dụng
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime? ReviceDate { get; set; } = DateTime.UtcNow;
        public List<MedicationDeclare> MedicationDeclares { get; set; } = new List<MedicationDeclare>();
        public int? UserId { get; set; }
>>>>>>> fea9e5d19c44c6d4cfc5eed50a39400d2fb8269a
        [ForeignKey("UserId")]
        public User Nurse { get; set; } = null!;
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; } =  null!;
    }    
}