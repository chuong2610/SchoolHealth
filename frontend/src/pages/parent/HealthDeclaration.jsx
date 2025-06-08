import React, { useEffect, useState } from "react";
import axios from "axios";

// Hàm lấy parentId từ token (thủ công)
const getParentIdFromToken = (token) => {
  try {
    const payload = token.split(".")[1]; // Lấy phần payload
    const decoded = atob(payload); // Giải mã base64
    const data = JSON.parse(decoded); // Chuyển thành object
    return data.sub; // Trả về sub (ID parent)
  } catch (e) {
    console.error("Error decoding token:", e);
    return "3"; // Mặc định là 3 nếu lỗi
  }
};

const HealthDeclaration = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    class: "",
    allergys: "",
    chronicIllnesss: "",
    longTermMedications: "",
    otherMedicalConditions: "",
  });

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDM4OTI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.bPbFgD4y0GGSlryFzZj7YYYzlkWFL9pDbg6uHdZGz4U";
        const parentId = getParentIdFromToken(token); // Lấy parentId từ token
        const response = await axios.get(
          `http://localhost:5182/api/Students/by-parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API response.data:", response.data); // Log dữ liệu API
        // Lấy mảng data từ response.data
        setStudents(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        setLoading(false);
      } catch (err) {
        console.error(
          "Fetch students error:",
          err.response ? err.response : err
        );
        setError(
          err.response
            ? `Lỗi ${err.response.status} : ${
                err.response.data.message ||
                "Không thể tải danh sách học sinh. "
              }`
            : "Không thể kết nối đến server."
        );
        setStudents([]); // Đặt lại students là mảng rỗng nếu lỗi
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Xử lý khi chọn học sinh từ dropdown
  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find((s) => s.id === parseInt(studentId));
    setSelectedStudent(student);
    if (student) {
      setFormData((prev) => ({
        ...prev,
        studentId: student.id.toString(),
        studentName: student.studentName,
        class: student.className,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        studentId: "",
        studentName: "",
        class: "",
      }));
    }
  };

  // Kết thúc xử lí khi chọn học sinh từ dropdown

  // Xử lý thay đổi các trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Vui lòng chọn học sinh trước khi gửi.");
      return;
    }

    const dataToSubmit = {
      studentId: parseInt(formData.studentId),
      allergys: formData.allergys || "none",
      chronicIllnesss: formData.chronicIllnesss || "none",
      longTermMedications: formData.longTermMedications || "none",
      otherMedicalConditions: formData.otherMedicalConditions || "none",
    };

    try {
      // Sử dụng token trực tiếp
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MzY4MzAxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.c2y0FVhuS5IYr71JC3F45O3F3pKfP896XnyNwNvyWBE";
      const response = await axios.post(
        "http://localhost:5182/api/StudentProfile/declare",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API response:", response.data);
      alert(response.data.message || "Khai báo y tế thành công!");
      // Reset form sau khi submit thành công
      setFormData({
        studentId: "",
        studentName: "",
        class: "",
        allergys: "",
        chronicIllnesss: "",
        longTermMedications: "",
        otherMedicalConditions: "",
      });
      setSelectedStudent(null);
    } catch (err) {
      console.error("Submit error:", err.response ? err.response : err);
      alert(
        err.response
          ? `Lỗi ${err.response.status}: ${
              err.response.data.message || "Không thể gửi khai báo."
            }`
          : "Không thể kết nối đến server."
      );
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Xử lý submit form
  //   console.log("Form submitted:", formData);
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  // const handleSymptomChange = (symptom) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     symptoms: prev.symptoms.includes(symptom)
  //       ? prev.symptoms.filter((s) => s !== symptom)
  //       : [...prev.symptoms, symptom],
  //   }));
  // };

  // Log students khi nó thay đổi
  useEffect(() => {
    console.log("students state:", students);
  }, [students]); // Chỉ log khi students thay đổi

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Khai báo y tế</h2>
              {loading ? (
                <p className="text-center">Đang tải danh sách học sinh...</p>
              ) : error ? (
                <p className="text-center text-danger">{error}</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="studentSelect" className="form-label">
                      Chọn học sinh
                    </label>
                    <select
                      className="form-select"
                      id="studentSelect"
                      value={selectedStudent?.id || ""}
                      onChange={handleStudentChange}
                      required
                    >
                      <option value="">-- Chọn học sinh --</option>
                      {Array.isArray(students) && students.length > 0 ? (
                        students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.studentName} (Mã: {student.id}, Lớp:{" "}
                            {student.className})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Không có học sinh nào
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studentName" className="form-label">
                      Họ và tên học sinh
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studentId" className="form-label">
                      Mã học sinh
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="class" className="form-label">
                      Lớp
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="allergys" className="form-label">
                      Dị ứng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="allergys"
                      name="allergys"
                      value={formData.allergys}
                      onChange={handleChange}
                      placeholder="Ví dụ: dị ứng hải sản"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="chronicIllnesss" className="form-label">
                      Bệnh mãn tính
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="chronicIllnesss"
                      name="chronicIllnesss"
                      value={formData.chronicIllnesss}
                      onChange={handleChange}
                      placeholder="Ví dụ: none"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="longTermMedications" className="form-label">
                      Thuốc sử dụng lâu dài
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="longTermMedications"
                      name="longTermMedications"
                      value={formData.longTermMedications}
                      onChange={handleChange}
                      placeholder="Ví dụ: none"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="otherMedicalConditions"
                      className="form-label"
                    >
                      Tình trạng y tế khác
                    </label>
                    <textarea
                      className="form-control"
                      id="otherMedicalConditions"
                      name="otherMedicalConditions"
                      rows="3"
                      value={formData.otherMedicalConditions}
                      onChange={handleChange}
                      placeholder="Ví dụ: none"
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Gửi khai báo
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDeclaration;
