using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class MedicationRepository : IMedicationRepository
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

        public async Task<List<Medication>> GetMedicationsActiveByNurseIdAsync(int id)
        {
            return await _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Where(m => m.Nurse.Id == id && m.Status == "Active")
                .ToListAsync();
        }

        public async Task<List<Medication>> GetMedicationsCompletedByNurseIdAsync(int id)
        {
             var today = DateTime.Today;
            return await _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Where(m => m.Nurse.Id == id && m.Status == "Completed" && m.Date.Date==today)
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
            if(medication.Status == "Pending")
                medication.Status = "Active";
            else if (medication.Status == "Active")
                medication.Status = "Completed";
            medication.ReviceDate = DateTime.Now;
            _context.Medications.Update(medication);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Medication>> GetMedicationsByParentIdAsync(int parentId)
        {
            return await _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Where(m => m.Student.ParentId == parentId)
                .ToListAsync();
        }
    }
}