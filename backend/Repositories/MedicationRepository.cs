using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class MedicationRepository : IMedicationRepsitory
    {
        private readonly ApplicationDbContext _context;

        public MedicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Medication?> GetMedicationByIdAsync(int id)
        {
            return _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Medication>> GetMedicationsByNurseIdAsync(int id)
        {
            return await _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Where(m => m.Nurse.Id == id)
                .ToListAsync();
        }

        public async Task<List<Medication>> GetMedicationsPendingAsync()
        {
            return await _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Where(m => m.Status == "Pending")
                .ToListAsync();
        }

        public async Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId)
        {
            var medication = await _context.Medications.FindAsync(medicationId);
            if (medication == null) return false;

            medication.UserId = nurseId;
            medication.Status = "Active";
            _context.Medications.Update(medication);
            return await _context.SaveChangesAsync() > 0;
        }    
    }
}