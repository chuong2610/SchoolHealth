import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Badge,
  Alert,
  Nav,
  Tab
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaStethoscope,
  FaUserNurse,
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaGraduationCap,
  FaCalendarAlt,
  FaCertificate,
  FaAward,
  FaHeart,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaBell,
  FaCog,
  FaLanguage,
  FaPalette,
  FaMoon,
  FaSun,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaHistory,
  FaChartLine,
  FaMedkit,
  FaUserMd
} from 'react-icons/fa';
// Import CSS cho Nurse Profile
import "../../styles/nurse/profile/index.css";

const nurseInfo = {
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  name: "Nguyễn Thị B",
  id: "YT001",
  dob: "12/05/1985",
  gender: "Nữ",
  email: "nguyenthib@nurse.edu.vn",
  phone: "0901 234 567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  department: "Phòng Y tế Trường",
  position: "Y tá trưởng",
  startDate: "01/09/2020",
  education: "Cử nhân Điều dưỡng",
  license: "CK-123456789",
  experience: "5 năm",
  specialization: "Chăm sóc sức khỏe học đường",
  emergencyContact: "0912 345 678",
  bloodType: "A+",
  allergies: "Không có",
  status: "Đang làm việc"
};

const Profile = () => {
  // Professional state management
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState(nurseInfo);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Professional notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEditMode(false);
      showNotification("Cập nhật thông tin thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi cập nhật thông tin!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowChangePassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showNotification("Đổi mật khẩu thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi đổi mật khẩu!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid nurse-profile"
    >

      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type === "error" ? "danger" : notification.type}
          className="notification-alert"
          dismissible
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Profile Header */}
      <div className="profile-header">
        <div className="row align-items-center">
          <div className="col-md-auto text-center text-md-start mb-3 mb-md-0">
            <div className="profile-avatar-container">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="profile-avatar"
              />
              <div className="avatar-upload-btn" title="Đổi ảnh đại diện">
                <FaCamera />
              </div>
            </div>
          </div>
          <div className="col-md">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-md-between">
              <div className="profile-info text-center text-md-start mb-3 mb-md-0">
                <h1>
                  {formData.name}
                </h1>
                <div className="profile-badges d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                  <Badge className="status-badge active">
                    <FaStethoscope className="me-1" />
                    {formData.position}
                  </Badge>
                  <Badge className="profile-badge-light">
                    <FaIdCard className="me-1" />
                    {formData.id}
                  </Badge>
                  <Badge className="profile-badge-info">
                    <FaBuilding className="me-1" />
                    {formData.department}
                  </Badge>
                </div>
              </div>
              <div className="profile-action-buttons d-flex gap-2">
                {!editMode ? (
                  <Button
                    onClick={() => setEditMode(true)}
                    className="edit-btn"
                  >
                    <FaEdit />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="save-btn"
                    >
                      {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
                      Lưu
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      className="cancel-btn"
                    >
                      <FaTimes />
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Card className="profile-card profile-tabs">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="professional">
                  <FaUserNurse className="me-2" />
                  Thông tin nghề nghiệp
                </Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FaShieldAlt className="me-2" />
                  Bảo mật
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings">
                  <FaCog className="me-2" />
                  Cài đặt
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Row>
                  <Col lg={6}>
                    <div className="tab-section">
                      <h5>
                        <FaUser />
                        Thông tin cơ bản
                      </h5>

                      <div className="info-item">
                        <div className="info-icon primary">
                          <FaEnvelope />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Email</div>
                          {editMode ? (
                            <Form.Control
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          ) : (
                            <div className="info-value">{formData.email}</div>
                          )}
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon success">
                          <FaPhone />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Số điện thoại</div>
                          {editMode ? (
                            <Form.Control
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          ) : (
                            <div className="info-value">{formData.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon warning">
                          <FaBirthdayCake />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Ngày sinh</div>
                          {editMode ? (
                            <Form.Control
                              type="date"
                              value={formData.dob}
                              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                          ) : (
                            <div className="info-value">{formData.dob}</div>
                          )}
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon purple">
                          <FaVenusMars />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Giới tính</div>
                          {editMode ? (
                            <Form.Select
                              value={formData.gender}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                            </Form.Select>
                          ) : (
                            <div className="info-value">{formData.gender}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="tab-section">
                      <h5>
                        <FaMapMarkerAlt />
                        Thông tin liên hệ
                      </h5>

                      <div className="info-item">
                        <div className="info-icon primary">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Địa chỉ</div>
                          {editMode ? (
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                          ) : (
                            <div className="info-value">{formData.address}</div>
                          )}
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon warning">
                          <FaPhone />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Liên hệ khẩn cấp</div>
                          {editMode ? (
                            <Form.Control
                              type="tel"
                              value={formData.emergencyContact}
                              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            />
                          ) : (
                            <div className="info-value">{formData.emergencyContact}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaHeart />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Nhóm máu</div>
                        {editMode ? (
                          <Form.Select
                            value={formData.bloodType}
                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        ) : (
                          <div style={{ color: '#666' }}>{formData.bloodType}</div>
                        )}
                      </div>
                    </div> */}

                    {/* <div className="info-item">
                      <div className="info-icon purple">
                        <FaExclamationTriangle />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Dị ứng</div>
                        {editMode ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            placeholder="Mô tả các loại dị ứng (nếu có)"
                          />
                        ) : (
                          <div style={{ color: '#666' }}>{formData.allergies}</div>
                        )}
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="professional">
                <Row>
                  <Col lg={6}>
                    <h5 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>
                      <FaUserNurse className="me-2" style={{ color: '#667eea' }} />
                      Thông tin công việc
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaBuilding />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Phòng ban</div>
                        <div style={{ color: '#666' }}>{formData.department}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaStethoscope />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Chức vụ</div>
                        <div style={{ color: '#666' }}>{formData.position}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon warning">
                        <FaCalendarAlt />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Ngày bắt đầu</div>
                        <div style={{ color: '#666' }}>{formData.startDate}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon purple">
                        <FaChartLine />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Kinh nghiệm</div>
                        <div style={{ color: '#666' }}>{formData.experience}</div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <h5 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>
                      <FaCertificate className="me-2" style={{ color: '#667eea' }} />
                      Bằng cấp & Chứng chỉ
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaGraduationCap />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Trình độ học vấn</div>
                        <div style={{ color: '#666' }}>{formData.education}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaCertificate />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Chứng chỉ hành nghề</div>
                        <div style={{ color: '#666' }}>{formData.license}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon warning">
                        <FaMedkit />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Chuyên môn</div>
                        <div style={{ color: '#666' }}>{formData.specialization}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon purple">
                        <FaAward />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Trạng thái</div>
                        <Badge className="status-badge active">
                          <FaCheck className="me-1" />
                          {formData.status}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="security">
                <Row>
                  <Col lg={8}>
                    <div className="tab-section">
                      <h5>
                        <FaShieldAlt />
                        Bảo mật tài khoản
                      </h5>

                      <div className="info-item">
                        <div className="info-icon primary">
                          <FaLock />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Mật khẩu</div>
                          <div className="info-value">Đổi mật khẩu để bảo vệ tài khoản</div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setShowChangePassword(true)}
                          >
                            <FaKey className="me-1" />
                            Đổi mật khẩu
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaHistory />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Lịch sử đăng nhập</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Xem lịch sử đăng nhập gần đây</div>
                        <Button variant="outline-success" size="sm">
                          <FaHistory className="me-1" />
                          Xem lịch sử
                        </Button>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="settings">
                <Row>
                  <Col lg={8}>
                    <div className="tab-section">
                      <h5>
                        <FaCog />
                        Cài đặt ứng dụng
                      </h5>

                      <div className="info-item">
                        <div className="info-icon primary">
                          <FaBell />
                        </div>
                        <div className="info-content flex-grow-1">
                          <div className="info-label">Thông báo</div>
                          <div className="info-value">Quản lý thông báo và cảnh báo</div>
                          <Form.Check
                            type="switch"
                            id="notifications"
                            label="Nhận thông báo qua email"
                            defaultChecked
                          />
                          <Form.Check
                            type="switch"
                            id="push-notifications"
                            label="Thông báo đẩy"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaLanguage />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Ngôn ngữ</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Chọn ngôn ngữ hiển thị</div>
                        <Form.Select style={{ maxWidth: '200px' }}>
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </Form.Select>
                      </div>
                    </div> */}

                    {/* <div className="info-item">
                      <div className="info-icon warning">
                        <FaPalette />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Giao diện</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Tùy chỉnh giao diện ứng dụng</div>
                        <div className="d-flex gap-2">
                          <Button variant="outline-primary" size="sm">
                            <FaSun className="me-1" />
                            Sáng
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <FaMoon className="me-1" />
                            Tối
                          </Button>
                        </div>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Card>
        </Tab.Container>
      </div>

      {/* Change Password Modal */}
      <Modal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
        size="md"
        className="medicine-detail-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FaKey className="modal-icon" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="secondary"
            onClick={() => setShowChangePassword(false)}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? <FaSpinner className="fa-spin me-1" /> : <FaSave className="me-1" />}
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
