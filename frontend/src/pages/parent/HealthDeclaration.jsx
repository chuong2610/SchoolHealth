import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Table, Badge } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import {
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaHeartbeat,
  FaPaperPlane,
  FaEye,
  FaCheck,
  FaTimes,
  FaIdCard,
  FaGraduationCap,
  FaPills,
  FaStickyNote,
} from "react-icons/fa";
import "../../styles/parent-theme.css";
import { toast } from "react-toastify";

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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CardInfo = styled.div`
  background: linear-gradient(120deg, #e6f7ff 60%, #f0f5ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(56, 182, 255, 0.12);
  padding: 32px 28px 18px 28px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.7s;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38b6ff 60%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28px;
  box-shadow: 0 2px 12px rgba(56, 182, 255, 0.18);
`;

const InfoLabel = styled.div`
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
`;

const InfoValue = styled.div`
  font-size: 1.08rem;
  color: #1a365d;
  margin-bottom: 10px;
`;

const StyledForm = styled.form`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.08);
  padding: 32px 28px 18px 28px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.7s;
`;

const StyledInput = styled.input`
  border-radius: 12px;
  border: 2px solid #e6eaf0;
  background: #f8f9fa;
  padding: 12px 16px;
  font-size: 1rem;
  margin-bottom: 12px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #38b6ff;
    box-shadow: 0 0 0 2px rgba(56, 182, 255, 0.12);
    outline: none;
  }
`;

const StyledSelect = styled.select`
  border-radius: 12px;
  border: 2px solid #e6eaf0;
  background: #f8f9fa;
  padding: 12px 16px;
  font-size: 1rem;
  margin-bottom: 12px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #38b6ff;
    box-shadow: 0 0 0 2px rgba(56, 182, 255, 0.12);
    outline: none;
  }
`;

const StyledTextarea = styled.textarea`
  border-radius: 12px;
  border: 2px solid #e6eaf0;
  background: #f8f9fa;
  padding: 12px 16px;
  font-size: 1rem;
  margin-bottom: 12px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #38b6ff;
    box-shadow: 0 0 0 2px rgba(56, 182, 255, 0.12);
    outline: none;
  }
`;

const GradientButton = styled.button`
  background: linear-gradient(90deg, #2980b9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  padding: 12px 32px;
  font-size: 1.1rem;
  box-shadow: 0 2px 12px rgba(56, 182, 255, 0.18);
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980b9 100%);
    box-shadow: 0 6px 24px rgba(56, 182, 255, 0.22);
    transform: scale(1.05);
  }
`;

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
  const [declarationHistory, setDeclarationHistory] = useState([]);

  // Hàm fetch lịch sử khai báo y tế
  const fetchDeclarationHistory = async (parentId, token) => {
    try {
      const response = await axios.get(
        `http://localhost:5182/api/StudentProfile/by-parent/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeclarationHistory(response.data.data || []);
    } catch (err) {
      setDeclarationHistory([]);
    }
  };

  useEffect(() => {
    const fetchStudentsAndHistory = async () => {
      try {
        const token = localStorage.token;
        const parentId = localStorage.userId;
        // Fetch students
        const response = await axios.get(
          `http://localhost:5182/api/Students/by-parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
        // Fetch declaration history
        await fetchDeclarationHistory(parentId, token);
      } catch (err) {
        setError(
          err.response
            ? `Lỗi ${err.response.status} : ${err.response.data.message || "Không thể tải danh sách học sinh. "}`
            : "Không thể kết nối đến server."
        );
        setStudents([]);
        setLoading(false);
      }
    };
    fetchStudentsAndHistory();
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
    let hasError = false;
    // Validation cho từng trường
    if (!selectedStudent) {
      toast.error("Vui lòng chọn học sinh.");
      hasError = true;
    }
    if (!formData.allergys && !formData.chronicIllnesss && !formData.longTermMedications && !formData.otherMedicalConditions) {
      toast.error("Vui lòng nhập ít nhất một thông tin y tế.");
      hasError = true;
    }
    if (hasError) {
      // Cuộn lên đầu form để người dùng thấy lỗi
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const token = localStorage.token;
      const parentId = localStorage.userId;
      await axios.post(
        "http://localhost:5182/api/StudentProfile/declare",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Khai báo y tế thành công!");
      // Reset form sau khi submit thành công
      setFormData({
        studentId: "",

        allergys: "",
        chronicIllnesss: "",
        longTermMedications: "",
        otherMedicalConditions: "",
      });
      setSelectedStudent(null);
      // Cập nhật lại lịch sử khai báo y tế
      await fetchDeclarationHistory(parentId, token);
    } catch (err) {
      toast.error(
        err.response
          ? `Lỗi ${err.response.status}: ${err.response.data.message || "Không thể gửi khai báo."}`
          : "Không thể kết nối đến server."
      );
    }
  };

  return (
    <div className="parent-bg-img parent-theme parent-bg">
      <div className="fade-in-up">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-8">

              <form className="parent-form" onSubmit={handleSubmit}>
                <div className="parent-form-header">
                  <h2>
                    <FaHeartbeat style={{ color: "#38b6ff", marginRight: 12, fontSize: 32, verticalAlign: "middle" }} />
                    Khai báo y tế
                  </h2>
                  <p>Vui lòng điền thông tin sức khỏe của học sinh để nhà trường hỗ trợ tốt nhất.</p>
                </div>
                {loading ? (
                  <p className="text-center">Đang tải danh sách học sinh...</p>
                ) : error ? (
                  <p className="text-center text-danger">{error}</p>
                ) : (
                  <div className="parent-form-grid">
                    <div className="form-group">
                      <label htmlFor="studentSelect">Chọn học sinh</label>
                      <select
                        className="parent-input"
                        id="studentSelect"
                        value={selectedStudent?.id || ""}
                        onChange={handleStudentChange}

                      >
                        <option value="">-- Chọn học sinh --</option>
                        {Array.isArray(students) && students.length > 0 ? (
                          students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.studentName} (Mã: {student.id}, Lớp: {student.className})
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Không có học sinh nào
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentName">Họ và tên học sinh</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentId">Mã học sinh</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="class">Lớp</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="allergys">Dị ứng</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="allergys"
                        name="allergys"
                        value={formData.allergys}
                        onChange={handleChange}
                        placeholder="Ví dụ: dị ứng hải sản"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="chronicIllnesss">Bệnh mãn tính</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="chronicIllnesss"
                        name="chronicIllnesss"
                        value={formData.chronicIllnesss}
                        onChange={handleChange}
                        placeholder="Ví dụ: hen suyễn"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="longTermMedications">Thuốc sử dụng lâu dài</label>
                      <input
                        type="text"
                        className="parent-input"
                        id="longTermMedications"
                        name="longTermMedications"
                        value={formData.longTermMedications}
                        onChange={handleChange}
                        placeholder="Ví dụ: none"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1/-1" }}>
                      <label htmlFor="otherMedicalConditions">Tình trạng y tế khác</label>
                      <textarea
                        className="parent-input"
                        id="otherMedicalConditions"
                        name="otherMedicalConditions"
                        rows="3"
                        value={formData.otherMedicalConditions}
                        onChange={handleChange}
                        placeholder="Ví dụ: none"
                      ></textarea>
                    </div>
                    <div className="d-grid" style={{ gridColumn: "1/-1" }}>
                      <button
                        type="submit"
                        className="parent-btn parent-gradient-btn"
                      >
                        <FaPaperPlane /> Gửi khai báo
                      </button>
                    </div>
                  </div>
                )}
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDeclaration;
