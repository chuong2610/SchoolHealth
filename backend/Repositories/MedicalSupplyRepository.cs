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

        public Task<List<MedicalSupply>> GetAllMedicalSuppliesAsync()
        {
            return _context.MedicalSupplies.ToListAsync();
        }

        public async Task<MedicalSupply> AddMedicalSuppliesAsync(MedicalSupply medicalSupply)
        {
            _context.MedicalSupplies.Add(medicalSupply);
            await _context.SaveChangesAsync();
            return medicalSupply;
        }

        public async Task<MedicalSupply> GetMeidcalSuppliesByIdAsync(int id)
        {
            return await _context.MedicalSupplies.FindAsync(id);
        }

        public async Task<MedicalSupply> UpdateMedicalSuppliesAsync(MedicalSupply medicalSupply)
        {
            _context.MedicalSupplies.Update(medicalSupply);
            await _context.SaveChangesAsync();
            return medicalSupply;
        }

        public async Task DeleteMedicalSuppliesAsync(MedicalSupply medicalSupply)
        {
            _context.MedicalSupplies.Remove(medicalSupply);
            await _context.SaveChangesAsync();
        }
    }
}