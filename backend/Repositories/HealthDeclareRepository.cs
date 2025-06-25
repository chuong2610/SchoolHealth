using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class HealthDeclareHistoryRepository : IHealthDeclareHistoryRepository
{
    private readonly ApplicationDbContext _context;
    public HealthDeclareHistoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<HealthDeclareHistory>> GetHistoryByParentIdAsync(
    int parentId, int pageNumber, int pageSize, string? search)
    {
        var query = _context.HealthDeclareHistories
            .Include(h => h.StudentProfile.Student)
            .Include(h => h.StudentProfile)
            .Include(h => h.Parent)
            .AsNoTracking()
            .Where(h => h.ParentId == parentId);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(h => h.StudentProfile.Student.Name.Contains(search));
        }

        return await query
            .OrderByDescending(h => h.DeclarationDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountByParentIdAsync(int parentId, string? search)
    {
        var query = _context.HealthDeclareHistories
            .Include(h => h.StudentProfile)
            .AsNoTracking()
            .Where(h => h.ParentId == parentId);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(h => h.StudentProfile.Student.Name.Contains(search));
        }

        return await query.CountAsync();
    }

    public async Task<HealthHistoryCountDTO> GetCountsByParentIdAsync(int parentId)
    {
        var totalHealthChecks = await _context.HealthChecks
            .CountAsync(h => h.Student.ParentId == parentId);

        var totalVaccinations = await _context.Vaccinations
            .CountAsync(v => v.Student.ParentId == parentId);

        var totalMedicationsSent = await _context.Medications
            .CountAsync(m => m.Student.ParentId == parentId);

        return new HealthHistoryCountDTO
        {
            TotalHealthChecks = totalHealthChecks,
            TotalVaccinations = totalVaccinations,
            TotalMedicationsSent = totalMedicationsSent
        };
    }
}