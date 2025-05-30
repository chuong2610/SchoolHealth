using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;
using backend.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class StudentProfileService : IStudentProfileService
    {
        private readonly IStudentProfileRepository _repository;

        public StudentProfileService(IStudentProfileRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<StudentProfile> CreateStudentProfileAsync(StudentProfileRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            return await _repository.CreateAsync(request);
        }

        public async Task<StudentProfile?> GetStudentProfileByIdAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Invalid student profile ID.", nameof(id));
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<StudentProfile>> GetStudentProfilesByStudentIdAsync(int studentId)
        {
            if (studentId <= 0) throw new ArgumentException("Invalid student ID.", nameof(studentId));
            return await _repository.GetAllByStudentIdAsync(studentId);
        }
    }
}