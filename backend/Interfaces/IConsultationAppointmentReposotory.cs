using backend.Models;

namespace backend.Interfaces;
public interface IConsultationAppointmentRepository
{
    Task<List<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<List<ConsultationAppointment>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search, DateTime? searchDate);
    Task<List<ConsultationAppointment>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId);
    Task<ConsultationAppointment?> GetConsultationAppointmentByIdAsync(int id);
    Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment);
    Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointment consultationAppointment);
}