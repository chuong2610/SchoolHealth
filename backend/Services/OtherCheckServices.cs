using System.Globalization;
using Azure;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using backend.Models.Request;

namespace backend.Services;

public class OtherCheckService : IOtherCheckService
{
    private readonly IOtherCheckRepository _otherCheckRepository;

    public OtherCheckService(IOtherCheckRepository otherCheckRepository)
    {
        _otherCheckRepository = otherCheckRepository;
    }

    public async Task<List<OtherCheckDTO>> GetAllOtherChecksAsync()
    {
        var otherChecks = await _otherCheckRepository.GetAllOtherChecksAsync();
        return await MapToDTO(otherChecks);
    }
    public async Task<OtherCheckDetailDTO?> GetOtherCheckByIdAsync(int id)
    {
        var otherCheck = await _otherCheckRepository.GetOtherCheckByIdAsync(id);
        if (otherCheck == null) return null;

        return new OtherCheckDetailDTO
        {
            Id = otherCheck.Id,
            Name = otherCheck.Name,
            CheckList = otherCheck.CheckList.Select(item => new OtherCheckItemDTO
            {
                Name = item.Name,
                Value = item.Value
            }).ToList(),
            Date = otherCheck.Date,
            Location = otherCheck.Location,
            Description = otherCheck.Description ?? string.Empty,
            Conclusion = otherCheck.Conclusion,
            ResultAtHome = otherCheck.ResultAtHome ?? string.Empty,
            NurseName = otherCheck.Nurse.Name ?? string.Empty,
            NurseId = otherCheck.Nurse.Id,
            StudentName = otherCheck.Student.Name ?? string.Empty
        };
    }
    public async Task<PageResult<OtherCheckDTO>> GetOtherChecksByParentIdAsync(int parentId, int pageNumber, int pageSize, string? search)
    {
        DateTime? searchDate = null;
        bool isDate = false;

        if (!string.IsNullOrEmpty(search) &&
            DateTime.TryParseExact(search, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
                searchDate = parsedDate;
                isDate = true;
            }

            search = isDate ? null : search;

            var otherChecks = await _otherCheckRepository.GetOtherChecksByParentIdAsync(parentId, pageNumber, pageSize, search, searchDate);
            return new PageResult<OtherCheckDTO>
            {
                Items = await MapToDTO(otherChecks),
                TotalItems = otherChecks.Count,
                TotalPages = (int)Math.Ceiling(otherChecks.Count / (double)pageSize),
                CurrentPage = pageNumber
            };
    }
    public async Task<List<OtherCheckDTO>> GetOtherChecksByNotificationIdAsync(int notificationId)
    {
        var otherChecks = await _otherCheckRepository.GetOtherChecksByNotificationIdAsync(notificationId);
        return await MapToDTO(otherChecks);
    }
    public async Task<bool> SubmitResultAtHomeAsync(int otherCheckId)
    {
        return await _otherCheckRepository.SubmitResultAtHomeAsync(otherCheckId);
    }
    public async Task<bool> CreateOtherCheckAsync(OtherCheck otherCheck)
    {
        return await _otherCheckRepository.CreateOtherCheckAsync(otherCheck);
    }
    private Task<List<OtherCheckDTO>> MapToDTO(List<OtherCheck> otherChecks)
    {
        var otherCheckDTOs = otherChecks.Select(oc => new OtherCheckDTO
        {
            Id = oc.Id,
            Name = oc.Name,
            Location = oc.Location,
            Date = oc.Date,
            Conclusion = oc.Conclusion,
            ResultAtHome = oc.ResultAtHome ?? string.Empty,
            NurseName = oc.Nurse.Name ?? string.Empty,
            StudentName = oc.Student.Name ?? string.Empty,
            NotificationId = oc.NotificationId,
            Description = oc.Description ?? string.Empty,
            CheckList = oc.CheckList.Select(item => new OtherCheckItemDTO
            {
                Name = item.Name,
                Value = item.Value
            }).ToList()
        }).ToList();

        return Task.FromResult(otherCheckDTOs);
    }
}