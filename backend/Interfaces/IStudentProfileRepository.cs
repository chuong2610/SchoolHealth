using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IStudentProfileRepository
    {
        /// <summary>
        /// Tạo mới một phiếu khai báo y tế cho học sinh.
        /// </summary>
        Task<StudentProfile> CreateAsync(StudentProfileRequest request);

        /// <summary>
        /// Lấy thông tin phiếu khai báo y tế theo ID.
        /// </summary>
        Task<StudentProfile?> GetByIdAsync(int id);

        /// <summary>
        /// Lấy danh sách phiếu khai báo y tế của một học sinh.
        /// </summary>
        Task<IEnumerable<StudentProfile>> GetAllByStudentIdAsync(int studentId);
    }
}