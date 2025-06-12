using backend.Models;
using backend.Models.Request;

namespace backend.Interfaces
{
    public interface INotificationStudentService
    {
        Task<bool> CreateNotificationStudentAsync(NotificationStudentRequest request);
        Task<bool> UpdateNotificationStudentAsync(NotificationStudentRequest request);
    }
}