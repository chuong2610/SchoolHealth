using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class MedicalEventRepository : IMedicalEventRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicalEventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalEvent> CreateMedicalEventAsync(MedicalEvent medicalEvent)
        {
            _context.MedicalEvents.Add(medicalEvent);
            await _context.SaveChangesAsync();
            Console.WriteLine("Created MedicalEvent Id: " + medicalEvent.Id);
            return medicalEvent;
        }

        public async Task<MedicalEvent?> GetMedicalEventByIdAsync(int id)
        {
            return await _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Include(me => me.MedicalEventSupplys)
                .ThenInclude(mes => mes.MedicalSupply)
                .FirstOrDefaultAsync(me => me.Id == id);
        }

        public async Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize)
        {
            return await _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Include(me => me.MedicalEventSupplys)
                    .ThenInclude(mes => mes.MedicalSupply)
                .OrderBy(me => me.Id) // Sắp xếp để phân trang ổn định
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountMedicalEventsAsync()
        {
            return await _context.MedicalEvents.CountAsync();
        }

        public async Task<List<MedicalEvent>> GetMedicalEventsTodayAsync()
        {
            var today = DateTime.Today;
            return await _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Include(me => me.MedicalEventSupplys)
                .ThenInclude(mes => mes.MedicalSupply)
                .Where(me => me.Date.Date == today)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetWeeklyMedicalEventCountsAsync()
        {
            var today = DateTime.Today;
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var startOfWeek = today.AddDays(-diff);
            var endOfWeek = startOfWeek.AddDays(6);

            var eventsThisWeek = await _context.MedicalEvents
                .Where(e => e.Date.Date >= startOfWeek && e.Date.Date <= endOfWeek)
                .ToListAsync();

            var result = new Dictionary<string, int>
            {
                { "Monday", 0 },
                { "Tuesday", 0 },
                { "Wednesday", 0 },
                { "Thursday", 0 },
                { "Friday", 0 },
                { "Saturday", 0 },
                { "Sunday", 0 }
            };

            foreach (var ev in eventsThisWeek)
            {
                string dayName = ev.Date.DayOfWeek.ToString(); // Ví dụ: "Monday"
                if (result.ContainsKey(dayName))
                {
                    result[dayName]++;
                }
            }

            return result;
        }
    }
}