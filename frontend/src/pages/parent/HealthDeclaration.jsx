import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
  Modal,
  Tab,
  Nav
} from "react-bootstrap";
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
  FaStethoscope,
  FaHistory,
  FaClipboardList,
  FaUserMd,
  FaShieldAlt,
  FaTimesCircle,
  FaInfoCircle
} from "react-icons/fa";
// Styles được import từ main.jsx
import { toast } from "react-toastify";

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
    <div className="parent-theme animate-fade-in-up">
      <div className="parent-page-header">
        <Container>
          <div className="parent-header-content">
            <h1 className="parent-page-title">
              <FaClipboardList />
              Khai báo y tế
            </h1>
            <p className="parent-page-subtitle">
              Khai báo thông tin sức khỏe của học sinh để nhà trường có thể chăm sóc tốt nhất
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="parent-card">
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="pills" className="parent-nav-tabs justify-content-center">
                  <Nav.Item>
                    <Nav.Link eventKey="declare">
                      <FaHeartbeat />
                      Khai báo mới
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="history">
                      <FaHistory />
                      Lịch sử khai báo
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="parent-card-body">
                  <Tab.Pane eventKey="declare">
                    <Form onSubmit={handleSubmit}>
                      {/* Student Selection Section */}
                      <div className="parent-form-section">
                        <h3 className="parent-section-title">
                          <div className="parent-section-icon">
                            <FaUser />
                          </div>
                          Chọn học sinh
                        </h3>

                        <div className="parent-form-group">
                          <Form.Label className="parent-form-label">
                            <FaGraduationCap />
                            Học sinh
                          </Form.Label>
                          <Form.Select
                            className="parent-form-control"
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
                          <div className="parent-student-card">
                            <div className="parent-student-name">
                              <FaUser />
                              {selectedStudent.studentName}
                            </div>
                            <div className="parent-student-class">
                              <FaGraduationCap />
                              Lớp: {selectedStudent.className}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Medical Information Section */}
                      <div className="parent-form-section">
                        <h3 className="parent-section-title">
                          <div className="parent-section-icon">
                            <FaStethoscope />
                          </div>
                          Thông tin y tế
                        </h3>

                        <Row>
                          <Col md={6}>
                            <div className="parent-form-group">
                              <Form.Label className="parent-form-label">
                                <FaExclamationCircle />
                                Dị ứng
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                className="parent-form-control"
                                name="allergys"
                                value={formData.allergys}
                                onChange={handleChange}
                                placeholder="Mô tả các loại dị ứng (nếu có)..."
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="parent-form-group">
                              <Form.Label className="parent-form-label">
                                <FaUserMd />
                                Bệnh mãn tính
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                className="parent-form-control"
                                name="chronicIllnesss"
                                value={formData.chronicIllnesss}
                                onChange={handleChange}
                                placeholder="Các bệnh mãn tính đang điều trị (nếu có)..."
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <div className="parent-form-group">
                              <Form.Label className="parent-form-label">
                                <FaPills />
                                Thuốc dài hạn
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                className="parent-form-control"
                                name="longTermMedications"
                                value={formData.longTermMedications}
                                onChange={handleChange}
                                placeholder="Các loại thuốc sử dụng thường xuyên (nếu có)..."
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="parent-form-group">
                              <Form.Label className="parent-form-label">
                                <FaStickyNote />
                                Tình trạng khác
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                className="parent-form-control"
                                name="otherMedicalConditions"
                                value={formData.otherMedicalConditions}
                                onChange={handleChange}
                                placeholder="Các tình trạng sức khỏe khác cần lưu ý..."
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* Submit Section */}
                      <div className="text-center mt-4">
                        <Button
                          type="submit"
                          className="parent-btn parent-btn-primary parent-btn-lg"
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane />
                              Gửi khai báo
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="history">
                    {declarationHistory.length === 0 ? (
                      <div className="text-center py-5">
                        <FaClipboardList size={64} className="text-muted mb-3" />
                        <h4 className="text-muted">Chưa có lịch sử khai báo</h4>
                        <p className="text-muted">Bạn chưa thực hiện khai báo y tế nào.</p>
                      </div>
                    ) : (
                      <div className="parent-table-container">
                        <Table responsive className="parent-table">
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
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.studentName}</td>
                                <td>{item.className}</td>
                                <td>{formatDate(item.createdAt)}</td>
                                <td>
                                  <Badge className="parent-status-badge completed">
                                    <FaCheckCircle />
                                    Đã nộp
                                  </Badge>
                                </td>
                                <td>
                                  <Button
                                    size="sm"
                                    className="parent-btn parent-btn-primary parent-btn-sm"
                                    onClick={() => handleViewDetail(item)}
                                  >
                                    <FaEye />
                                    Xem chi tiết
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        className="parent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStethoscope />
            Chi tiết khai báo y tế
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDeclaration && (
            <>
              <div className="parent-form-section">
                <h5 className="parent-section-title">
                  <div className="parent-section-icon">
                    <FaUser />
                  </div>
                  Thông tin học sinh
                </h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Họ tên:</strong> {selectedDeclaration.studentName}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Lớp:</strong> {selectedDeclaration.className}</p>
                  </Col>
                </Row>
                <p><strong>Ngày khai báo:</strong> {formatDate(selectedDeclaration.createdAt)}</p>
              </div>

              <div className="parent-form-section">
                <h5 className="parent-section-title">
                  <div className="parent-section-icon">
                    <FaStethoscope />
                  </div>
                  Thông tin y tế
                </h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Dị ứng:</strong> {selectedDeclaration.allergys || 'Không có'}</p>
                    <p><strong>Bệnh mãn tính:</strong> {selectedDeclaration.chronicIllnesss || 'Không có'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Thuốc dài hạn:</strong> {selectedDeclaration.longTermMedications || 'Không có'}</p>
                    <p><strong>Tình trạng khác:</strong> {selectedDeclaration.otherMedicalConditions || 'Không có'}</p>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="parent-btn parent-btn-secondary"
            onClick={() => setShowDetailModal(false)}
          >
            <FaTimesCircle />
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HealthDeclaration;
