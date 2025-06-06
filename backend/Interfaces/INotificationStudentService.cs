using backend.Models;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface INotificationStudentService
    {
        Task<bool> createNotificationStudentAsync(NotificationStudentRequest request);
    }
}