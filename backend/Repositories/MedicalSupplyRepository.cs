using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
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

        public async Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync(int? pageNumber, int? pageSize, string? search)
        {
            if (pageNumber == null && pageSize == null)
            {
                return await _context.MedicalSupplies.Where(ms => ms.IsActive == true).AsNoTracking().ToListAsync();
            }
            var query = _context.MedicalSupplies
                .AsNoTracking()
                .Where(ms => ms.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ms => ms.Name.Contains(search) ||
                                          ms.Quantity.ToString().Contains(search));
            }

            return await query
                .OrderBy(ms => ms.Id)
                .Skip((pageNumber.Value - 1) * pageSize.Value)
                .Take(pageSize.Value)
                .ToListAsync();
        }

        public Task<int> CountAllMedicalSuppliesAsync(string? search)
        {
            var query = _context.MedicalSupplies
                .Where(ms => ms.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ms => ms.Name.Contains(search) ||
                                          ms.Quantity.ToString().Contains(search));
            }

            return query.CountAsync();
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

        public async Task<MedicalSuppliesCountDTO> GetMedicalSuppliesCountsAsync()
        {
            var total = await _context.MedicalSupplies.CountAsync();

            var inStock = await _context.MedicalSupplies.CountAsync(m => m.Quantity > 5);
            var lowStock = await _context.MedicalSupplies.CountAsync(m => m.Quantity <= 5 && m.Quantity > 0);
            var outOfStock = await _context.MedicalSupplies.CountAsync(m => m.Quantity == 0);

            return new MedicalSuppliesCountDTO
            {
                TotalMedications = total,
                InStock = inStock,
                LowStock = lowStock,
                OutOfStock = outOfStock
            };
        }
    }

    public class MedicationSuppliesCountDTO
    {
    }
}