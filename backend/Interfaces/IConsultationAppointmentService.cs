
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces;

public interface IConsultationAppointmentService
{
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search);
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId, int pageNumber, int pageSize, string? search);
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsTodayByUserIdAsync(int userId, int pageNumber, int pageSize, string? search);
    Task<ConsultationAppointmentDetailDTO?> GetConsultationAppointmentByIdAsync(int id);
    Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointmentRequest request);
    Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointmentDetailRequest request);
    Task<bool> HasConsultationAppointmentTodayAsync(int userId);
}