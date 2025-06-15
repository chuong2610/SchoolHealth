using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetAllUserAsync()
        {
            return await _context.Users.
                Include(u => u.Role)
                .ToListAsync();
        }


        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }

        public async Task<List<User>> GetAllNursesAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == "Nurse")
                .ToListAsync();
        }
    }
}