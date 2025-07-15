import React, { useEffect, useState } from "react";
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
  Nav,
  Card,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import healthBgImage from "../../assets/nenkhaibaoyte.jpg";
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
  FaTimesCircle,
  FaCalendarAlt,
  FaInfoCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSort,
  FaDownload,
  FaPrint,
  FaBell,
  FaShieldAlt,
  FaThermometerHalf,
  FaAllergies,
  FaPrescriptionBottle,
  FaNotesMedical,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

import { StudentProfileDeclarationHistory } from "../../api/parent/HealthDeclarationApi";
import { formatDateTime, formatDDMMYYYY } from "../../utils/dateFormatter";
import PaginationBar from "../../components/common/PaginationBar";
import styles from "./HealthDeclaration.module.css";

const HealthDeclaration = () => {
  const { user } = useAuth();
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
  const [declarationHistory, setDeclarationHistory] = useState({});
  const [activeTab, setActiveTab] = useState("declare");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showQuickStats, setShowQuickStats] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;

      try {
        const parentId = user.id;
        const response = await axiosInstance.get(
          `/Students/by-parent/${parentId}`
        );
        setStudents(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.statusText ||
          "Không thể tải danh sách học sinh. Vui lòng thử lại sau."
        );
        setStudents([]);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user?.id]);

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

  // Hàm fetch lịch sử khai báo y tế
  const fetchDeclarationHistory = async (studentId) => {
    if (!studentId) {
      return;
    }
    try {
      // TODO: Backend endpoint not implemented yet
      const res = await StudentProfileDeclarationHistory(studentId);
      if (res) {
        setDeclarationHistory(res || {});
      } else {
        // Temporarily set empty array until backend endpoint is implemented
        setDeclarationHistory({});
      }

      // Declaration history feature is temporarily disabled - backend endpoint not implemented
    } catch (err) {
      setDeclarationHistory({});
    }
  };

  useEffect(() => {
    if (selectedStudent?.id) {
      fetchDeclarationHistory(selectedStudent?.id);
    }
  }, [currentPage]);

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
    if (
      !formData.allergys &&
      !formData.chronicIllnesss &&
      !formData.longTermMedications &&
      !formData.otherMedicalConditions
    ) {
      toast.error("Vui lòng nhập ít nhất một thông tin y tế.");
      hasError = true;
    }
    if (hasError) {
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    console.log("Data to submit:", dataToSubmit);

    try {
      const response = await axiosInstance.post(
        "/StudentProfile/declare",
        dataToSubmit
      );

      if (response.data.success) {
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
        // setSelectedStudent(null);

        // Cập nhật lại lịch sử
        setCurrentPage(1);
        await fetchDeclarationHistory(selectedStudent?.id);

        // Chuyển sang tab lịch sử
        setActiveTab("history");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(response.data.message || "Không thể gửi khai báo.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.statusText ||
        "Không thể kết nối đến server."
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

  // // Tính toán thống kê nhanh
  // const getQuickStats = () => {
  //   const totalDeclarations = declarationHistory.length;
  //   const recentDeclarations = declarationHistory.filter(item => {
  //     const declarationDate = new Date(item.declarationDate);
  //     const thirtyDaysAgo = new Date();
  //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  //     return declarationDate >= thirtyDaysAgo;
  //   }).length;

  //   const studentsWithAllergies = declarationHistory.filter(item =>
  //     item.allergys && item.allergys !== "none"
  //   ).length;

  //   const studentsWithChronicIllness = declarationHistory.filter(item =>
  //     item.chronicIllnesss && item.chronicIllnesss !== "none"
  //   ).length;

  //   return {
  //     total: totalDeclarations,
  //     recent: recentDeclarations,
  //     allergies: studentsWithAllergies,
  //     chronicIllness: studentsWithChronicIllness
  //   };
  // };

  // const stats = getQuickStats();

  // // Lọc dữ liệu theo search và filter
  // const filteredHistory = declarationHistory.filter(item => {
  //   const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.className.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = filterStatus === "all" ||
  //     (filterStatus === "allergies" && item.allergys && item.allergys !== "none") ||
  //     (filterStatus === "chronic" && item.chronicIllnesss && item.chronicIllnesss !== "none");

  //   return matchesSearch && matchesFilter;
  // });

  return (
    <div className={styles.healthDeclarationContainer}>
      {/* Compact Header */}
      {/* <div className={styles.healthCompactHeader}>
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6}>
              <div className={styles.healthHeaderContent}>
                <h2 className={styles.healthHeaderTitle}>
                  <FaClipboardList className={styles.healthHeaderIcon} />
                  Khai báo sức khỏe học sinh
                </h2>
                <p className={styles.healthHeaderSubtitle}>
                  Quản lý thông tin sức khỏe của con bạn
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.healthHeaderActions}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowQuickStats(!showQuickStats)}
                >
                  <FaInfoCircle /> {showQuickStats ? 'Ẩn' : 'Hiện'} thống kê
                </Button>
                <Button variant="outline-success" size="sm">
                  <FaDownload /> Xuất báo cáo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div> */}

      {/* Quick Stats Section */}
      {/* {showQuickStats && (
        <div className={styles.quickStatsSection}>

        </div>
      )} */}

      {/* Main Content */}
      <div className={styles.mainContentContainer}>
        <Row>
          <Col>
            <Card className={styles.mainCard}>
              <Card.Header className={styles.cardHeader}>
                <div className={styles.tabNavigation}>
                  <button
                    className={`${styles.tabButton} ${activeTab === "declare" ? styles.active : ""}`}
                    onClick={() => setActiveTab("declare")}
                  >
                    <FaPlus /> Khai báo mới
                  </button>
                  <button
                    className={`${styles.tabButton} ${activeTab === "history" ? styles.active : ""}`}
                    onClick={() => {
                      setActiveTab("history");
                      fetchDeclarationHistory(selectedStudent?.id);
                    }}
                  >
                    <FaHistory /> Lịch sử khai báo
                  </button>
                </div>
              </Card.Header>

              <Card.Body className={styles.cardBody}>
                {activeTab === "declare" && (
                  <Row>
                    <Col lg={8}>
                      <Form onSubmit={handleSubmit}>
                        {/* Student Selection */}
                        <Card className={styles.studentSelectionCard}>
                          <Card.Header className={styles.studentSelectionHeader}>
                            <h5><FaUser /> Chọn học sinh</h5>
                          </Card.Header>
                          <Card.Body className={styles.studentSelectionBody}>
                            <Row>
                              <Col md={8}>
                                <Form.Group className={styles.formGroup}>
                                  <Form.Label className={styles.formLabel}>Học sinh cần khai báo</Form.Label>
                                  <Form.Select
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
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                {selectedStudent && (
                                  <div className={styles.studentPreview}>
                                    <div className={styles.studentAvatar}>
                                      <FaUser />
                                    </div>
                                    <div className={styles.studentInfo}>
                                      <h6>{selectedStudent.studentName}</h6>
                                      <Badge bg="primary">{selectedStudent.className}</Badge>
                                    </div>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>

                        {/* Medical Information */}
                        <Card className={styles.medicalInfoCard}>
                          <Card.Header className={styles.medicalInfoHeader}>
                            <h5><FaStethoscope /> Thông tin y tế</h5>
                          </Card.Header>
                          <Card.Body className={styles.medicalInfoBody}>
                            <Row>
                              <Col md={6}>
                                <Form.Group className={styles.formGroup}>
                                  <Form.Label className={styles.formLabel}>
                                    <FaAllergies />
                                    Dị ứng
                                  </Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="allergys"
                                    value={formData.allergys}
                                    onChange={handleChange}
                                    placeholder="Mô tả các loại dị ứng..."
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className={styles.formGroup}>
                                  <Form.Label className={styles.formLabel}>
                                    <FaThermometerHalf />
                                    Bệnh mãn tính
                                  </Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="chronicIllnesss"
                                    value={formData.chronicIllnesss}
                                    onChange={handleChange}
                                    placeholder="Các bệnh mãn tính..."
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className={styles.formGroup}>
                                  <Form.Label className={styles.formLabel}>
                                    <FaPrescriptionBottle />
                                    Thuốc dài hạn
                                  </Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="longTermMedications"
                                    value={formData.longTermMedications}
                                    onChange={handleChange}
                                    placeholder="Các loại thuốc sử dụng..."
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className={styles.formGroup}>
                                  <Form.Label className={styles.formLabel}>
                                    <FaNotesMedical />
                                    Tình trạng khác
                                  </Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="otherMedicalConditions"
                                    value={formData.otherMedicalConditions}
                                    onChange={handleChange}
                                    placeholder="Tình trạng sức khỏe khác..."
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className={styles.submitButtonContainer}>
                              <Button
                                type="submit"
                                className={styles.submitButton}
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
                          </Card.Body>
                        </Card>
                      </Form>
                    </Col>

                    <Col lg={4}>
                      <Card className={styles.guidelinesCard}>
                        <Card.Header className={styles.guidelinesHeader}>
                          <h6><FaInfoCircle /> Hướng dẫn</h6>
                        </Card.Header>
                        <Card.Body className={styles.guidelinesBody}>
                          <div className={styles.guidelineItem}>
                            <FaCheckCircle />
                            <div>
                              <strong>Khai báo đầy đủ:</strong>
                              <p>Điền đầy đủ thông tin để nhà trường có thể chăm sóc tốt nhất</p>
                            </div>
                          </div>
                          <div className={styles.guidelineItem}>
                            <FaBell />
                            <div>
                              <strong>Cập nhật thường xuyên:</strong>
                              <p>Thông báo ngay khi có thay đổi về tình trạng sức khỏe</p>
                            </div>
                          </div>
                          <div className={styles.guidelineItem}>
                            <FaShieldAlt />
                            <div>
                              <strong>Bảo mật thông tin:</strong>
                              <p>Thông tin y tế được bảo mật tuyệt đối</p>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                {activeTab === "history" && (
                  <div className={styles.historySection}>
                    {/* Student Selection Section */}
                    <div className={styles.historyStudentSelection}>
                      <div className={styles.historyStudentHeader}>
                        <div className={styles.historyStudentIcon}>
                          <FaUser />
                        </div>
                        <h3 className={styles.historyStudentTitle}>Chọn học sinh</h3>
                      </div>
                      <div className={styles.historyStudentForm}>
                        <Form.Label className={styles.historyStudentFormLabel}>
                          <FaGraduationCap />
                          Học sinh
                        </Form.Label>
                        <Form.Select
                          className={styles.historyStudentSelect}
                          value={selectedStudent?.id}
                          onChange={(e) => {
                            handleStudentChange(e);
                            fetchDeclarationHistory(e.target.value);
                          }}
                          required
                        >
                          <option value="">-- Chọn học sinh --</option>
                          {students.map((student, idx) => (
                            <option key={idx} value={student.id}>
                              {student.studentName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      {selectedStudent && (
                        <div className={styles.historyStudentPreview}>
                          <div className={styles.historyStudentInfo}>
                            <div className={styles.historyStudentInfoItem}>
                              <FaUser />
                              {selectedStudent.studentName}
                            </div>
                            <div className={styles.historyStudentInfoItem}>
                              <FaGraduationCap />
                              Lớp: {selectedStudent.className}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {declarationHistory.length === 0 ? (
                      <div className={styles.emptyState}>
                        <FaClipboardList
                          size={64}
                          className={styles.emptyStateIcon}
                        />
                        <h4 className={styles.emptyStateTitle}>
                          Tính năng đang phát triển
                        </h4>
                        <p className={styles.emptyStateDescription}>
                          Tính năng xem lịch sử khai báo y tế hiện đang được
                          phát triển. Vui lòng quay lại sau hoặc liên hệ với nhà
                          trường để được hỗ trợ.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Medical Information Section */}
                        <div className={styles.medicalInfoSection}>
                          <div className={styles.medicalInfoSectionHeader}>
                            <div className={styles.medicalInfoSectionTitle}>
                              <div className={styles.medicalInfoSectionIcon}>
                                <FaStethoscope />
                              </div>
                              <h3 className={styles.medicalInfoSectionTitleText}>
                                Thông tin y tế
                              </h3>
                            </div>
                            {selectedStudent && (
                              <p className={styles.medicalInfoSectionSubtitle}>
                                Cập nhật lần cuối: {formatDateTime(declarationHistory?.lastChangeDate)}
                              </p>
                            )}
                          </div>
                          <div className={styles.medicalInfoSectionBody}>
                            <div className={styles.medicalInfoGrid}>
                              <div className={styles.medicalInfoField}>
                                <Form.Label className={styles.medicalInfoFieldLabel}>
                                  <FaExclamationCircle />
                                  Dị ứng
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  as="textarea"
                                  rows={4}
                                  className={styles.medicalInfoFieldTextarea}
                                  name="allergys"
                                  value={declarationHistory?.allergys}
                                  onChange={handleChange}
                                  placeholder="Không có"
                                />
                              </div>
                              <div className={styles.medicalInfoField}>
                                <Form.Label className={styles.medicalInfoFieldLabel}>
                                  <FaUserMd />
                                  Bệnh mãn tính
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  as="textarea"
                                  rows={4}
                                  className={styles.medicalInfoFieldTextarea}
                                  name="chronicIllnesss"
                                  value={declarationHistory?.chronicIllnesss}
                                  onChange={handleChange}
                                  placeholder="Không có"
                                />
                              </div>
                              <div className={styles.medicalInfoField}>
                                <Form.Label className={styles.medicalInfoFieldLabel}>
                                  <FaPills />
                                  Thuốc dài hạn
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  as="textarea"
                                  rows={4}
                                  className={styles.medicalInfoFieldTextarea}
                                  name="longTermMedications"
                                  value={declarationHistory?.longTermMedications}
                                  onChange={handleChange}
                                  placeholder="Không có"
                                />
                              </div>
                              <div className={styles.medicalInfoField}>
                                <Form.Label className={styles.medicalInfoFieldLabel}>
                                  <FaStickyNote />
                                  Tình trạng khác
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  as="textarea"
                                  rows={4}
                                  className={styles.medicalInfoFieldTextarea}
                                  name="otherMedicalConditions"
                                  value={declarationHistory?.otherMedicalConditions}
                                  onChange={handleChange}
                                  placeholder="Không có"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaStethoscope />
            Chi tiết khai báo y tế
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {selectedDeclaration && (
            <Row>
              <Col md={6}>
                <Card className={styles.modalInfoCard}>
                  <Card.Header className={styles.modalInfoHeader}>
                    <h6><FaUser /> Thông tin học sinh</h6>
                  </Card.Header>
                  <Card.Body className={styles.modalInfoBody}>
                    <div className={styles.modalInfoItem}>
                      <strong>Họ tên:</strong> {selectedDeclaration.studentName}
                    </div>
                    <div className={styles.modalInfoItem}>
                      <strong>Lớp:</strong> {selectedDeclaration.className}
                    </div>
                    <div className={styles.modalInfoItem}>
                      <strong>Ngày khai báo:</strong> {formatDate(selectedDeclaration.createdAt)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className={styles.modalInfoCard}>
                  <Card.Header className={styles.modalInfoHeader}>
                    <h6><FaStethoscope /> Tóm tắt y tế</h6>
                  </Card.Header>
                  <Card.Body className={styles.modalInfoBody}>
                    <div className={styles.modalMedicalItem}>
                      <FaAllergies />
                      <div>
                        <strong>Dị ứng:</strong>
                        <p>{selectedDeclaration.allergys || "Không có"}</p>
                      </div>
                    </div>
                    <div className={styles.modalMedicalItem}>
                      <FaThermometerHalf />
                      <div>
                        <strong>Bệnh mãn tính:</strong>
                        <p>{selectedDeclaration.chronicIllnesss || "Không có"}</p>
                      </div>
                    </div>
                    <div className={styles.modalMedicalItem}>
                      <FaPrescriptionBottle />
                      <div>
                        <strong>Thuốc dài hạn:</strong>
                        <p>{selectedDeclaration.longTermMedications || "Không có"}</p>
                      </div>
                    </div>
                    <div className={styles.modalMedicalItem}>
                      <FaNotesMedical />
                      <div>
                        <strong>Tình trạng khác:</strong>
                        <p>{selectedDeclaration.otherMedicalConditions || "Không có"}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            <FaTimesCircle />
            Đóng
          </Button>
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

export default HealthDeclaration;
