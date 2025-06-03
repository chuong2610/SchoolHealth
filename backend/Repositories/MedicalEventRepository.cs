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
        
        public async Task<List<MedicalEvent>> GetAllMedicalEventsAsync()
        {
            return await _context.MedicalEvents
                .Include(me => me.Student)
                .Include(me => me.Nurse)
                .Include(me => me.MedicalEventSupplys)
                .ThenInclude(mes => mes.MedicalSupply)
                .ToListAsync();
        }
    }
}