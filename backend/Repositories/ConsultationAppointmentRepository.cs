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

    public async Task<List<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
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
        return await query
            .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
    }
    public async Task<List<ConsultationAppointment>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search, DateTime? searchDate)
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
            query = query.Where(ca => ca.Date.Date == searchDate.Value.Date);
        }

        return await query
            .OrderByDescending(ca => ca.Date) // Sắp xếp theo thời gian giảm dần
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    public async Task<List<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId)
    {
        var query = _context.ConsultationAppointments
                    .Include(ca => ca.Student)
                    .Include(ca => ca.Nurse)
                    .Where(ca => ca.Student.ParentId == parentId && ca.Status == "Pending") // lọc theo parentId và trạng thái Pending
                    .AsQueryable();

        return await query.ToListAsync();
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

}