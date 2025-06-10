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

        public ExcelService(IStudentService studentService, IUserService userService)
        {
            _studentService = studentService;
            _userService = userService;
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
                    if (DateTime.TryParse(studentDobStr, out DateTime studentDob))
                    {
                        student.DateOfBirth = DateOnly.FromDateTime(studentDob);
                    }
                    else
                    {
                        result.Errors.Add($"Dòng {row.RowNumber()}: Ngày sinh học sinh không hợp lệ ({studentDobStr}).");
                        continue;
                    }
                    student.ClassName = row.Cell("F").GetString().Trim();
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
                    if (DateTime.TryParse(parentDobStr, out DateTime parsedParentDob))
                    {
                        parentDob = DateOnly.FromDateTime(parsedParentDob);
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
    }
}