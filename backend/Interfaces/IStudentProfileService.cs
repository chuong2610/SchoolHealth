using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IStudentProfileService
    {
        /// <summary>
        /// Tạo mới một phiếu khai báo y tế cho học sinh.
        /// </summary>
        Task<StudentProfile> CreateStudentProfileAsync(StudentProfileRequest request);

        /// <summary>
        /// Lấy thông tin phiếu khai báo y tế theo ID.
        /// </summary>
        Task<StudentProfile?> GetStudentProfileByIdAsync(int id);

        /// <summary>
        /// Lấy danh sách phiếu khai báo y tế của một học sinh.
        /// </summary>
        Task<IEnumerable<StudentProfile>> GetStudentProfilesByStudentIdAsync(int studentId);
    }
}