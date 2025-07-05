using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace  backend.Models
{
    public class OtherCheckItem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int OtherCheckId { get; set; }
        [ForeignKey("OtherCheckId")]
        public OtherCheck OtherCheck { get; set; } = null!;
    }
}