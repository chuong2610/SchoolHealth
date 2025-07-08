using System.Globalization;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services;

public class ConsultationAppointmentService : IConsultationAppointmentService
{
    private readonly IConsultationAppointmentRepository _consultationAppointmentRepository;
    private readonly IStudentRepository _studentRepository;

    public ConsultationAppointmentService(IConsultationAppointmentRepository consultationAppointmentRepository, IStudentRepository studentRepository)
    {
        _consultationAppointmentRepository = consultationAppointmentRepository;
        _studentRepository = studentRepository;
    }

    public async Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
    {
        DateTime? searchDate = null;
        bool isDate = false;

        if (!string.IsNullOrEmpty(search) &&
            DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            searchDate = parsedDate;
            isDate = true;
        }
        var appointments = await _consultationAppointmentRepository.GetConsultationAppointmentsByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);

        var totalPages = (int)Math.Ceiling((double)appointments.TotalItems / pageSize);

        return new PageResult<ConsultationAppointmentDTO>
        {
            Items = appointments.Items.Select(a => MapToDTO(a)).ToList(),
            TotalPages = totalPages,
            CurrentPage = pageNumber,
            TotalItems = appointments.TotalItems
        };
    }
    public async Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search)
    {
        DateTime? searchDate = null;
        bool isDate = false;

        if (!string.IsNullOrEmpty(search) &&
            DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            searchDate = parsedDate;
            isDate = true;
        }
        var appointments = await _consultationAppointmentRepository.GetConsultationAppointmentsByNurseIdAsync(nurseId, pageNumber, pageSize, search, searchDate);
        var totalPages = (int)Math.Ceiling((double)appointments.TotalItems / pageSize);
        return new PageResult<ConsultationAppointmentDTO>
        {
            Items = appointments.Items.Select(a => MapToDTO(a)).ToList(),
            TotalPages = totalPages,
            CurrentPage = pageNumber,
            TotalItems = appointments.TotalItems
        };
    }
    public async Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId, int pageNumber, int pageSize, string? search)
    {
        DateTime? searchDate = null;
        bool isDate = false;

        if (!string.IsNullOrEmpty(search) &&
            DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            searchDate = parsedDate;
            isDate = true;
        }
        var appointments = await _consultationAppointmentRepository.GetConsultationAppointmentsByParentIdAndPendingAsync(parentId, pageNumber, pageSize, search, searchDate);
        var totalPages = (int)Math.Ceiling((double)appointments.TotalItems / pageSize);

        return new PageResult<ConsultationAppointmentDTO>
        {
            Items = appointments.Items.Select(a => MapToDTO(a)).ToList(),
            TotalPages = totalPages,
            CurrentPage = pageNumber,
            TotalItems = appointments.TotalItems
        };
    }
    public async Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointmentRequest request)
    {
        var student = await _studentRepository.GetStudentByStudentNumberAsync(request.StudentNumber);
        if (student == null)
        {
            throw new ArgumentException("Student not found");
        }
        var appointment = new ConsultationAppointment
        {
            StudentId = student.Id,
            Title = request.Title,
            NurseId = request.NurseId,
            Date = request.Date,
            Location = request.Location,
            Description = request.Description,
            Reason = null,
            Status = "Pending"
        };
        return await _consultationAppointmentRepository.CreateConsultationAppointmentAsync(appointment);
    }
    public async Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointmentDetailRequest request)
    {
        var appointment = await _consultationAppointmentRepository.GetConsultationAppointmentByIdAsync(request.ConsultationAppointmentId);
        if (appointment == null)
        {
            throw new ArgumentException("Consultation appointment not found");
        }

        appointment.Reason = request.Reason;
        appointment.Status = request.Status;

        return await _consultationAppointmentRepository.UpdateConsultationAppointmentAsync(appointment);
    }
    private ConsultationAppointmentDTO MapToDTO(ConsultationAppointment appointment)
    {
        return new ConsultationAppointmentDTO
        {
            ConsultationAppointmentId = appointment.Id,
            StudentName = appointment.Student.Name,
            Date = appointment.Date,
            Location = appointment.Location,
            Status = appointment.Status,
            NurseName = appointment.Nurse.Name,
        };
    }

    public async Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsTodayByUserIdAsync(int userId, int pageNumber, int pageSize, string? search)
    {
        DateTime? searchDate = null;
        bool isDate = false;

        if (!string.IsNullOrEmpty(search) &&
            DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            searchDate = parsedDate;
            isDate = true;
        }
        var consultationAppointments = await _consultationAppointmentRepository.GetConsultationAppointmentsTodayByUserIdAsync(userId, pageNumber, pageSize, search, searchDate);
        var totalPages = (int)Math.Ceiling((double)consultationAppointments.TotalItems / pageSize);

        return new PageResult<ConsultationAppointmentDTO>
        {
            Items = consultationAppointments.Items.Select(a => MapToDTO(a)).ToList(),
            TotalPages = totalPages,
            CurrentPage = pageNumber,
            TotalItems = consultationAppointments.TotalItems
        };
    }
    public async Task<ConsultationAppointmentDetailDTO?> GetConsultationAppointmentByIdAsync(int id)
    {
        var appointment = await _consultationAppointmentRepository.GetConsultationAppointmentByIdAsync(id);
        if (appointment == null)
        {
            return null;
        }

        return new ConsultationAppointmentDetailDTO
        {
            ConsultationAppointmentId = appointment.Id,
            StudentName = appointment.Student.Name,
            NurseName = appointment.Nurse.Name,
            Date = appointment.Date,
            Location = appointment.Location,
            Description = appointment.Description ?? string.Empty,
            Reason = appointment.Reason ?? string.Empty,
            Status = appointment.Status
        };
    }
    public async Task<bool> HasConsultationAppointmentTodayAsync(int userId)
    {
        return await _consultationAppointmentRepository.HasConsultationAppointmentTodayAsync(userId);
    }
}    