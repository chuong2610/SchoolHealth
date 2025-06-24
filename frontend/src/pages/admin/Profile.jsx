import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Tab, Tabs } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey, FaHistory, FaCog, FaCamera, FaBell, FaLock, FaCalendarAlt, FaUserTie, FaIdCard, FaGlobe, FaEye, FaEyeSlash, FaClock, FaUserShield, FaCheck, FaExclamationTriangle, FaSave } from "react-icons/fa";
import "../../styles/admin/profile.css";

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
  { id: 1, action: "Cập nhật thông tin học sinh", time: "2 giờ trước", icon: "👤", type: "info" },
  { id: 2, action: "Tạo thông báo tiêm chủng", time: "4 giờ trước", icon: "💉", type: "success" },
  { id: 3, action: "Phê duyệt đơn thuốc", time: "1 ngày trước", icon: "💊", type: "warning" },
  { id: 4, action: "Xuất báo cáo sức khỏe", time: "2 ngày trước", icon: "📊", type: "info" },
  { id: 5, action: "Cập nhật kho thuốc", time: "3 ngày trước", icon: "🏥", type: "success" }
];
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

const Profile = () => {
  
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/User/${userId}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userInfo) return <div>Loading...</div>;

  console.log("Image URL:", userInfo.imageUrl);

  return (
    <div className="admin-profile-container">
      {/* Modern Header */}
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
              className="admin-profile-btn admin-profile-btn-primary"
              onClick={() => setShowEditModal(true)}
            >
              <FaEdit className="me-2" />
              Chỉnh sửa hồ sơ
            </button>
            <button
              className="admin-profile-btn admin-profile-btn-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              <FaKey className="me-2" />
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="admin-profile-stats-grid">
        <div className="admin-profile-stat-card">
          <div className="admin-profile-stat-icon">
            <FaUser />
          </div>
          <div className="admin-profile-stat-content">
            <div className="admin-profile-stat-value">15</div>
            <div className="admin-profile-stat-label">Thông báo đã tạo</div>
          </div>
        </div>
        <div className="admin-profile-stat-card">
          <div className="admin-profile-stat-icon">
            <FaHistory />
          </div>
          <div className="admin-profile-stat-content">
            <div className="admin-profile-stat-value">142</div>
            <div className="admin-profile-stat-label">Hoạt động tháng này</div>
          </div>
        </div>
        <div className="admin-profile-stat-card">
          <div className="admin-profile-stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="admin-profile-stat-content">
            <div className="admin-profile-stat-value">365</div>
            <div className="admin-profile-stat-label">Ngày làm việc</div>
          </div>
        </div>
        <div className="admin-profile-stat-card">
          <div className="admin-profile-stat-icon">
            <FaUserShield />
          </div>
          <div className="admin-profile-stat-content">
            <div className="admin-profile-stat-value">98%</div>
            <div className="admin-profile-stat-label">Độ tin cậy</div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="row g-4">
        {/* Personal Information */}
        <div className="col-xl-8">
          <div className="admin-profile-section">
            <div className="admin-profile-section-header">
              <h5 className="admin-profile-section-title">
                <FaUser className="me-2" />
                Thông tin cá nhân
              </h5>
              <button
                className="admin-profile-edit-btn"
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit className="me-1" />
                Chỉnh sửa
              </button>
            </div>
            <div className="admin-profile-info-grid">
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaUser className="me-2" />Họ và tên
                </label>
                <div className="admin-profile-info-value">{adminProfile.name}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaCalendarAlt className="me-2" />Ngày sinh
                </label>
                <div className="admin-profile-info-value">{adminProfile.dob.split("-").reverse().join("/")}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaUser className="me-2" />Giới tính
                </label>
                <div className="admin-profile-info-value">{adminProfile.gender}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaUserTie className="me-2" />Chức vụ
                </label>
                <div className="admin-profile-info-value">{adminProfile.position}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaEnvelope className="me-2" />Email
                </label>
                <div className="admin-profile-info-value">{adminProfile.email}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaPhone className="me-2" />Số điện thoại
                </label>
                <div className="admin-profile-info-value">{adminProfile.phone}</div>
              </div>
              <div className="admin-profile-info-item full-width">
                <label className="admin-profile-info-label">
                  <FaMapMarkerAlt className="me-2" />Địa chỉ
                </label>
                <div className="admin-profile-info-value">{adminProfile.address}</div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="admin-profile-section">
            <div className="admin-profile-section-header">
              <h5 className="admin-profile-section-title">
                <FaCog className="me-2" />
                Cài đặt hệ thống
              </h5>
              <button
                className="admin-profile-edit-btn"
                onClick={() => setShowEditModal(true)}
              >
                <FaCog className="me-1" />
                Cài đặt
              </button>
            </div>
            <div className="admin-profile-info-grid">
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaGlobe className="me-2" />Ngôn ngữ
                </label>
                <div className="admin-profile-info-value">{adminProfile.language}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaClock className="me-2" />Múi giờ
                </label>
                <div className="admin-profile-info-value">{adminProfile.timezone}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaCalendarAlt className="me-2" />Ngày tham gia
                </label>
                <div className="admin-profile-info-value">{adminProfile.joinDate.split("-").reverse().join("/")}</div>
              </div>
              <div className="admin-profile-info-item">
                <label className="admin-profile-info-label">
                  <FaHistory className="me-2" />Đăng nhập cuối
                </label>
                <div className="admin-profile-info-value">{adminProfile.lastLogin}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-xl-4">
          {/* Security Status */}
          <div className="admin-profile-section">
            <div className="admin-profile-section-header">
              <h5 className="admin-profile-section-title">
                <FaUserShield className="me-2" />
                Trạng thái bảo mật
              </h5>
            </div>
            <div className="admin-profile-security-list">
              <div className="admin-profile-security-item">
                <div className="admin-profile-security-icon success">
                  <FaLock />
                </div>
                <div className="admin-profile-security-content">
                  <div className="admin-profile-security-title">Mật khẩu mạnh</div>
                  <div className="admin-profile-security-desc">Cập nhật 30 ngày trước</div>
                </div>
                <div className="admin-profile-security-status enabled">
                  <FaCheck />
                </div>
              </div>
              <div className="admin-profile-security-item">
                <div className="admin-profile-security-icon success">
                  <FaBell />
                </div>
                <div className="admin-profile-security-content">
                  <div className="admin-profile-security-title">Thông báo bảo mật</div>
                  <div className="admin-profile-security-desc">Đã bật</div>
                </div>
                <div className="admin-profile-security-status enabled">
                  <FaCheck />
                </div>
              </div>
              <div className="admin-profile-security-item">
                <div className="admin-profile-security-icon warning">
                  <FaExclamationTriangle />
                </div>
                <div className="admin-profile-security-content">
                  <div className="admin-profile-security-title">Xác thực 2 bước</div>
                  <div className="admin-profile-security-desc">Chưa kích hoạt</div>
                </div>
                <div className="admin-profile-security-status disabled">
                  <FaExclamationTriangle />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="admin-profile-section">
            <div className="admin-profile-section-header">
              <h5 className="admin-profile-section-title">
                <FaHistory className="me-2" />
                Hoạt động gần đây
              </h5>
            </div>
            <div className="admin-profile-activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="admin-profile-activity-item">
                  <div className={`admin-profile-activity-icon ${activity.type}`}>
                    {activity.icon}
                  </div>
                  <div className="admin-profile-activity-content">
                    <div className="admin-profile-activity-title">{activity.action}</div>
                    <div className="admin-profile-activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        className="admin-profile-modal"
      >
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title>
            <FaEdit className="me-2" />
            Chỉnh sửa hồ sơ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="admin-profile-tabs"
          >
            <Tab eventKey="personal" title="Thông tin cá nhân">
              <div className="admin-profile-form-section">
                <Row>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaUser className="me-2" />Họ và tên
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="admin-form-control"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaEnvelope className="me-2" />Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="admin-form-control"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaPhone className="me-2" />Số điện thoại
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="admin-form-control"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaGlobe className="me-2" />Ngôn ngữ
                      </Form.Label>
                      <Form.Select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="admin-form-select"
                      >
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="English">English</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaMapMarkerAlt className="me-2" />Địa chỉ
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="admin-form-control"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab eventKey="system" title="Cài đặt hệ thống">
              <div className="admin-profile-form-section">
                <Row>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaClock className="me-2" />Múi giờ
                      </Form.Label>
                      <Form.Select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="admin-form-select"
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                        <option value="Asia/Bangkok">Asia/Bangkok</option>
                        <option value="UTC">UTC</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaBell className="me-2" />Thông báo email
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="email-notifications"
                        label="Nhận thông báo qua email"
                        defaultChecked
                        className="admin-form-switch"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaUserShield className="me-2" />Xác thực 2 bước
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="two-factor"
                        label="Kích hoạt xác thực 2 bước"
                        defaultChecked={false}
                        className="admin-form-switch"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaBell className="me-2" />Thông báo desktop
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="desktop-notifications"
                        label="Hiển thị thông báo trên desktop"
                        defaultChecked={true}
                        className="admin-form-switch"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button
            className="admin-profile-btn-primary"
            onClick={handleSaveProfile}
          >
            <FaSave className="me-2" />
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        className="admin-profile-modal"
      >
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title>
            <FaKey className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <Form>
            <Form.Group className="admin-form-group">
              <Form.Label className="admin-form-label">Mật khẩu hiện tại</Form.Label>
              <div className="admin-password-input-group">
                <Form.Control
                  type={showPasswordCurrent ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="admin-form-control"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                >
                  {showPasswordCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <Form.Group className="admin-form-group">
              <Form.Label className="admin-form-label">Mật khẩu mới</Form.Label>
              <div className="admin-password-input-group">
                <Form.Control
                  type={showPasswordNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  className="admin-form-control"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                >
                  {showPasswordNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <Form.Group className="admin-form-group">
              <Form.Label className="admin-form-label">Xác nhận mật khẩu mới</Form.Label>
              <div className="admin-password-input-group">
                <Form.Control
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  className="admin-form-control"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Form.Group>
            <div className="admin-password-requirements">
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
        <Modal.Footer className="admin-modal-footer">
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button
            className="admin-profile-btn-primary"
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
