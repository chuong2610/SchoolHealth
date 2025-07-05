using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string? Name { get; set; }  // e.g., "Medical Event Notification", "Vaccination Reminder"
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., "MedicalEvent", "Vaccination"
        public string Message { get; set; } = string.Empty;
        public string? Note { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string ClassName { get; set; } = string.Empty;
        public string? CheckListJson { get; set; } = string.Empty; // JSON string for checklist items
        public List<NotificationStudent> NotificationStudents { get; set; } = new List<NotificationStudent>();

        // Người tạo (Admin)
        public int CreatedById { get; set; }
        [ForeignKey("CreatedById")]
        public User CreatedBy { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        // Người thực hiện (Nurse)
        public int AssignedToId { get; set; }
        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }

        [NotMapped]
        public List<string>? CheckList
        {
            get => string.IsNullOrWhiteSpace(CheckListJson)
                ? null
                : JsonSerializer.Deserialize<List<string>>(CheckListJson);

            set => CheckListJson = value == null ? null : JsonSerializer.Serialize(value);
        }

    }
}