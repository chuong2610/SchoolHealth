using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories
{
    public class NotificationStudentRepository : INotificationStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationStudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateNotificationStudentAsync(NotificationStudent notificationStudent)
        {
            _context.NotificationStudents.Add(notificationStudent);
            return await _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
        public async Task<bool> UpdateNotificationStudentAsync(NotificationStudent notificationStudent)
        {
            _context.NotificationStudents.Update(notificationStudent);
            return await _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
    }
}