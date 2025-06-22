using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class MedicalSupplyRepository : IMedicalSupplyRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicalSupplyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<bool> UpdateMedicalSupplyQuantityAsync(int supplyId, int quantity)
        {
            var supply = _context.MedicalSupplies.FirstOrDefault(s => s.Id == supplyId);
            if (supply == null)
            {
                return Task.FromResult(false);
            }
            if (supply.Quantity + quantity < 0)
            {
                return Task.FromResult(false); // Prevent negative quantity
            }

            supply.Quantity += quantity;
            _context.MedicalSupplies.Update(supply);
            return _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }

        public Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync(int pageNumber, int pageSize)
        {
            return _context.MedicalSupplies
                .AsNoTracking()
                .Where(ms => ms.IsActive)
                .OrderBy(ms => ms.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<int> CountAllMedicalSuppliesAsync()
        {
            return _context.MedicalSupplies
                .Where(ms => ms.IsActive)
                .CountAsync();
        }

        public async Task<bool> AddMedicalSuppliesAsync(MedicalSupply supply)
        {
            _context.MedicalSupplies.Add(supply);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<MedicalSupply> GetMeidcalSuppliesByIdAsync(int id)
        {
            return await _context.MedicalSupplies.FindAsync(id);
        }

        public async Task<bool> UpdateMedicalSuppliesAsync(MedicalSupply medicalSupply)
        {
            _context.MedicalSupplies.Update(medicalSupply);
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }

        public async Task<bool> DeleteMedicalSuppliesAsync(MedicalSupply medicalSupply)
        {
            medicalSupply.IsActive = false;
            _context.MedicalSupplies.Update(medicalSupply);
            var deleted = await _context.SaveChangesAsync();
            return deleted > 0;
        }
    }
}