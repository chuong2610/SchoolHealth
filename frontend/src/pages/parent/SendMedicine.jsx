import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Alert,
  Modal,
  Spinner
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getStudentListByParentId,
  sendMedicineApi,
} from "../../api/parent/medicineApi";
import {
  FaUser,
  FaPills,
  FaCheckCircle,
  FaPlusCircle,
  FaTrash,
  FaPaperPlane,
  FaStethoscope,
  FaClipboardList,
  FaInfoCircle,
  FaGraduationCap,
  FaStickyNote,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import "../../styles/parent/parent-sendmedicine-redesign.css";

const defaultMedicine = {
  medicineName: "",
  dosage: "",
  notes: "",
};

const SendMedicine = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [medicines, setMedicines] = useState([{ ...defaultMedicine }]);
  const [validated, setValidated] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleMedicineChange = (idx, field, value) => {
    setMedicines((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { ...defaultMedicine }]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    let hasError = false;

    if (!selectedStudentId) {
      toast.error("Vui lòng chọn học sinh.");
      hasError = true;
    }

    medicines.forEach((med, idx) => {
      if (!med.medicineName.trim()) {
        toast.error(`Vui lòng nhập tên thuốc thứ ${idx + 1}!`);
        hasError = true;
      }
      if (!med.dosage.trim()) {
        toast.error(`Vui lòng nhập liều dùng cho thuốc thứ ${idx + 1}!`);
        hasError = true;
      }
    });

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setValidated(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setSubmitLoading(true);
    setShowConfirmModal(false);

    try {
      const data = {
        studentId: Number(selectedStudentId),
        medicines,
      };

      const res = await sendMedicineApi(data);

      toast.success("Gửi thuốc thành công! Y tá sẽ xem xét và phản hồi sớm nhất.");

      // Reset form
      setSelectedStudentId("");
      setMedicines([{ ...defaultMedicine }]);
      setValidated(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi thuốc. Vui lòng thử lại!");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fetch student list when component mounts
  useEffect(() => {
    const fetchStudentList = async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      try {
        const res = await getStudentListByParentId(user.id);
        setStudents(res || []);
      } catch (error) {
        toast.error("Không thể tải danh sách học sinh!");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentList();
  }, [user?.id]);

  const selectedStudent = students.find(student => student.id.toString() === selectedStudentId);

  return (
    <div className="send-medicine-page animate-fade-in">
      {/* Hero Header */}
      {/* <div className="medicine-hero-header animate-slide-in-down">
        <Container>
          <div className="hero-sen-content text-center">
            <h1 className="hero-sen-title animate-fade-in-up delay-200">
              <div className="hero-icon ">
                <FaPills />
              </div>
              Gửi thuốc cho học sinh
            </h1>
            <p className="hero-sen-subtitle  animate-fade-in-up delay-300">
              Gửi thông tin thuốc và hướng dẫn sử dụng để nhà trường hỗ trợ tốt nhất cho con bạn
            </p>
          </div>
        </Container>
      </div> */}

      {/* Main Content */}
      <Container className="medicine-main-container ">
        <div className="medicine-form-wrapper animate-scale-in-center delay-500 animate-card" style={{ backgroundColor: 'white', padding: '1rem', marginTop: '-2rem', border: '1px solid #2563eb', borderRadius: '10px' }}>
          {/* Form Header */}
          <div className="form-header-section">
            <h2 className="form-main-title">
              <div className="title-icon">
                <FaStethoscope />
              </div>
              Thông tin gửi thuốc
            </h2>
            <p className="form-description-text">
              Vui lòng điền đầy đủ thông tin để đảm bảo học sinh được chăm sóc sức khỏe tốt nhất
            </p>
          </div>

          {/* Form Body */}
          <div className="form-body-section">
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
              {/* Student Selection Section */}
              <div className="info-section animate-fade-in-up delay-700">
                <div className="section-header">
                  <div className="section-icon-wrapper animate-scale-hover">
                    <FaUser />
                  </div>
                  <h3 className="section-title-text">Chọn học sinh</h3>
                </div>

                <div className="enhanced-form-group">
                  <Form.Label className="enhanced-label">
                    <FaGraduationCap className="label-icon" />
                    Học sinh cần gửi thuốc
                  </Form.Label>
                  <Form.Select
                    className="enhanced-control animate-input"
                    value={selectedStudentId || ""}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">-- Chọn học sinh --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.studentName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn học sinh
                  </Form.Control.Feedback>
                </div>

                {selectedStudent && (
                  <div className="student-display-card animate-scale-in-center delay-200">
                    <div className="student-info-row">
                      <div className="student-name-display">
                        <FaUser />
                        {selectedStudent.studentName}
                      </div>
                      <div className="student-class-display">
                        <FaGraduationCap />
                        Lớp: {selectedStudent.className}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Medicine Information Section */}
              <div className="info-section animate-fade-in-up delay-1000">
                <div className="section-header">
                  <div className="section-icon-wrapper animate-scale-hover">
                    <FaPills />
                  </div>
                  <h3 className="section-title-text">Thông tin thuốc</h3>
                </div>

                {medicines.map((med, idx) => (
                  <div key={idx} className="medicine-item-card animate-stagger-fade-in animate-lift">
                    <div className="medicine-card-header">
                      <div className="medicine-number-badge animate-pulse">
                        {idx + 1}
                      </div>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          className="remove-medicine-button animate-button-hover"
                          onClick={() => handleRemoveMedicine(idx)}
                        >
                          <FaTrash />
                          Xóa thuốc
                        </button>
                      )}
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="enhanced-form-group">
                          <Form.Label className="enhanced-label">
                            <FaPills className="label-icon" />
                            Tên thuốc
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="enhanced-control animate-input"
                            placeholder="VD: Paracetamol, Amoxicillin..."
                            value={med.medicineName}
                            onChange={(e) => handleMedicineChange(idx, "medicineName", e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập tên thuốc
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="enhanced-form-group">
                          <Form.Label className="enhanced-label">
                            <FaClipboardList className="label-icon" />
                            Liều dùng
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="enhanced-control animate-input"
                            placeholder="VD: 1 viên/lần, 2 lần/ngày"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập liều dùng
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Row>

                    <div className="enhanced-form-group">
                      <Form.Label className="enhanced-label">
                        <FaStickyNote className="label-icon" />
                        Ghi chú và hướng dẫn
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="enhanced-control animate-input"
                        placeholder="Nhập hướng dẫn sử dụng, thời gian uống thuốc, lưu ý đặc biệt..."
                        value={med.notes}
                        onChange={(e) => handleMedicineChange(idx, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-medicine-button animate-button-hover animate-lift"
                  onClick={handleAddMedicine}
                >
                  <FaPlusCircle />
                  Thêm thuốc khác
                </button>
              </div>
            </Form>
          </div>

          {/* Submit Section */}
          <div className="submit-area">
            <button
              type="submit"
              className="primary-submit-button animate-button-hover animate-scale-hover"
              onClick={handleSubmit}
              disabled={submitLoading || loading}
            >
              {submitLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Gửi thuốc
                </>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        size="md"
        centered
        className="confirmation-modal"
      >
        <div className={showConfirmModal ? 'animate-modal-enter' : 'animate-modal-exit'}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCheckCircle style={{ color: '#059669' }} className="animate-pulse" />
              Xác nhận gửi thuốc
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info" className="mb-3 animate-fade-in-up delay-200">
              <FaInfoCircle className="me-2" />
              Bạn có chắc chắn muốn gửi thông tin thuốc này? Y tá sẽ xem xét và phản hồi sớm nhất.
            </Alert>

            {selectedStudent && (
              <div className="mb-3 animate-fade-in-up delay-300">
                <strong>Học sinh:</strong> {selectedStudent.studentName} - Lớp {selectedStudent.className}
              </div>
            )}

            <div className="animate-fade-in-up delay-500">
              <strong>Số loại thuốc:</strong> {medicines.length}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="modal-button-secondary animate-button-hover"
              onClick={() => setShowConfirmModal(false)}
            >
              <FaTimesCircle className="me-1" />
              Hủy
            </button>
            <button
              className="modal-button-primary animate-button-hover animate-scale-hover"
              onClick={confirmSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <FaSpinner className="animate-spin me-1" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-1" />
                  Xác nhận gửi
                </>
              )}
            </button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <div className="page-loading-overlay animate-backdrop-enter">
          <div className="loading-card animate-scale-in-center">
            <Spinner animation="border" className="loading-spinner-large animate-spin" />
            <h5 className="loading-text animate-fade-in-up delay-300">Đang tải danh sách học sinh...</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMedicine;
