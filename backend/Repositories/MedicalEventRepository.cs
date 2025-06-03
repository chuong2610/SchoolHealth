using backend.Data;
using backend.Interfaces;
using backend.Models;

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


    }
}