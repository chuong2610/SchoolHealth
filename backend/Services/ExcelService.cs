using System.Globalization;
using backend.Interfaces;
using backend.Models;
using backend.Models.DTO;
using ClosedXML.Excel;

namespace backend.Services
{
    public class ExcelService : IExcelService
    {
        private readonly IStudentService _studentService;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IHealthCheckService _healthCheckService;
        private readonly IVaccinationService _vaccinationService;
        private readonly IClassService _classService;

        public ExcelService(IStudentService studentService, IUserService userService, INotificationService notificationService, IHealthCheckService healthCheckService, IVaccinationService vaccinationService, IClassService classService)
        {
            _studentService = studentService;
            _userService = userService;
            _notificationService = notificationService;
            _healthCheckService = healthCheckService;
            _vaccinationService = vaccinationService;
            _classService = classService;
        }

        public async Task<byte[]> ExportStudentsAndParentFromExcelAsync()
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Students & Parents");

            // Tạo tiêu đề
            var headers = new List<string>
    {
        "STT", "Mã học sinh", "Tên học sinh", "Giới tính", "Ngày sinh", "Lớp",
        "Tên phụ huynh", "Ngày sinh PH", "Giới tính PH", "SĐT", "Email", "Địa chỉ"
    };

            for (int i = 0; i < headers.Count; i++)
            {
                worksheet.Cell(1, i + 1).Value = headers[i];
                worksheet.Cell(1, i + 1).Style.Font.Bold = true;
                worksheet.Column(i + 1).Width = 20;
            }

            worksheet.Cell(2, 5).Style.DateFormat.Format = "dd/MM/yyyy";
            worksheet.Cell(2, 8).Style.DateFormat.Format = "dd/MM/yyyy";
            worksheet.Cell(2, 5).SetValue("dd/MM/yyyy");
            worksheet.Cell(2, 8).SetValue("dd/MM/yyyy");

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }



        public async Task<ImportPSResult> ImportStudentsAndParentsFromExcelAsync(IFormFile file)
        {
            var result = new ImportPSResult();
            if (file == null || file.Length == 0)
            {
                result.Errors.Add("No file uploaded.");
                return result;
            }
            using var stream = file.OpenReadStream();
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            var rows = worksheet.RowsUsed().Skip(1);

            foreach (var row in rows)
            {
                try
                {
                    // add student
                    var student = new Student();
                    student.Name = row.Cell("C").GetString().Trim();
                    student.StudentNumber = row.Cell("B").GetString().Trim();
                    student.Gender = row.Cell("D").GetString().Trim();
                    var studentDobStr = row.Cell("E").GetString().Trim();
                    Console.WriteLine($"Processing student: {student.Name}, DOB: {studentDobStr}");
                    if (DateTime.TryParseExact(studentDobStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime studentDob))
                    {
                        student.DateOfBirth = DateOnly.FromDateTime(studentDob);
                        Console.WriteLine($"Parsed successfully: {student.Name}, DOB: {student.DateOfBirth}");
                    }

                    else
                    {
                        result.Errors.Add($"Dòng {row.RowNumber()}: Ngày sinh học sinh không hợp lệ ({studentDobStr}).");
                        continue;
                    }
                    Class? studentClass = await _classService.GetClassByNameAsync(row.Cell("F").GetString().Trim());
                    student.ClassId = studentClass?.Id ?? 0;
                    if (string.IsNullOrWhiteSpace(student.StudentNumber))
                    {
                        result.Errors.Add($"Dòng {row.RowNumber()}: Thiếu mã học sinh.");
                        continue;
                    }

                    // result.Students.Add(student);

                    // add parent
                    var parentName = row.Cell("G").GetString().Trim();
                    var parentDobStr = row.Cell("H").GetString().Trim();
                    DateOnly? parentDob = null;
                    if (DateTime.TryParseExact(parentDobStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedParentDob))
                    {
                        parentDob = DateOnly.FromDateTime(parsedParentDob);
                        Console.WriteLine($"Processing parent: {parentName}, DOB: {parentDob}");
                    }
                    else
                    {
                        result.Errors.Add($"Dòng {row.RowNumber()}: Ngày sinh phụ huynh không hợp lệ ({parentDobStr}).");
                        continue;
                    }
                    var parent = new User
                    {
                        Name = parentName,
                        DateOfBirth = parentDob.Value,
                        Gender = row.Cell("I").GetString().Trim(),
                        Phone = row.Cell("J").GetString().Trim(),
                        Email = row.Cell("K").GetString().Trim(),
                        Address = row.Cell("L").GetString().Trim(),
                        RoleId = 3,
                        Password = "default_password"
                    };
                    // result.Parents.Add(parent);

                    // save to db
                    var existingStudent = await _studentService.GetStudentByStudentNumberAsync(student.StudentNumber);
                    if (existingStudent != null)
                    {
                        result.Errors.Add($"Student với mã {student.StudentNumber} đã tồn tại.");
                        continue;
                    }

                    var existingParents = await _userService.GetUserByPhoneAsync(parent.Phone);
                    if (existingParents != null)
                    {
                        parent = existingParents;
                    }
                    student.Parent = parent;
                    student.Profile = new StudentProfile();
                    bool success = await _studentService.CreateAsync(student);
                    if (!success)
                    {
                        result.Errors.Add($"Dòng {row.RowNumber()}: Không thể tạo học sinh {student.Name}.");
                    }

                }
                catch (Exception ex)
                {
                    result.Errors.Add($"Dòng {row.RowNumber()}: {ex.Message}");
                }
            }

            return result;
        }
        public async Task<byte[]> ExportFormResultAsync(int id)
        {
            var notification = await _notificationService.GetNotificationDetailAdminDTOAsync(id);
            if (notification == null)
            {
                throw new Exception("Không tìm thấy thông báo");
            }

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Kết quả");

            var className = notification.ClassName;
            var nurseName = notification.NurseName;
            var title = notification.Title;
            var date = notification.Date;
            var location = notification.Location;
            worksheet.Cell(1, 1).Value = $"Lớp: {className}";
            worksheet.Cell(2, 1).Value = $"Nhân viên y tế: {nurseName} - {notification.NurseId}";
            worksheet.Cell(3, 1).Value = $"{title} - {date:dd/MM/yyyy} - {location}";
            var headers = new List<string>();
            switch (notification.Type)
            {
                case "HealthCheck":
                    headers = new List<string>
                    {
                        "MSHS","Họ tên", "Chiều cao", "Cân nặng", "Thị lực trái", "Thị lực phải",
                        "BMI", "Huyết áp", "Nhịp tim", "Mô tả", "Kết luận"
                    };
                    break;

                case "Vaccination":
                    headers = new List<string>
                    {
                        "MSHS","Họ tên", "Vắc xin", "Mô tả", "Kết luận"
                    };
                    break;
            }
            
            for (int i = 0; i < headers.Count; i++)
            {
                Console.WriteLine($"Adding header: {headers[i]}");
                worksheet.Cell(5, i + 1).Value = headers[i];
                worksheet.Cell(5, i + 1).Style.Font.Bold = true;
                worksheet.Column(i + 1).Width = 15;
            }
            int currentRow = 6;
            var students = await _studentService.GetStudentsByNotificationIdAndConfirmedAsync(id);
            if (students != null && students.Count > 0)
            {
                foreach (var student in students)
                {
                    worksheet.Cell(currentRow, 1).Value = student.StudentNumber;
                    worksheet.Cell(currentRow, 2).Value = student.StudentName;
                    currentRow++;
                }
            }
            else
            {
                worksheet.Cell(currentRow, 1).Value = "Không có học sinh nào được xác nhận.";
            }    
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<ImportResult> ImportFormResultAsync(IFormFile file, int notificationId)
        {
            var importResult = new ImportResult();
            var notification = await _notificationService.GetNotificationDetailAdminDTOAsync(notificationId);
            if (notification == null)
                throw new Exception("Không tìm thấy thông báo");

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);

            string nurseName = "";
            int userId = 0;

            try
            {
                var parts = worksheet.Cell(2, 1).GetString().Replace("Nhân viên y tế: ", "").Split(" - ");
                if (parts.Length >= 2)
                {
                    nurseName = parts[0].Trim();
                    int.TryParse(parts[1].Trim(), out userId);
                }
            }
            catch (Exception ex)
            {
                importResult.ErrorMessages.Add($"Lỗi đọc thông tin nhân viên y tế: {ex.Message}");
                return importResult;
            }

            int row = 6;

            switch (notification.Type)
            {
                case "HealthCheck":
                    while (!worksheet.Cell(row, 1).IsEmpty())
                    {
                        try
                        {
                            string studentNumber = worksheet.Cell(row, 1).GetString().Trim();
                            var student = await _studentService.GetStudentByStudentNumberAsync(studentNumber);
                            if (student == null)
                            {
                                importResult.ErrorMessages.Add($"Dòng {row}: Không tìm thấy học sinh với mã '{studentNumber}'.");
                                row++;
                                continue;
                            }

                            decimal height = worksheet.Cell(row, 3).GetValue<decimal>();
                            decimal weight = worksheet.Cell(row, 4).GetValue<decimal>();
                            decimal visionLeft = worksheet.Cell(row, 5).GetValue<decimal>();
                            decimal visionRight = worksheet.Cell(row, 6).GetValue<decimal>();
                            decimal bmi = worksheet.Cell(row, 7).GetValue<decimal>();
                            string bloodPressure = worksheet.Cell(row, 8).GetString().Trim();
                            string heartRate = worksheet.Cell(row, 9).GetString().Trim();
                            string description = worksheet.Cell(row, 10).GetString().Trim();
                            string conclusion = worksheet.Cell(row, 11).GetString().Trim();

                            var healthCheck = new HealthCheck
                            {
                                StudentId = student.Id,
                                Height = height,
                                Weight = weight,
                                VisionLeft = visionLeft,
                                VisionRight = visionRight,
                                Bmi = bmi,
                                BloodPressure = bloodPressure,
                                HeartRate = heartRate,
                                Description = description,
                                Conclusion = conclusion,
                                NotificationId = notificationId,
                                Date = notification.Date,
                                UserId = userId,
                                Location = notification.Location
                            };

                            bool isCreated = await _healthCheckService.CreateHealthCheckAsync(healthCheck);
                            if (!isCreated)
                            {
                                importResult.ErrorMessages.Add($"Dòng {row}: Không thể lưu thông tin khám sức khỏe cho học sinh '{student.StudentName}'.");
                            }
                        }
                        catch (Exception ex)
                        {
                            importResult.ErrorMessages.Add($"Dòng {row}: Lỗi khi xử lý - {ex.Message}");
                        }
                        row++;
                    }
                    break;

                case "Vaccination":
                    while (!worksheet.Cell(row, 1).IsEmpty())
                    {
                        try
                        {
                            string studentNumber = worksheet.Cell(row, 1).GetString().Trim();
                            var student = await _studentService.GetStudentByStudentNumberAsync(studentNumber);
                            if (student == null)
                            {
                                importResult.ErrorMessages.Add($"Dòng {row}: Không tìm thấy học sinh với mã '{studentNumber}'.");
                                row++;
                                continue;
                            }

                            string vaccineName = worksheet.Cell(row, 3).GetString().Trim();
                            string description = worksheet.Cell(row, 4).GetString().Trim();
                            string result = worksheet.Cell(row, 5).GetString().Trim();

                            var vaccination = new Vaccination
                            {
                                StudentId = student.Id,
                                VaccineName = vaccineName,
                                Description = description,
                                Result = result,
                                NotificationId = notificationId,
                                Date = notification.Date,
                                UserId = userId,
                                Location = notification.Location
                            };

                            bool isCreated = await _vaccinationService.CreateVaccinationAsync(vaccination);
                            if (!isCreated)
                            {
                                importResult.ErrorMessages.Add($"Dòng {row}: Không thể lưu thông tin tiêm chủng cho học sinh '{student.StudentName}'.");
                            }
                        }
                        catch (Exception ex)
                        {
                            importResult.ErrorMessages.Add($"Dòng {row}: Lỗi khi xử lý - {ex.Message}");
                        }
                        row++;
                    }
                    break;

                default:
                    throw new Exception("Loại biểu mẫu không được hỗ trợ.");
            }

            return importResult;
        }

    }
}