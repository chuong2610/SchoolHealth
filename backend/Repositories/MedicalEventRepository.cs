using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
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

        public async Task<List<MedicalEvent>> GetAllMedicalEventsAsync(int pageNumber, int pageSize, string? search, DateTime? searchDate)
        {
            var query = _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Include(me => me.MedicalEventSupplys)
                    .ThenInclude(mes => mes.MedicalSupply)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(me =>
                    me.EventType.Contains(search) ||
                    me.Location.Contains(search) ||
                    me.Student.Name.Contains(search) ||
                    me.Nurse.Name.Contains(search));
            }

            if (searchDate.HasValue)
            {
                query = query.Where(me => me.Date.Date == searchDate.Value.Date);
            }

            return await query
                .OrderByDescending(me => me.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountMedicalEventsAsync(string? search, DateTime? searchDate)
        {
            var query = _context.MedicalEvents.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(me =>
                    me.EventType.Contains(search) ||
                    me.Location.Contains(search) ||
                    me.Student.Name.Contains(search) ||
                    me.Nurse.Name.Contains(search));
            }

            if (searchDate.HasValue)
            {
                query = query.Where(me => me.Date.Date == searchDate.Value.Date);
            }

            return await query.CountAsync();
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

        public async Task<MedicalEventCountDTO> GetMedicalEventCountsAsync()
        {
            var today = DateTime.UtcNow.Date;
            var sevenDaysAgo = today.AddDays(-7);

            var total = await _context.MedicalEvents.CountAsync();
            var last7Days = await _context.MedicalEvents.CountAsync(m =>
                m.Date >= sevenDaysAgo && m.Date < today.AddDays(1));
            var todayCount = await _context.MedicalEvents.CountAsync(m =>
                m.Date >= today && m.Date < today.AddDays(1));

            return new MedicalEventCountDTO
            {
                TotalCount = total,
                Last7DaysCount = last7Days,
                TodayCount = todayCount
            };
        }
        public async Task<PageResult<MedicalEvent>> GetMedicalEventsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var studentIds = await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => s.Id)
                .ToListAsync();

            if (!studentIds.Any())
            {
                return new PageResult<MedicalEvent>
                {
                    Items = new List<MedicalEvent>(),
                    TotalItems = 0,
                    CurrentPage = pageNumber,
                    TotalPages = 0
                };
            }

            var query = _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Where(me => studentIds.Contains(me.StudentId))
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(me =>
                    me.EventType.Contains(search) ||
                    me.Location.Contains(search) ||
                    me.Student.Name.Contains(search) ||
                    me.Nurse.Name.Contains(search) ||
                    me.Date.ToString().Contains(search));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(me => me.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PageResult<MedicalEvent>
            {
                Items = items,
                TotalItems = totalItems,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
            };
        }
    }
}
