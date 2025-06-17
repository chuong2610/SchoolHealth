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
} from "react-icons/fa";
import "../../styles/parent-theme.css";

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
  const [declarations, setDeclarations] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // const token =
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDM4OTI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.bPbFgD4y0GGSlryFzZj7YYYzlkWFL9pDbg6uHdZGz4U";
        // const parentId = getParentIdFromToken(token); // Lấy parentId từ token

        const token = localStorage.token; // Lấy token từ localStorage
        const parentId = localStorage.userId; // Lấy parentId từ localStorage (thủ công)
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
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MzY4MzAxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.c2y0FVhuS5IYr71JC3F45O3F3pKfP896XnyNwNvyWBE";

      const token = localStorage.token;
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

  // Fetch declarations history
  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDM4OTI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.bPbFgD4y0GGSlryFzZj7YYYzlkWFL9pDbg6uHdZGz4U";
        // const parentId = getParentIdFromToken(token);

        const token = localStorage.token; // Lấy token từ localStorage
        console.log("Token:", token); // Log token để kiểm tra
        const parentId = localStorage.userId; // Lấy parentId từ localStorage (thủ công)
        const response = await axios.get(
          `http://localhost:5182/api/StudentProfile/by-parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeclarations(response.data.data || []);
      } catch (err) {
        console.error("Fetch declarations error:", err);
      }
    };
    fetchDeclarations();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Badge bg="warning" className="status-badge">
            <FaExclamationCircle /> Đang chờ
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge bg="success" className="status-badge">
            <FaCheckCircle /> Đã xác nhận
          </Badge>
        );
      case "Rejected":
        return (
          <Badge bg="danger" className="status-badge">
            <FaTimes /> Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="status-badge">
            <FaExclamationCircle /> Không xác định
          </Badge>
        );
    }
  };

  const handleViewDetails = (declaration) => {
    setSelectedDeclaration(declaration);
    setShowDetailModal(true);
  };

  // Log students khi nó thay đổi
  useEffect(() => {
    console.log("students state:", students);
  }, [students]); // Chỉ log khi students thay đổi

  return (
    <div className="parent-theme parent-bg">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="parent-card">
              <form className="parent-form" onSubmit={handleSubmit}>
                <h2 className="h4 mb-4">Khai báo y tế</h2>
                {loading ? (
                  <p className="text-center">Đang tải danh sách học sinh...</p>
                ) : error ? (
                  <p className="text-center text-danger">{error}</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="studentSelect" className="form-label">
                        Chọn học sinh
                      </label>
                      <select
                        className="parent-input"
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
                        className="parent-input"
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
                        className="parent-input"
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
                        className="parent-input"
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
                        className="parent-input"
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
                        className="parent-input"
                        id="chronicIllnesss"
                        name="chronicIllnesss"
                        value={formData.chronicIllnesss}
                        onChange={handleChange}
                        placeholder="Ví dụ: none"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="longTermMedications"
                        className="form-label"
                      >
                        Thuốc sử dụng lâu dài
                      </label>
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
                    <div className="mb-3">
                      <label
                        htmlFor="otherMedicalConditions"
                        className="form-label"
                      >
                        Tình trạng y tế khác
                      </label>
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
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="parent-btn parent-gradient-btn"
                      >
                        <FaPaperPlane /> Gửi khai báo
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Declarations History Table */}
            <div className="table-container mt-4">
              <div className="table-header">
                <h3 className="table-title">
                  <FaHeartbeat className="me-2" />
                  Lịch sử khai báo y tế
                </h3>
              </div>
              <div className="table-responsive">
                <Table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã HS</th>
                      <th>Họ và tên</th>
                      <th>Lớp</th>
                      <th>Ngày khai báo</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declarations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Không có khai báo y tế nào
                        </td>
                      </tr>
                    ) : (
                      declarations.map((declaration) => (
                        <tr key={declaration.id}>
                          <td>{declaration.studentId}</td>
                          <td>{declaration.studentName}</td>
                          <td>{declaration.className}</td>
                          <td>
                            {new Date(
                              declaration.declaredAt
                            ).toLocaleDateString("vi-VN")}
                          </td>
                          <td>{getStatusBadge(declaration.status)}</td>
                          <td>
                            <div className="action-buttons icon-row">
                              <button
                                className="action-btn view-btn"
                                onClick={() => handleViewDetails(declaration)}
                                title="Xem chi tiết"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn confirm-btn"
                                // onClick={() => handleConfirm(declaration)}
                                title="Xác nhận"
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="action-btn reject-btn"
                                // onClick={() => handleReject(declaration)}
                                title="Từ chối"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDeclaration && (
        <div
          className="modal fade show"
          style={{ display: showDetailModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content detail-modal">
              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <FaHeartbeat className="me-2" />
                  Chi tiết khai báo y tế
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h6 className="section-title">
                    <FaUser className="me-2" />
                    Thông tin học sinh
                  </h6>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaUser className="me-2" />
                        Họ và tên
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.studentName}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaIdCard className="me-2" />
                        Mã học sinh
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.studentId}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaGraduationCap className="me-2" />
                        Lớp
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.className}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h6 className="section-title">
                    <FaHeartbeat className="me-2" />
                    Thông tin y tế
                  </h6>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaExclamationTriangle className="me-2" />
                        Dị ứng
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.allergys || "Không có"}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaHeartbeat className="me-2" />
                        Bệnh mãn tính
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.chronicIllnesss || "Không có"}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">
                        <FaPills className="me-2" />
                        Thuốc sử dụng
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.longTermMedications || "Không có"}
                      </div>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">
                        <FaStickyNote className="me-2" />
                        Tình trạng khác
                      </div>
                      <div className="detail-value">
                        {selectedDeclaration.otherMedicalConditions ||
                          "Không có"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  <FaTimes className="me-2" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDeclaration;
