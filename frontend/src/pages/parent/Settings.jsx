import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from "react-bootstrap";
import {
  FaCog,
  FaBell,
  FaLanguage,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaEnvelope,
  FaMobile
} from "react-icons/fa";
// Styles được import từ main.jsx

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: "vi",
    theme: "light",
    pushNotifications: true,
    medicalAlerts: true,
    weeklyReports: true
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [alert, setAlert] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Simulate API call
    setAlert({ type: "success", message: "Cài đặt đã được lưu thành công!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: "danger", message: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setAlert({ type: "danger", message: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
      return;
    }

    // Simulate API call
    setAlert({ type: "success", message: "Mật khẩu đã được thay đổi thành công!" });
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setAlert(null), 3000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="parent-theme">
      <style>
        {`
          .settings-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .settings-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .settings-header::before {
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
          }
          
          .page-subtitle {
            font-size: 1.2rem !important;
            opacity: 0.95 !important;
            margin: 0 !important;
            font-weight: 400 !important;
          }
          
          .settings-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .settings-card {
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1) !important;
            border: 2px solid #e5e7eb !important;
            margin-bottom: 2rem !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
          }
          
          .settings-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 15px 40px rgba(37, 99, 235, 0.15) !important;
            border-color: #3b82f6 !important;
          }
          
          .card-header-custom {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 1.5rem !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          
          .section-title {
            font-size: 1.4rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
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
          
          .card-body-custom {
            padding: 2rem !important;
          }
          
          .setting-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 1rem 0 !important;
            border-bottom: 1px solid #f3f4f6 !important;
          }
          
          .setting-item:last-child {
            border-bottom: none !important;
          }
          
          .setting-info {
            flex: 1 !important;
          }
          
          .setting-label {
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            color: #1f2937 !important;
            margin-bottom: 0.25rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .setting-description {
            color: #6b7280 !important;
            font-size: 0.9rem !important;
            margin: 0 !important;
          }
          
          .form-check-custom {
            margin-left: 1rem !important;
          }
          
          .form-check-input-custom {
            width: 50px !important;
            height: 25px !important;
            border-radius: 15px !important;
            background: #d1d5db !important;
            border: none !important;
            position: relative !important;
            appearance: none !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
          }
          
          .form-check-input-custom:checked {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
          }
          
          .form-check-input-custom::after {
            content: '' !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            width: 21px !important;
            height: 21px !important;
            background: white !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
          }
          
          .form-check-input-custom:checked::after {
            transform: translateX(25px) !important;
          }
          
          .form-select-custom {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 0.75rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
            min-width: 150px !important;
          }
          
          .form-select-custom:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .save-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            text-align: center !important;
            border-radius: 0 0 20px 20px !important;
          }
          
          .save-btn {
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
          
          .save-btn:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3) !important;
            color: white !important;
          }
          
          .change-password-btn {
            background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
            border: none !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .change-password-btn:hover {
            background: linear-gradient(135deg, #d97706, #f59e0b) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3) !important;
            color: white !important;
          }
          
          .password-input-group {
            position: relative !important;
          }
          
          .password-toggle {
            position: absolute !important;
            right: 12px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: none !important;
            border: none !important;
            color: #6b7280 !important;
            cursor: pointer !important;
            padding: 0.5rem !important;
            transition: color 0.3s ease !important;
          }
          
          .password-toggle:hover {
            color: #2563eb !important;
          }
          
          .alert-custom {
            border-radius: 12px !important;
            border: none !important;
            padding: 1rem 1.5rem !important;
            margin-bottom: 2rem !important;
          }
          
          .modal-content-custom {
            border-radius: 20px !important;
            border: none !important;
            box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15) !important;
          }
          
          .modal-header-custom {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            border-bottom: 2px solid #e5e7eb !important;
            border-radius: 20px 20px 0 0 !important;
            padding: 1.5rem !important;
          }
          
          .modal-title-custom {
            font-size: 1.4rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
            }
            
            .page-subtitle {
              font-size: 1rem !important;
            }
            
            .settings-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .card-body-custom {
              padding: 1.5rem !important;
            }
            
            .setting-item {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 1rem !important;
            }
            
            .save-btn {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}
      </style>

      <div className="settings-page">
        {/* Header */}
        <div className="settings-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Cài đặt
              </h1>
              <p className="page-subtitle">
                Quản lý tùy chỉnh và cài đặt tài khoản của bạn
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="settings-container">
          <Container>
            {alert && (
              <Alert variant={alert.type} className="alert-custom">
                {alert.message}
              </Alert>
            )}

            {/* Notification Settings */}
            <Card className="settings-card">
              <div className="card-header-custom">
                <h3 className="section-title">
                  <div className="section-icon">
                    <FaBell />
                  </div>
                  Cài đặt thông báo
                </h3>
              </div>
              <div className="card-body-custom">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      <FaEnvelope />
                      Thông báo qua Email
                    </div>
                    <p className="setting-description">
                      Nhận thông báo về sức khỏe và sự kiện y tế qua email
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    className="form-check-custom"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  >
                    <Form.Check.Input
                      className="form-check-input-custom"
                    />
                  </Form.Check>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      <FaMobile />
                      Thông báo qua SMS
                    </div>
                    <p className="setting-description">
                      Nhận tin nhắn SMS cho các thông báo khẩn cấp
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    className="form-check-custom"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  >
                    <Form.Check.Input
                      className="form-check-input-custom"
                    />
                  </Form.Check>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      <FaShieldAlt />
                      Cảnh báo y tế
                    </div>
                    <p className="setting-description">
                      Thông báo ngay lập tức về các vấn đề sức khỏe quan trọng
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    className="form-check-custom"
                    checked={settings.medicalAlerts}
                    onChange={(e) => handleSettingChange('medicalAlerts', e.target.checked)}
                  >
                    <Form.Check.Input
                      className="form-check-input-custom"
                    />
                  </Form.Check>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      Báo cáo hàng tuần
                    </div>
                    <p className="setting-description">
                      Nhận báo cáo tổng hợp về sức khỏe học sinh mỗi tuần
                    </p>
                  </div>
                  <Form.Check
                    type="switch"
                    className="form-check-custom"
                    checked={settings.weeklyReports}
                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                  >
                    <Form.Check.Input
                      className="form-check-input-custom"
                    />
                  </Form.Check>
                </div>
              </div>
            </Card>

            {/* System Settings */}
            <Card className="settings-card">
              <div className="card-header-custom">
                <h3 className="section-title">
                  <div className="section-icon">
                    <FaCog />
                  </div>
                  Cài đặt hệ thống
                </h3>
              </div>
              <div className="card-body-custom">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      <FaLanguage />
                      Ngôn ngữ
                    </div>
                    <p className="setting-description">
                      Chọn ngôn ngữ hiển thị cho giao diện
                    </p>
                  </div>
                  <Form.Select
                    className="form-select-custom"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </Form.Select>
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="settings-card">
              <div className="card-header-custom">
                <h3 className="section-title">
                  <div className="section-icon">
                    <FaLock />
                  </div>
                  Bảo mật
                </h3>
              </div>
              <div className="card-body-custom">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">
                      Thay đổi mật khẩu
                    </div>
                    <p className="setting-description">
                      Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                    </p>
                  </div>
                  <Button
                    className="change-password-btn"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <FaLock />
                    Thay đổi
                  </Button>
                </div>
              </div>
            </Card>

            {/* Save Section */}
            <Card className="settings-card">
              <div className="save-section">
                <Button className="save-btn" onClick={handleSaveSettings}>
                  <FaSave />
                  Lưu cài đặt
                </Button>
              </div>
            </Card>
          </Container>
        </div>

        {/* Password Change Modal */}
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          centered
        >
          <div className="modal-content-custom">
            <div className="modal-header-custom">
              <h4 className="modal-title-custom">
                <div className="section-icon">
                  <FaLock />
                </div>
                Thay đổi mật khẩu
              </h4>
            </div>
            <Modal.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mật khẩu hiện tại *</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="form-control pe-5"
                      style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "0.75rem 3rem 0.75rem 1rem"
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mật khẩu mới *</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="form-control pe-5"
                      style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "0.75rem 3rem 0.75rem 1rem"
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Xác nhận mật khẩu mới *</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="form-control pe-5"
                      style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "0.75rem 3rem 0.75rem 1rem"
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center p-4">
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
                className="me-3"
                style={{
                  borderRadius: "12px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600"
                }}
              >
                Hủy
              </Button>
              <Button
                className="save-btn"
                onClick={handlePasswordSubmit}
              >
                <FaSave />
                Lưu thay đổi
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;
