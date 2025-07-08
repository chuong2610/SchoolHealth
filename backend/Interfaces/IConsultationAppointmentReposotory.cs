using backend.Models;

namespace backend.Interfaces;

public interface IConsultationAppointmentRepository
{
    Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<PageResult<ConsultationAppointment>> GetConsultationAppointmentsTodayByUserIdAsync(int userId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<ConsultationAppointment?> GetConsultationAppointmentByIdAsync(int id);
    Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment);
    Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment);
    Task<bool> HasConsultationAppointmentTodayAsync(int userId);
}