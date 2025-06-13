using backend.Interfaces;
using backend.Models.DTO;

namespace backend.Services
{
    public class HomeService : IHomeService
    {
        private readonly INotificationService _notificationService;
        private readonly IMedicalEventService _medicalEventService;
        private readonly IMedicationService _medicationService;
        private readonly IStudentService _studentService;
        private readonly IUserService _userService;

        public HomeService(INotificationService notificationService, IMedicalEventService medicalEventService, IMedicationService medicationService, IStudentService studentService, IUserService userService)
        {
            _notificationService = notificationService;
            _medicalEventService = medicalEventService;
            _medicationService = medicationService;
            _studentService = studentService;
            _userService = userService;
        }
        public async Task<HomeNurseDTO> GetHomeNurseAsync(int nurseId)
        {
            var pendingMedications = await _medicationService.GetMedicationsPendingAsync();
            var activeMedications = await _medicationService.GetMedicationsActiveByNurseIdAsync(nurseId);
            var completedMedications = await _medicationService.GetMedicationsCompletedByNurseIdAsync(nurseId);
            var notifications = await _notificationService.GetNotificationsByNurseIdAsync(nurseId);
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

        public async Task<HomeAdminDTO> GetHomeAdminAsync()
        {
            var numberOfStudents = await _studentService.GetNumberOfStudents();
            var numberOfNurses = await _userService.GetNumberOfUsersAsync("Nurse");
            var numberOfParents = await _userService.GetNumberOfUsersAsync("Parent");
            var pendingMedications = await _medicationService.GetMedicationsPendingAsync();
            var activeMedications = await _medicationService.GetMedicationsActiveAsync();
            var completedMedications = await _medicationService.GetMedicationsCompletedAsync();
            var notifications = await _notificationService.Get5Notifications();
            var medicalEvents = await _medicalEventService.GetMedicalEventsTodayAsync();
            var weeklyMedicalEventCounts = await _medicalEventService.GetWeeklyMedicalEventCountsAsync();

            return new HomeAdminDTO
            {
                NumberOfStudents = numberOfStudents,
                NumberOfNurses = numberOfNurses,
                NumberOfParents = numberOfParents,
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