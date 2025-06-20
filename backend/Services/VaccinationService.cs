using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class VaccinationService : IVaccinationService
    {
        private readonly IVaccinationRepository _vaccinationRepository;

        public VaccinationService(IVaccinationRepository vaccinationRepository)
        {
            _vaccinationRepository = vaccinationRepository;
        }

        public async Task<List<VaccinationDTO>> GetAllVaccinationsAsync()
        {
            var vaccinations = await _vaccinationRepository.GetAllVaccinationsAsync();
            return vaccinations.Select(v => MapToDTO(v)).ToList();
        }

        public async Task<PageResult<VaccinationDTO>> GetVaccinationsByParentIdAsync(int parentId, int pageNumber, int pageSize)
        {
            var totalCount = await _vaccinationRepository.CountVaccinationsByParentIdAsync(parentId);
            var vaccinations = await _vaccinationRepository
                .GetVaccinationsByParentIdAsync(parentId, pageNumber, pageSize);

            var dtos = vaccinations.Select(v => MapToDTO(v)).ToList();

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            return new PageResult<VaccinationDTO>
            {
                Items = dtos,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }


        public async Task<VaccinationDetailDTO?> GetVaccinationByIdAsync(int id)
        {
            var vaccination = await _vaccinationRepository.GetVaccinationByIdAsync(id);
            if (vaccination == null)
            {
                return null;
            }

            return new VaccinationDetailDTO
            {
                StudentName = vaccination.Student?.Name ?? string.Empty,
                VaccineName = vaccination.VaccineName,
                Result = vaccination.Result ?? string.Empty,
                Date = vaccination.Date,
                Location = vaccination.Location ?? string.Empty,
                Description = vaccination.Description ?? string.Empty,
                // Status = vaccination.Status ?? string.Empty,
                NurseName = vaccination.Nurse?.Name ?? string.Empty
            };
        }
        public async Task<PageResult<VaccinationDTO>> GetVaccinationByNotificationIdAsync(int notificationId, int pageNumber, int pageSize)
        {
            var totalItems = await _vaccinationRepository
                .CountVaccinationsByNotificationIdAsync(notificationId);

            var vaccinations = await _vaccinationRepository
                .GetVaccinationsByNotificationIdAsync(notificationId, pageNumber, pageSize);

            var vaccinationDTOs = vaccinations.Select(v => MapToDTO(v)).ToList();

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return new PageResult<VaccinationDTO>
            {
                Items = vaccinationDTOs,
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            };
        }
        public async Task<bool> CreateVaccinationAsync(Vaccination vaccination)
        {
            return await _vaccinationRepository.CreateVaccinationAsync(vaccination);
        }
        private VaccinationDTO MapToDTO(Vaccination vaccination)
        {
            return new VaccinationDTO
            {
                Id = vaccination.Id,
                VaccineName = vaccination.VaccineName,
                Location = vaccination.Location,
                date = DateOnly.FromDateTime(vaccination.Date),
                NurseName = vaccination.Nurse?.Name ?? string.Empty,
                StudentName = vaccination.Student?.Name ?? string.Empty
            };
        }


    }
}