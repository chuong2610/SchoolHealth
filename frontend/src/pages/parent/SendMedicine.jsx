import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Card,
  Alert,
  Modal,
  Spinner
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getStudentListByParentId,
  sendMedicineApi,
} from "../../api/parent/medicineApi";
import {
  FaUser,
  FaCalendarAlt,
  FaPills,
  FaCheckCircle,
  FaPlusCircle,
  FaTrash,
  FaPaperPlane,
  FaStethoscope,
  FaUserMd,
  FaClipboardList,
  FaExclamationTriangle,
  FaInfoCircle,
  FaGraduationCap,
  FaStickyNote,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
// Styles được import từ main.jsx

const defaultMedicine = {
  medicineName: "",
  dosage: "",
  notes: "",
};

const SendMedicine = () => {
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
      console.log("Server response: ", res);

      toast.success("Gửi thuốc thành công! Y tá sẽ xem xét và phản hồi sớm nhất.");

      // Reset form
      setSelectedStudentId("");
      setMedicines([{ ...defaultMedicine }]);
      setValidated(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi thuốc. Vui lòng thử lại!");
      console.error("Gửi thuốc thất bại:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fetch student list when component mounts
  useEffect(() => {
    const fetchStudentList = async () => {
      setLoading(true);
      try {
        const res = await getStudentListByParentId();
        setStudents(res || []);
      } catch (error) {
        console.log("Lỗi fetchStudentList:", error);
        toast.error("Không thể tải danh sách học sinh!");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentList();
  }, []);

  const selectedStudent = students.find(student => student.id.toString() === selectedStudentId);

  return (
    <div
      className="parent-theme send-medicine-page"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh"
      }}
    >
      {/* Professional CSS Override */}
      <style>
        {`
          .send-medicine-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
          }
          
          .medicine-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .medicine-header::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
            pointer-events: none !important;
          }
          
          .header-content {
            position: relative !important;
            z-index: 2 !important;
            text-align: center !important;
          }
          
          .page-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 1rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1rem !important;
          }
          
          .page-subtitle {
            font-size: 1.2rem !important;
            opacity: 0.95 !important;
            margin: 0 !important;
            font-weight: 400 !important;
          }
          
          .form-container {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
            margin: 0 1rem !important;
          }
          
          .form-header {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-bottom: 3px solid #e5e7eb !important;
          }
          
          .form-title {
            font-size: 1.8rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .form-description {
            color: #6b7280 !important;
            margin: 0.5rem 0 0 0 !important;
            font-size: 1rem !important;
          }
          
          .form-body {
            padding: 2rem !important;
          }
          
          .form-section {
            margin-bottom: 2rem !important;
            padding: 1.5rem !important;
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            transition: all 0.3s ease !important;
          }
          
          .form-section:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1) !important;
          }
          
          .section-title {
            font-size: 1.3rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1.5rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            padding-bottom: 0.75rem !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          
          .section-icon {
            width: 35px !important;
            height: 35px !important;
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            color: white !important;
            border-radius: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1rem !important;
          }
          
          .form-group-enhanced {
            margin-bottom: 1.5rem !important;
          }
          
          .form-label-enhanced {
            font-weight: 600 !important;
            color: #374151 !important;
            margin-bottom: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            font-size: 0.95rem !important;
          }
          
          .form-control-enhanced {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 0.75rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
          }
          
          .form-control-enhanced:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .form-control-enhanced.is-invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
          }
          
          .student-info-card {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
            border: 2px solid #3b82f6 !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            margin-top: 1rem !important;
          }
          
          .student-name {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            color: #1e40af !important;
            margin-bottom: 0.5rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .student-class {
            font-size: 1rem !important;
            color: #3730a3 !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .medicine-card {
            background: white !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            margin-bottom: 1.5rem !important;
            transition: all 0.3s ease !important;
            position: relative !important;
          }
          
          .medicine-card:hover {
            border-color: #f59e0b !important;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.1) !important;
          }
          
          .medicine-card::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 4px !important;
            background: linear-gradient(90deg, #f59e0b, #fbbf24) !important;
            border-radius: 16px 16px 0 0 !important;
          }
          
          .medicine-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 1.5rem !important;
          }
          
          .medicine-number {
            background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
            color: white !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 700 !important;
            font-size: 1.1rem !important;
          }
          
          .remove-medicine-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            border: none !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .remove-medicine-btn:hover {
            background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
          }
          
          .add-medicine-btn {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            border: none !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            margin: 1.5rem auto 0 auto !important;
          }
          
          .add-medicine-btn:hover {
            background: linear-gradient(135deg, #059669, #047857) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3) !important;
          }
          
          .submit-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-top: 3px solid #e5e7eb !important;
            text-align: center !important;
          }
          
          .submit-btn {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 1rem 3rem !important;
            border-radius: 25px !important;
            font-weight: 700 !important;
            font-size: 1.1rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .submit-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3) !important;
          }
          
          .submit-btn:disabled {
            background: #9ca3af !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
          }
          
          .loading-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.5) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
          }
          
          .loading-content {
            background: white !important;
            padding: 2rem !important;
            border-radius: 16px !important;
            text-align: center !important;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3) !important;
          }
          
          .loading-spinner {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 1rem !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            
            .form-container {
              margin: 0 0.5rem !important;
            }
            
            .form-header,
            .form-body,
            .submit-section {
              padding: 1.5rem !important;
            }
            
            .medicine-header {
              flex-direction: column !important;
              gap: 1rem !important;
            }
            
            .submit-btn {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="medicine-header">
        <Container>
          <div className="header-content">
            <h1 className="page-title">
              <FaPills />
              Gửi thuốc cho học sinh
            </h1>
            <p className="page-subtitle">
              Gửi thông tin thuốc và hướng dẫn sử dụng để nhà trường hỗ trợ tốt nhất
            </p>
          </div>
        </Container>
      </div>

      {/* Main Form */}
      <Container>
        <Card className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              <FaStethoscope className="section-icon" style={{ width: 'auto', height: 'auto', background: 'none', color: '#2563eb' }} />
              Thông tin gửi thuốc
            </h2>
            <p className="form-description">
              Vui lòng điền đầy đủ thông tin để đảm bảo học sinh được chăm sóc tốt nhất
            </p>
          </div>

          <div className="form-body">
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
              {/* Student Selection Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <div className="section-icon">
                    <FaUser />
                  </div>
                  Chọn học sinh
                </h3>

                <div className="form-group-enhanced">
                  <Form.Label className="form-label-enhanced">
                    <FaGraduationCap />
                    Học sinh cần gửi thuốc
                  </Form.Label>
                  <Form.Select
                    className="form-control-enhanced"
                    value={selectedStudentId || ""}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">-- Chọn học sinh --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.studentName} (Mã: {student.id}, Lớp: {student.className})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Vui lòng chọn học sinh
                  </Form.Control.Feedback>
                </div>

                {selectedStudent && (
                  <div className="student-info-card">
                    <div className="student-name">
                      <FaUser />
                      {selectedStudent.studentName}
                    </div>
                    <div className="student-class">
                      <FaGraduationCap />
                      Lớp: {selectedStudent.className}
                    </div>
                  </div>
                )}
              </div>

              {/* Medicine Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <div className="section-icon">
                    <FaPills />
                  </div>
                  Thông tin thuốc
                </h3>

                {medicines.map((med, idx) => (
                  <div key={idx} className="medicine-card">
                    <div className="medicine-header">
                      <div className="medicine-number">
                        {idx + 1}
                      </div>
                      {medicines.length > 1 && (
                        <Button
                          type="button"
                          className="remove-medicine-btn"
                          onClick={() => handleRemoveMedicine(idx)}
                        >
                          <FaTrash />
                          Xóa thuốc
                        </Button>
                      )}
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="form-group-enhanced">
                          <Form.Label className="form-label-enhanced">
                            <FaPills />
                            Tên thuốc
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control-enhanced"
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
                        <div className="form-group-enhanced">
                          <Form.Label className="form-label-enhanced">
                            <FaClipboardList />
                            Liều dùng
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control-enhanced"
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

                    <div className="form-group-enhanced">
                      <Form.Label className="form-label-enhanced">
                        <FaStickyNote />
                        Ghi chú và hướng dẫn
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className="form-control-enhanced"
                        placeholder="Nhập hướng dẫn sử dụng, thời gian uống thuốc, lưu ý đặc biệt..."
                        value={med.notes}
                        onChange={(e) => handleMedicineChange(idx, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  className="add-medicine-btn"
                  onClick={handleAddMedicine}
                >
                  <FaPlusCircle />
                  Thêm thuốc khác
                </Button>
              </div>
            </Form>
          </div>

          <div className="submit-section">
            <Button
              type="submit"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitLoading || loading}
            >
              {submitLoading ? (
                <>
                  <FaSpinner className="fa-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Gửi thuốc
                </>
              )}
            </Button>
          </div>
        </Card>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle className="text-success me-2" />
            Xác nhận gửi thuốc
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <FaInfoCircle className="me-2" />
            Bạn có chắc chắn muốn gửi thông tin thuốc này? Y tá sẽ xem xét và phản hồi sớm nhất.
          </Alert>

          {selectedStudent && (
            <div className="mb-3">
              <strong>Học sinh:</strong> {selectedStudent.studentName} - Lớp {selectedStudent.className}
            </div>
          )}

          <div>
            <strong>Số loại thuốc:</strong> {medicines.length}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            <FaTimesCircle className="me-1" />
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmSubmit} disabled={submitLoading}>
            {submitLoading ? (
              <>
                <FaSpinner className="fa-spin me-1" />
                Đang gửi...
              </>
            ) : (
              <>
                <FaCheckCircle className="me-1" />
                Xác nhận gửi
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Spinner animation="border" className="loading-spinner" />
            <h5>Đang tải danh sách học sinh...</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMedicine;
