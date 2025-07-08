using Azure;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;
public class OtherCheckRepository : IOtherCheckRepository
{
    private readonly ApplicationDbContext _context;

    public OtherCheckRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OtherCheck>> GetAllOtherChecksAsync()
    {
        return await _context.OtherChecks.Include(oc => oc.CheckList).Include(oc => oc.Student).Include(oc => oc.Nurse).ToListAsync();
    }

    public async Task<OtherCheck?> GetOtherCheckByIdAsync(int id)
    {
        return await _context.OtherChecks.Include(oc => oc.CheckList).Include(oc => oc.Student).Include(oc => oc.Nurse).FirstOrDefaultAsync(oc => oc.Id == id);
    }

    public async Task<PageResult<OtherCheck>> GetOtherChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
    {
        var query = _context.OtherChecks.Include(oc => oc.Student).Include(oc => oc.Nurse).Include(oc => oc.CheckList).AsQueryable();

        if (search != null)
        {
            query = query.Where(oc => oc.Name.Contains(search) ||
                                      oc.Description.Contains(search) ||
                                      oc.Location.Contains(search) ||
                                      oc.Student.Name.Contains(search) ||
                                      oc.Nurse.Name.Contains(search));
        }

        if (searchDate.HasValue)
        {
            query = query.Where(oc => oc.Date.Date == searchDate.Value.Date);
        }

        var totalItems = await query.CountAsync();
        var items = await query.OrderByDescending(oc => oc.Date)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PageResult<OtherCheck>
        {
            Items = items,
            TotalItems = totalItems
        };
    }

    public async Task<bool> CreateOtherCheckAsync(OtherCheck otherCheck)
    {
        _context.OtherChecks.Add(otherCheck);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> SubmitResultAtHomeAsync(int otherCheckId)
    {
        var otherCheck = await GetOtherCheckByIdAsync(otherCheckId);
        if (otherCheck == null) return false;

        otherCheck.ResultAtHome = "Good";
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<OtherCheck>> GetOtherChecksByNotificationIdAsync(int notificationId)
    {
        return await _context.OtherChecks
            .Include(oc => oc.CheckList)
            .Include(oc => oc.Student)
            .Include(oc => oc.Nurse)
            .Where(oc => oc.NotificationId == notificationId)
            .ToListAsync();
    }
}