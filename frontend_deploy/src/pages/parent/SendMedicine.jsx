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
import styles from './SendMedicine.module.css';

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

      setSelectedStudentId("");
      setMedicines([{ ...defaultMedicine }]);
      setValidated(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi thuốc. Vui lòng thử lại!");
    } finally {
      setSubmitLoading(false);
    }
  };

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
    <div className={styles.sendMedicineContainer}>
      <Container>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaStethoscope />
            </div>
            <div className={styles.headerText}>
              <h2>Thông tin gửi thuốc</h2>
              <p>
                Vui lòng điền đầy đủ thông tin để đảm bảo học sinh được chăm sóc sức khỏe tốt nhất
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            {/* Student Selection Section */}
            <div className={styles.studentSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <FaUser />
                </div>
                <h3 className={styles.sectionTitle}>Chọn học sinh</h3>
              </div>

              <div className={styles.studentForm}>
                <Form.Label className={styles.formLabel}>
                  <FaGraduationCap />
                  Học sinh cần gửi thuốc
                </Form.Label>
                <Form.Select
                  className={styles.studentSelect}
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
                <div className={styles.studentPreview}>
                  <div className={styles.studentInfo}>
                    <div className={styles.studentInfoItem}>
                      <FaUser />
                      {selectedStudent.studentName}
                    </div>
                    <div className={styles.studentInfoItem}>
                      <FaGraduationCap />
                      Lớp: {selectedStudent.className}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Medicine Section */}
            <div className={styles.medicineSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <FaPills />
                </div>
                <h3 className={styles.sectionTitle}>Thông tin thuốc</h3>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className={styles.medicineCard}>
                  <div className={styles.medicineCardHeader}>
                    <div className={styles.medicineNumber}>
                      <div className={styles.medicineNumberBadge}>
                        {idx + 1}
                      </div>
                      Thuốc số {idx + 1}
                    </div>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeMedicineBtn}
                        onClick={() => handleRemoveMedicine(idx)}
                      >
                        <FaTrash />
                        Xóa thuốc
                      </button>
                    )}
                  </div>

                  <div className={styles.medicineCardBody}>
                    <Row>
                      <Col md={6}>
                        <div className={styles.formGroup}>
                          <Form.Label className={styles.formLabel}>
                            <FaPills />
                            Tên thuốc
                          </Form.Label>
                          <Form.Control
                            className={styles.formControl}
                            type="text"
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
                        <div className={styles.formGroup}>
                          <Form.Label className={styles.formLabel}>
                            <FaClipboardList />
                            Liều dùng
                          </Form.Label>
                          <Form.Control
                            className={styles.formControl}
                            type="text"
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

                    <div className={styles.formGroup}>
                      <Form.Label className={styles.formLabel}>
                        <FaStickyNote />
                        Ghi chú và hướng dẫn
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className={`${styles.formControl} ${styles.textarea}`}
                        placeholder="Nhập hướng dẫn sử dụng, thời gian uống thuốc, lưu ý đặc biệt..."
                        value={med.notes}
                        onChange={(e) => handleMedicineChange(idx, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addMedicineBtn}
                onClick={handleAddMedicine}
              >
                <FaPlusCircle />
                Thêm thuốc khác
              </button>
            </div>
          </Form>

          {/* Submit Section */}
          <div className={styles.submitSection}>
            <button
              type="submit"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitLoading || loading}
            >
              {submitLoading ? (
                <>
                  <FaSpinner />
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
        className={styles.modalContainer}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaCheckCircle />
            Xác nhận gửi thuốc
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <div className={styles.modalAlert}>
            <FaInfoCircle />
            Bạn có chắc chắn muốn gửi thông tin thuốc này? Y tá sẽ xem xét và phản hồi sớm nhất.
          </div>

          {selectedStudent && (
            <div className={styles.modalInfoItem}>
              <strong>Học sinh:</strong> {selectedStudent.studentName} - Lớp {selectedStudent.className}
            </div>
          )}

          <div className={styles.modalInfoItem}>
            <strong>Số loại thuốc:</strong> {medicines.length}
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
            onClick={() => setShowConfirmModal(false)}
          >
            <FaTimesCircle />
            Hủy
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnConfirm}`}
            onClick={confirmSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <FaSpinner />
                Đang gửi...
              </>
            ) : (
              <>
                <FaCheckCircle />
                Xác nhận gửi
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <Spinner animation="border" />
            <h5>Đang tải danh sách học sinh...</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMedicine;
