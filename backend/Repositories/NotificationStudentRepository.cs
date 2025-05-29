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

        public async Task<bool> createNotificationStudentAsync(NotificationStudent notificationStudent)
        {
            _context.NotificationStudents.Add(notificationStudent);
            return await _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
    }
}