using backend.Interfaces;
using backend.Models.DTO;

namespace backend.Services
{
    public class HomeService : IHomeService
    {
        private readonly INotificationService _notificationService;
        private readonly IMedicalEventService _medicalEventService;
        private readonly IMedicationService _medicationService;

        public HomeService(INotificationService notificationService, IMedicalEventService medicalEventService, IMedicationService medicationService)
        {
            _notificationService = notificationService;
            _medicalEventService = medicalEventService;
            _medicationService = medicationService;
        }
        public async Task<HomeNurseDTO> GetHomeNurseAsync(int nurseId)
        {
            var pendingMedications = await _medicationService.GetMedicationsPendingAsync();
            var activeMedications = await _medicationService.GetMedicationsActiveByNurseIdAsync(nurseId);
            var completedMedications = await _medicationService.GetMedicationsCompletedByNurseIdAsync(nurseId);
            var notifications = await _notificationService.GetNotificationsByParentIdAsync(nurseId);
            var medicalEvents = await _medicalEventService.GetMedicalEventsTodayAsync();
            var weeklyMedicalEventCounts = await _medicalEventService.GetWeeklyMedicalEventCountsAsync();

            return new HomeNurseDTO
            {
                PendingMedicationsNumber = pendingMedications.Count,
                ActiveMedicationsNumber = activeMedications.Count,
                CompletedMedicationsNumber = completedMedications.Count,
                NotificationsNumber = notifications.Count,
                Medications = activeMedications.Concat(completedMedications).ToList(),
                Notifications = notifications,
                MedicalEvents = medicalEvents,
                WeeklyMedicalEventCounts = weeklyMedicalEventCounts
            };
        }
        
    }
}