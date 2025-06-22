import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Tab, Tabs } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey, FaHistory, FaCog, FaCamera, FaBell, FaLock, FaCalendarAlt, FaUserTie, FaIdCard, FaGlobe, FaEye, FaEyeSlash, FaClock } from "react-icons/fa";

const adminProfile = {
  name: "Nguyễn Văn Admin",
  dob: "1990-05-15",
  gender: "Nam",
  position: "Quản trị viên",
  email: "admin@schoolhealth.com",
  phone: "0987654321",
  address: "123 Đường ABC, Quận XYZ, TP.HCM",
  avatar: "/uploads/default.jpg",
  joinDate: "2023-01-15",
  department: "Phòng Y tế",
  employeeId: "ADM001",
  lastLogin: "2024-01-15 14:30",
  language: "Tiếng Việt",
  timezone: "Asia/Ho_Chi_Minh"
};

const recentActivities = [
  { id: 1, action: "Cập nhật thông tin học sinh", time: "2 giờ trước", icon: "👤" },
  { id: 2, action: "Tạo thông báo tiêm chủng", time: "4 giờ trước", icon: "💉" },
  { id: 3, action: "Phê duyệt đơn thuốc", time: "1 ngày trước", icon: "💊" },
  { id: 4, action: "Xuất báo cáo sức khỏe", time: "2 ngày trước", icon: "📊" },
  { id: 5, action: "Cập nhật kho thuốc", time: "3 ngày trước", icon: "🏥" }
];

const Profile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    name: adminProfile.name,
    email: adminProfile.email,
    phone: adminProfile.phone,
    address: adminProfile.address,
    language: adminProfile.language,
    timezone: adminProfile.timezone
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    setShowEditModal(false);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className="admin-container">
      {/* Profile Header */}
      <div className="admin-profile-header">
        <div className="admin-profile-header-bg"></div>
        <div className="admin-profile-header-content">
          <div className="admin-profile-avatar-section">
            <div className="admin-profile-avatar">
              <img src={adminProfile.avatar} alt="Avatar" />
              <button className="admin-profile-avatar-edit">
                <FaCamera />
              </button>
            </div>
            <div className="admin-profile-info">
              <h2 className="admin-profile-name">{adminProfile.name}</h2>
              <p className="admin-profile-position">
                <FaUserTie className="me-2" />
                {adminProfile.position} - {adminProfile.department}
              </p>
              <p className="admin-profile-id">
                <FaIdCard className="me-2" />
                ID: {adminProfile.employeeId}
              </p>
            </div>
          </div>
          <div className="admin-profile-actions">
            <button
              className="admin-btn admin-primary-btn"
              onClick={() => setShowEditModal(true)}
            >
              <FaEdit className="me-2" />
              Chỉnh sửa hồ sơ
            </button>
            <button
              className="admin-btn admin-secondary-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              <FaKey className="me-2" />
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="row g-4 mt-4">
        {/* Personal Information */}
        <div className="col-xl-8">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaUser className="me-2" />
                Thông tin cá nhân
              </h5>
            </div>
            <div className="admin-card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaUser className="me-2" />Họ và tên</label>
                    <div className="value">{adminProfile.name}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaCalendarAlt className="me-2" />Ngày sinh</label>
                    <div className="value">{adminProfile.dob.split("-").reverse().join("/")}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaUser className="me-2" />Giới tính</label>
                    <div className="value">{adminProfile.gender}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaUserTie className="me-2" />Chức vụ</label>
                    <div className="value">{adminProfile.position}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaEnvelope className="me-2" />Email</label>
                    <div className="value">{adminProfile.email}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaPhone className="me-2" />Số điện thoại</label>
                    <div className="value">{adminProfile.phone}</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="admin-profile-field">
                    <label><FaMapMarkerAlt className="me-2" />Địa chỉ</label>
                    <div className="value">{adminProfile.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="admin-card mt-4">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaCog className="me-2" />
                Cài đặt hệ thống
              </h5>
            </div>
            <div className="admin-card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaGlobe className="me-2" />Ngôn ngữ</label>
                    <div className="value">{adminProfile.language}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaClock className="me-2" />Múi giờ</label>
                    <div className="value">{adminProfile.timezone}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaCalendarAlt className="me-2" />Ngày tham gia</label>
                    <div className="value">{adminProfile.joinDate.split("-").reverse().join("/")}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-profile-field">
                    <label><FaHistory className="me-2" />Đăng nhập cuối</label>
                    <div className="value">{adminProfile.lastLogin}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-xl-4">
          {/* Quick Stats */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaLock className="me-2" />
                Trạng thái bảo mật
              </h5>
            </div>
            <div className="admin-card-body">
              <div className="admin-security-item">
                <div className="security-icon success">
                  <FaLock />
                </div>
                <div className="security-info">
                  <div className="security-title">Mật khẩu mạnh</div>
                  <div className="security-desc">Cập nhật 30 ngày trước</div>
                </div>
              </div>
              <div className="admin-security-item">
                <div className="security-icon success">
                  <FaBell />
                </div>
                <div className="security-info">
                  <div className="security-title">Thông báo bảo mật</div>
                  <div className="security-desc">Đã bật</div>
                </div>
              </div>
              <div className="admin-security-item">
                <div className="security-icon warning">
                  <FaLock />
                </div>
                <div className="security-info">
                  <div className="security-title">Xác thực 2 bước</div>
                  <div className="security-desc">Chưa kích hoạt</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="admin-card mt-4">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaHistory className="me-2" />
                Hoạt động gần đây
              </h5>
            </div>
            <div className="admin-card-body">
              <div className="admin-activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="admin-activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        className="admin-modal-profile"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Chỉnh sửa hồ sơ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="personal" title="Thông tin cá nhân">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaUser className="me-2" />Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaPhone className="me-2" />Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaGlobe className="me-2" />Ngôn ngữ</Form.Label>
                    <Form.Select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    >
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="English">English</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaMapMarkerAlt className="me-2" />Địa chỉ</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="system" title="Cài đặt hệ thống">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Múi giờ</Form.Label>
                    <Form.Select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    >
                      <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                      <option value="Asia/Bangkok">Asia/Bangkok</option>
                      <option value="UTC">UTC</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thông báo email</Form.Label>
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="Nhận thông báo qua email"
                      defaultChecked
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button
            className="admin-primary-btn"
            onClick={handleSaveProfile}
          >
            <FaUser className="me-2" />
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        className="admin-modal-profile"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <div className="password-input-group">
                <Form.Control
                  type={showPasswordCurrent ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                >
                  {showPasswordCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <div className="password-input-group">
                <Form.Control
                  type={showPasswordNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                >
                  {showPasswordNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <div className="password-input-group">
                <Form.Control
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <div className="password-requirements">
              <h6>Yêu cầu mật khẩu:</h6>
              <ul>
                <li>Ít nhất 8 ký tự</li>
                <li>Chứa chữ hoa và chữ thường</li>
                <li>Chứa ít nhất 1 số</li>
                <li>Chứa ít nhất 1 ký tự đặc biệt</li>
              </ul>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button
            className="admin-primary-btn"
            onClick={handleChangePassword}
          >
            <FaKey className="me-2" />
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
