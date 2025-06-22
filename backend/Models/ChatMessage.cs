using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }
        public int FromUserId { get; set; }
        [ForeignKey("FromUserId")]
        public User FromUser { get; set; } = null!; // Assuming User is another model representing the user
        public int? ToUserId { get; set; }
        [ForeignKey("ToUserId")]
        public User? ToUser { get; set; } = null!;
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; } = false;
    }
}