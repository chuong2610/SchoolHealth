using backend.Interfaces;
using backend.Models.DTO;

namespace backend.Services
{
    public class HomeService : IHomeService
    {
        private readonly INotificationService _notificationService;
        private readonly IMedicalEventService _medicalEventService;
        private readonly IMedicationService _medicationService;
        private readonly IMedicalSupplyService _medicalSupplyService;
        private readonly IStudentService _studentService;
        private readonly IUserService _userService;

        public HomeService(INotificationService notificationService, IMedicalEventService medicalEventService, IMedicationService medicationService, IStudentService studentService, IUserService userService, IMedicalSupplyService medicalSupplyService)
        {
            _notificationService = notificationService;
            _medicalEventService = medicalEventService;
            _medicationService = medicationService;
            _studentService = studentService;
            _userService = userService;
            _medicalSupplyService = medicalSupplyService;
        }
        public async Task<HomeNurseDTO> GetHomeNurseAsync(int nurseId, int pageNumber, int pageSize, string? search)
        {
            var pendingMedications = await _medicationService.GetMedicationsPendingAsync(pageNumber, pageSize, search);
            var activeMedications = await _medicationService.GetMedicationsActiveByNurseIdAsync(nurseId, pageNumber, pageSize, search);
            var completedMedications = await _medicationService.GetMedicationsCompletedByNurseIdAsync(nurseId, pageNumber, pageSize, search);
            var notifications = await _notificationService.GetNotificationsByNurseIdAsync(nurseId);
            var medicalEvents = await _medicalEventService.GetMedicalEventsTodayAsync();
            var weeklyMedicalEventCounts = await _medicalEventService.GetWeeklyMedicalEventCountsAsync();


            return new HomeNurseDTO
            {

                PendingMedicationsNumber = pendingMedications.Items.Count,
                ActiveMedicationsNumber = activeMedications.Items.Count,
                CompletedMedicationsNumber = completedMedications.Items.Count,
                NotificationsNumber = notifications.Count,
                Medications = activeMedications.Items.Concat(completedMedications.Items).ToList(),
                Notifications = notifications,
                MedicalEvents = medicalEvents,
                WeeklyMedicalEventCounts = weeklyMedicalEventCounts
            };
        }

        public async Task<HomeAdminDTO> GetHomeAdminAsync(int pageNumber, int pageSize, string? search)
        {
            var numberOfStudents = await _studentService.GetNumberOfStudents();
            var numberOfNurses = await _userService.GetNumberOfUsersAsync("Nurse");
            var numberOfParents = await _userService.GetNumberOfUsersAsync("Parent");
            var pendingMedications = await _medicationService.GetMedicationsPendingAsync(pageNumber, pageSize, search);
            var activeMedications = await _medicationService.GetMedicationsActiveAsync();
            var completedMedications = await _medicationService.GetMedicationsCompletedAsync();
            var notifications = await _notificationService.Get5Notifications();
            var medicalEvents = await _medicalEventService.GetMedicalEventsTodayAsync();
            var weeklyMedicalEventCounts = await _medicalEventService.GetWeeklyMedicalEventCountsAsync();
            var medicalSupplies = await _medicalSupplyService.GetAllMedicalSuppliesAsync(pageNumber, pageSize);

            return new HomeAdminDTO
            {
                NumberOfStudents = numberOfStudents,
                NumberOfNurses = numberOfNurses,
                NumberOfParents = numberOfParents,
                PendingMedicationsNumber = pendingMedications.Items.Count,
                ActiveMedicationsNumber = activeMedications.Count,
                CompletedMedicationsNumber = completedMedications.Count,
                MedicalSupplies = medicalSupplies.Items,
                Medications = activeMedications.Concat(completedMedications).ToList(),
                Notifications = notifications,
                MedicalEvents = medicalEvents,
                WeeklyMedicalEventCounts = weeklyMedicalEventCounts
            };
        }

    }
}