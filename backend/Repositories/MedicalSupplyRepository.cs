using backend.Data;
using backend.Interfaces;
using backend.Models;

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
            if ( supply.Quantity + quantity < 0)
            {
                return Task.FromResult(false); // Prevent negative quantity
            }

            supply.Quantity += quantity;
            _context.MedicalSupplies.Update(supply);
            return _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
    }
}