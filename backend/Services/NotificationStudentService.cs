using backend.Interfaces;
using backend.Models;
using backend.Models.Request;

namespace backend.Services
{
    public class NotificationStudentService : INotificationStudentService
    {
        private readonly INotificationStudentRepository _notificationStudentRepository;

        public NotificationStudentService(INotificationStudentRepository notificationStudentRepository)
        {
            _notificationStudentRepository = notificationStudentRepository;
        }

        public async Task<bool> createNotificationStudentAsync(NotificationStudentRequest request)
        {
            var notificationStudent = new NotificationStudent
            {
                NotificationId = request.NotificationId,
                StudentId = request.StudentId,
                Status = request.Status,
                Reason = request.Reason
            };

            return await _notificationStudentRepository.createNotificationStudentAsync(notificationStudent);
        }

        public async Task<bool> UpdateNotificationStudentAsync(NotificationStudentRequest request)
        {
            var notificationStudent = new NotificationStudent
            {
                NotificationId = request.NotificationId,
                StudentId = request.StudentId,
                Status = request.Status,
                Reason = request.Reason
            };

            return await _notificationStudentRepository.UpdateNotificationStudentAsync(notificationStudent);
        }

        

    }
}