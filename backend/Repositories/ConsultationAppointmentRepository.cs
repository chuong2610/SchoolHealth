using Azure;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class ConsultationAppointmentRepository : IConsultationAppointmentRepository
{
    private readonly ApplicationDbContext _context;

    public ConsultationAppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
    {
        var query = _context.ConsultationAppointments
                    .Include(ca => ca.Student)
                    .Include(ca => ca.Nurse)
                    .Where(ca => ca.Student.ParentId == parentId) // lọc theo parentId
                    .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(ca =>
                ca.Reason.Contains(search) ||
                ca.Student.Name.Contains(search) ||
                ca.Nurse.Name.Contains(search));
        }

        if (searchDate.HasValue)
        {
            query = query.Where(ca => ca.Date.Date == searchDate.Value.Date);
        }
        return new PageResult<ConsultationAppointment>
        {
            Items = await query
                .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(),
            TotalItems = await query.CountAsync()
        };
        
    }
    public async Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
    {
        var query = _context.ConsultationAppointments
                    .Include(ca => ca.Student)
                    .Include(ca => ca.Nurse)
                    .Where(ca => ca.Nurse.Id == nurseId) // lọc theo nurseId
                    .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(ca =>
                ca.Reason.Contains(search) ||
                ca.Student.Name.Contains(search) ||
                ca.Nurse.Name.Contains(search));
        }

        if (searchDate.HasValue)
        {
            var southeastAsiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var searchDateInSEAsia = TimeZoneInfo.ConvertTimeFromUtc(searchDate.Value.ToUniversalTime(), southeastAsiaTimeZone).Date;

            query = query.Where(ca =>
                TimeZoneInfo.ConvertTimeFromUtc(ca.Date.ToUniversalTime(), southeastAsiaTimeZone).Date == searchDateInSEAsia);
        }

        return new PageResult<ConsultationAppointment>
        {
            Items = await query
                .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(),
            TotalItems = await query.CountAsync()
        };
    }
    public async Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
    {
        var query = _context.ConsultationAppointments
                    .Include(ca => ca.Student)
                    .Include(ca => ca.Nurse)
                    .Where(ca => ca.Student.ParentId == parentId && ca.Status == "Pending") // lọc theo parentId và trạng thái Pending
                    .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(ca =>
                ca.Reason.Contains(search) ||
                ca.Student.Name.Contains(search) ||
                ca.Nurse.Name.Contains(search));
        }

        if (searchDate.HasValue)
        {
            query = query.Where(ca => ca.Date.Date == searchDate.Value.Date);
        }

        return new PageResult<ConsultationAppointment>
        {
            Items = await query
                .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(),
            TotalItems = await query.CountAsync()
        };
    }
    public async Task<ConsultationAppointment?> GetConsultationAppointmentByIdAsync(int id)
    {
        return await _context.ConsultationAppointments
            
            .Include(ca => ca.Student)
            .Include(ca => ca.Nurse)
            .FirstOrDefaultAsync(ca => ca.Id == id);
    }
    public async Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment)
    {
        _context.ConsultationAppointments.Add(consultationAppointment);
        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment)
    {
        _context.ConsultationAppointments.Update(consultationAppointment);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsTodayByUserIdAsync(int UserId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
    {
        var query = _context.ConsultationAppointments
                    .Include(ca => ca.Student)
                    .Include(ca => ca.Nurse)
                    .Where(ca => ca.Nurse.Id == UserId || ca.Student.ParentId == UserId && ca.Date.Date == DateTime.UtcNow.Date) 
                    .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(ca =>
                ca.Reason.Contains(search) ||
                ca.Student.Name.Contains(search) ||
                ca.Nurse.Name.Contains(search));
        }

        return new PageResult<ConsultationAppointment>
        {
            Items = await query
                .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(),
            TotalItems = await query.CountAsync()
        };
    }

    public async Task<bool> HasConsultationAppointmentTodayAsync(int userId)
    {
        return await _context.ConsultationAppointments
            .AnyAsync(ca => (ca.Nurse.Id == userId || ca.Student.ParentId == userId) && ca.Status == "Pending");
    }
}