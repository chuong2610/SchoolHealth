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
                .Where(u => u.IsActive)
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task<bool> CreateUserAsync(User user)
        {
            try
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                // Log the exception or handle it as needed
                return false;
            }
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> GetParentByStudentIdAsync(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student?.ParentId == null) return null;
            return await _context.Users.FindAsync(student.ParentId);
        }

        public async Task<User?> GetUserByPhoneAsync(string phone)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Phone == phone && u.IsActive);
        }
        public async Task<bool> UpdateUserAsync(User user)
        {
            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return false;
                }
                user.IsActive = false;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<List<User>> GetAllUsersAsync(int pageNumber, int pageSize, string? search, DateOnly? searchDate)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Where(u => u.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(u =>
                    u.Name.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Phone.Contains(search) ||
                    u.Gender.ToLower() == searchLower ||
                    u.Address.Contains(search));
            }

            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }

            var items = await query
                .OrderBy(u => u.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return items;
        }
        public async Task<int> CountUsersAsync(string? search, DateOnly? searchDate)
        {
            var query = _context.Users
                .Where(u => u.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(u =>
                    u.Name.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Phone.Contains(search) ||
                    u.Gender.ToLower() == searchLower ||
                    u.Address.Contains(search));
            }

            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }

            return await query.CountAsync();
        }

        public async Task<List<User>> GetUsersByRoleAsync(string role, int pageNumber, int pageSize, string? search, DateOnly? searchDate)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == role && u.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(u =>
                    u.Name.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Phone.Contains(search) ||
                    u.Gender.ToLower() == searchLower ||
                    u.Address.Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }


            return await query
                .OrderBy(u => u.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountUsersByRoleAsync(string role, string? search, DateOnly? searchDate)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == role && u.IsActive);

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(u =>
                    u.Name.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Phone.Contains(search) ||
                    u.Gender.ToLower() == searchLower ||
                    u.Address.Contains(search));
            }
            if (searchDate.HasValue)
            {
                query = query.Where(s => s.DateOfBirth == searchDate.Value);
            }

            return await query.CountAsync();

        }

        public Task<int> GetNumberOfUsersAsync(string role)
        {
            return _context.Users
                .CountAsync(u => u.IsActive && u.Role.Name == role);
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