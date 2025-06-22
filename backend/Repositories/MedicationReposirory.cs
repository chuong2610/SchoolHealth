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

        public async Task<bool> AddAsync(Medication medication)
        {
            await _context.Medications.AddAsync(medication);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<Medication> GetByIdAsync(int id)
        {
            return await _context.Medications.FindAsync(id);
        }

        public async Task<IEnumerable<Medication>> GetAllAsync()
        {
            return await _context.Medications.ToListAsync();
        }

        public Task<Medication?> GetMedicationByIdAsync(int id)
        {
            return _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Class)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Medication>> GetMedicationsActiveByNurseIdAsync(int id, int pageNumber, int pageSize, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Nurse.Id == id && m.Status == "Active");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search))
                );
            }

            return await query
                .OrderByDescending(m => m.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountMedicationsActiveByNurseIdAsync(int id, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Nurse.Id == id && m.Status == "Active");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query.CountAsync();
        }

        public async Task<List<Medication>> GetMedicationsCompletedByNurseIdAsync(int id, int pageNumber, int pageSize, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student).ThenInclude(s => s.Parent)
                .Include(m => m.Student).ThenInclude(s => s.Class)
                .Where(m => m.Nurse.Id == id && m.Status == "Completed");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query
                .OrderBy(m => m.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountMedicationsCompletedByNurseIdAsync(int id, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student).ThenInclude(s => s.Parent)
                .Include(m => m.Student).ThenInclude(s => s.Class)
                .Where(m => m.Nurse.Id == id && m.Status == "Completed");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query.CountAsync();
        }

        public async Task<List<Medication>> GetMedicationsPendingAsync(int pageNumber, int pageSize, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Status == "Pending");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query
                .OrderByDescending(m => m.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountPendingMedicationsAsync(string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Status == "Pending");

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query.CountAsync();
        }



        public async Task<bool> UpdateNurseIdAsync(int medicationId, int nurseId)
        {
            var medication = await _context.Medications.FindAsync(medicationId);
            if (medication == null) return false;

            medication.UserId = nurseId;
            if (medication.Status == "Pending")
                medication.Status = "Active";
            else if (medication.Status == "Active")
                medication.Status = "Completed";
            medication.ReviceDate = DateTime.Now;
            _context.Medications.Update(medication);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Medication>> GetMedicationsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query
                .OrderByDescending(m => m.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountMedicationsByParentIdAsync(int parentId, string? search = null)
        {
            var query = _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student.Parent)
                .Include(m => m.Student.Class)
                .Where(m => m.Student.ParentId == parentId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.Student.Name.Contains(search) ||
                    m.Student.Class.ClassName.Contains(search) ||
                    m.Student.Parent.Name.Contains(search) ||
                    m.MedicationDeclares.Any(d =>
                        d.Name.Contains(search) ||
                        d.Dosage.Contains(search) ||
                        d.Note.Contains(search))
                );
            }

            return await query.CountAsync();
        }


        public Task<List<Medication>> GetMedicationsActiveAsync()
        {
            return _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Class)
                .Where(m => m.Status == "Active")
                .ToListAsync();
        }

        public Task<List<Medication>> GetMedicationsCompletedAsync()
        {
            return _context.Medications
                .Include(m => m.Nurse)
                .Include(m => m.MedicationDeclares)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Parent)
                .Include(m => m.Student)
                    .ThenInclude(s => s.Class)
                .Where(m => m.Status == "Completed")
                .ToListAsync();
        }
    }
}
