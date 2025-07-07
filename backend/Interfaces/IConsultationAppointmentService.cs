
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Interfaces;

public interface IConsultationAppointmentService
{
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search);
    Task<PageResult<ConsultationAppointmentDTO>> GetConsultationAppointmentsByNurseIdAsync(int nurseId, int pageNumber, int pageSize, string? search);
    Task<PageResult<ConsultationAppointmentDetailDTO>> GetConsultationAppointmentsByParentIdAndPendingAsync(int parentId, int pageNumber, int pageSize, string? search);
    Task<bool> CreateConsultationAppointmentAsync(ConsultationAppointmentRequest request);
    Task<bool> UpdateConsultationAppointmentAsync(ConsultationAppointmentDetailRequest request);
}