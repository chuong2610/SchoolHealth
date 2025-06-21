import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Modal,
  Tab,
  Nav
} from "react-bootstrap";
import {
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaHeartbeat,
  FaPaperPlane,
  FaEye,
  FaGraduationCap,
  FaPills,
  FaStickyNote,
  FaStethoscope,
  FaHistory,
  FaClipboardList,
  FaUserMd,
  FaTimesCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../../styles/parent/parent-healthdeclaration-redesign.css";

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
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [declarationHistory, setDeclarationHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('declare');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);

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

    if (!selectedStudent) {
      toast.error("Vui lòng chọn học sinh.");
      hasError = true;
    }
    if (!formData.allergys && !formData.chronicIllnesss && !formData.longTermMedications && !formData.otherMedicalConditions) {
      toast.error("Vui lòng nhập ít nhất một thông tin y tế.");
      hasError = true;
    }
    if (hasError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitLoading(true);

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

      // Reset form
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

      // Cập nhật lại lịch sử
      await fetchDeclarationHistory(parentId, token);

      // Chuyển sang tab lịch sử
      setActiveTab('history');
    } catch (err) {
      toast.error(
        err.response
          ? `Lỗi ${err.response.status}: ${err.response.data.message || "Không thể gửi khai báo."}`
          : "Không thể kết nối đến server."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewDetail = (declaration) => {
    setSelectedDeclaration(declaration);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="health-declaration-page animate-fade-in">
      {/* Hero Header */}
      <div className="health-hero-header animate-slide-in-down">
        <Container>
          <div className="health-hero-content">
            <h1 className="health-hero-title animate-fade-in-up delay-200">
              <div className="hero-medical-icon animate-float">
                <FaClipboardList />
              </div>
              Khai báo sức khỏe học sinh
            </h1>
            <p className="health-hero-subtitle animate-fade-in-up delay-300">
              Khai báo thông tin sức khỏe của học sinh để nhà trường có thể chăm sóc và hỗ trợ tốt nhất cho con bạn
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="health-main-container">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="health-form-wrapper animate-scale-in-center delay-500 animate-card">
              {/* Tab Navigation */}
              <div className="health-tab-navigation">
                <div className="health-nav-pills">
                  <div className="health-nav-item animate-fade-in-up delay-700">
                    <button
                      className={`health-nav-link animate-button-hover ${activeTab === 'declare' ? 'active' : ''}`}
                      onClick={() => setActiveTab('declare')}
                    >
                      <div className="nav-icon animate-scale-hover">
                        <FaHeartbeat />
                      </div>
                      Khai báo mới
                    </button>
                  </div>
                  <div className="health-nav-item animate-fade-in-up delay-1000">
                    <button
                      className={`health-nav-link animate-button-hover ${activeTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveTab('history')}
                    >
                      <div className="nav-icon animate-scale-hover">
                        <FaHistory />
                      </div>
                      Lịch sử khai báo
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="health-tab-content">
                {activeTab === 'declare' && (
                  <Form onSubmit={handleSubmit}>
                    {/* Student Selection Section */}
                    <div className="health-form-section animate-fade-in-up delay-700">
                      <div className="health-section-header">
                        <div className="health-section-icon animate-scale-hover">
                          <FaUser />
                        </div>
                        <h3 className="health-section-title">Chọn học sinh</h3>
                      </div>

                      <div className="health-form-group">
                        <Form.Label className="health-form-label">
                          <FaGraduationCap className="label-medical-icon" />
                          Học sinh cần khai báo
                        </Form.Label>
                        <Form.Select
                          className="health-form-control animate-input"
                          value={formData.studentId}
                          onChange={handleStudentChange}
                          required
                        >
                          <option value="">-- Chọn học sinh --</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.studentName} - {student.className}
                            </option>
                          ))}
                        </Form.Select>
                      </div>

                      {selectedStudent && (
                        <div className="health-student-card animate-scale-in-center delay-200">
                          <div className="health-student-info">
                            <div className="health-student-name">
                              <FaUser />
                              {selectedStudent.studentName}
                            </div>
                            <div className="health-student-class">
                              <FaGraduationCap />
                              Lớp: {selectedStudent.className}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Medical Information Section */}
                    <div className="health-form-section animate-fade-in-up delay-1000">
                      <div className="health-section-header">
                        <div className="health-section-icon animate-scale-hover">
                          <FaStethoscope />
                        </div>
                        <h3 className="health-section-title">Thông tin y tế</h3>
                      </div>

                      <div className="health-medical-grid">
                        <div className="health-medical-field animate-stagger-fade-in animate-lift">
                          <div className="health-form-group">
                            <Form.Label className="health-form-label">
                              <FaExclamationCircle className="label-medical-icon" />
                              Dị ứng
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              className="health-form-control animate-input"
                              name="allergys"
                              value={formData.allergys}
                              onChange={handleChange}
                              placeholder="Mô tả các loại dị ứng của học sinh (nếu có)..."
                            />
                          </div>
                        </div>

                        <div className="health-medical-field animate-stagger-fade-in animate-lift">
                          <div className="health-form-group">
                            <Form.Label className="health-form-label">
                              <FaUserMd className="label-medical-icon" />
                              Bệnh mãn tính
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              className="health-form-control animate-input"
                              name="chronicIllnesss"
                              value={formData.chronicIllnesss}
                              onChange={handleChange}
                              placeholder="Các bệnh mãn tính đang điều trị (nếu có)..."
                            />
                          </div>
                        </div>

                        <div className="health-medical-field animate-stagger-fade-in animate-lift">
                          <div className="health-form-group">
                            <Form.Label className="health-form-label">
                              <FaPills className="label-medical-icon" />
                              Thuốc dài hạn
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              className="health-form-control animate-input"
                              name="longTermMedications"
                              value={formData.longTermMedications}
                              onChange={handleChange}
                              placeholder="Các loại thuốc sử dụng thường xuyên (nếu có)..."
                            />
                          </div>
                        </div>

                        <div className="health-medical-field animate-stagger-fade-in animate-lift">
                          <div className="health-form-group">
                            <Form.Label className="health-form-label">
                              <FaStickyNote className="label-medical-icon" />
                              Tình trạng khác
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              className="health-form-control animate-input"
                              name="otherMedicalConditions"
                              value={formData.otherMedicalConditions}
                              onChange={handleChange}
                              placeholder="Các tình trạng sức khỏe khác cần lưu ý..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="health-submit-area">
                      <button
                        type="submit"
                        className="health-submit-button animate-button-hover animate-scale-hover"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Gửi khai báo
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}

                {activeTab === 'history' && (
                  <>
                    {declarationHistory.length === 0 ? (
                      <div className="health-empty-state animate-fade-in-up">
                        <FaClipboardList size={64} className="health-empty-icon animate-bounce" />
                        <h4 className="health-empty-title animate-fade-in-up delay-200">Chưa có lịch sử khai báo</h4>
                        <p className="health-empty-description animate-fade-in-up delay-300">
                          Bạn chưa thực hiện khai báo y tế nào. Hãy chuyển sang tab "Khai báo mới" để bắt đầu.
                        </p>
                      </div>
                    ) : (
                      <div className="health-table-container animate-fade-in-up animate-lift">
                        <Table responsive className="health-table">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Học sinh</th>
                              <th>Lớp</th>
                              <th>Ngày khai báo</th>
                              <th>Trạng thái</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {declarationHistory.map((item, index) => (
                              <tr key={item.id} className="animate-stagger-fade-in">
                                <td>{index + 1}</td>
                                <td>{item.studentName}</td>
                                <td>{item.className}</td>
                                <td>{formatDate(item.createdAt)}</td>
                                <td>
                                  <div className="health-status-badge animate-pulse">
                                    <FaCheckCircle />
                                    Đã nộp
                                  </div>
                                </td>
                                <td>
                                  <button
                                    className="health-view-button animate-button-hover animate-scale-hover"
                                    onClick={() => handleViewDetail(item)}
                                  >
                                    <FaEye />
                                    Xem chi tiết
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        className="health-modal"
      >
        <div className={showDetailModal ? 'animate-modal-enter' : 'animate-modal-exit'}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaStethoscope className="animate-pulse" />
              Chi tiết khai báo y tế
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDeclaration && (
              <>
                <div className="health-form-section animate-fade-in-up delay-200">
                  <div className="health-section-header">
                    <div className="health-section-icon animate-scale-hover">
                      <FaUser />
                    </div>
                    <h5 className="health-section-title">Thông tin học sinh</h5>
                  </div>
                  <div className="health-info-grid">
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Họ tên:</div>
                      <div className="health-info-value">{selectedDeclaration.studentName}</div>
                    </div>
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Lớp:</div>
                      <div className="health-info-value">{selectedDeclaration.className}</div>
                    </div>
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Ngày khai báo:</div>
                      <div className="health-info-value">{formatDate(selectedDeclaration.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="health-form-section animate-fade-in-up delay-500">
                  <div className="health-section-header">
                    <div className="health-section-icon animate-scale-hover">
                      <FaStethoscope />
                    </div>
                    <h5 className="health-section-title">Thông tin y tế</h5>
                  </div>
                  <div className="health-info-grid">
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Dị ứng:</div>
                      <div className="health-info-value">{selectedDeclaration.allergys || 'Không có'}</div>
                    </div>
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Bệnh mãn tính:</div>
                      <div className="health-info-value">{selectedDeclaration.chronicIllnesss || 'Không có'}</div>
                    </div>
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Thuốc dài hạn:</div>
                      <div className="health-info-value">{selectedDeclaration.longTermMedications || 'Không có'}</div>
                    </div>
                    <div className="health-info-item animate-stagger-fade-in">
                      <div className="health-info-label">Tình trạng khác:</div>
                      <div className="health-info-value">{selectedDeclaration.otherMedicalConditions || 'Không có'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="health-modal-button animate-button-hover"
              onClick={() => setShowDetailModal(false)}
            >
              <FaTimesCircle />
              Đóng
            </button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <div className="health-loading-overlay animate-backdrop-enter">
          <div className="health-loading-card animate-scale-in-center">
            <Spinner animation="border" className="health-loading-spinner animate-spin" />
            <h5 className="health-loading-text animate-fade-in-up delay-300">Đang tải danh sách học sinh...</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDeclaration;
