using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repositories
{
    public class MedicalEventSupplyRepository : IMedicalEventSupplyRepository
    {
        private readonly ApplicationDbContext _context;
        public MedicalEventSupplyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<bool> CreateMedicalEventSupplyAsync(int medicalEventId, int medicalSupplyId, int quantity)
        {
            var medicalEventSupply = new MedicalEventSupply
            {
                MedicalEventId = medicalEventId,
                MedicalSupplyId = medicalSupplyId,
                Quantity = quantity
            };

            _context.MedicalEventSupplies.Add(medicalEventSupply);
            return _context.SaveChangesAsync().ContinueWith(task => task.Result > 0);
        }
    }
}