namespace backend.Models.DTO
{
    public class NotificationDetailAdminDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Type { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string ClassName { get; set; } = string.Empty;
        public List<string>? CheckList { get; set; }
        public string NurseName { get; set; } = string.Empty;
        public int NurseId { get; set; }
        public List<object> Results { get; set; } = new();

    }
}
