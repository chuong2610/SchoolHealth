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
    <div>
      <div>
        <Container>
          <div>
            <h1>
              Cài đặt
            </h1>
            <p>
              Quản lý tùy chỉnh và cài đặt tài khoản của bạn
            </p>
          </div>
        </Container>
      </div>

      <div>
        <Container>
          {alert && (
            <Alert variant={alert.type}>
              {alert.message}
            </Alert>
          )}

          <Card>
            <div>
              <h3>
                <div>
                  <FaBell />
                </div>
                Cài đặt thông báo
              </h3>
            </div>
            <div>
              <div>
                <div>
                  <div>
                    <FaEnvelope />
                    Thông báo qua Email
                  </div>
                  <p>
                    Nhận thông báo về sức khỏe và sự kiện y tế qua email
                  </p>
                </div>
                <Form.Check
                  type="switch"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                >
                  <Form.Check.Input />
                </Form.Check>
              </div>

              <div>
                <div>
                  <div>
                    <FaMobile />
                    Thông báo qua SMS
                  </div>
                  <p>
                    Nhận tin nhắn SMS cho các thông báo khẩn cấp
                  </p>
                </div>
                <Form.Check
                  type="switch"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                >
                  <Form.Check.Input />
                </Form.Check>
              </div>

              <div>
                <div>
                  <div>
                    <FaShieldAlt />
                    Cảnh báo y tế
                  </div>
                  <p>
                    Thông báo ngay lập tức về các vấn đề sức khỏe quan trọng
                  </p>
                </div>
                <Form.Check
                  type="switch"
                  checked={settings.medicalAlerts}
                  onChange={(e) => handleSettingChange('medicalAlerts', e.target.checked)}
                >
                  <Form.Check.Input />
                </Form.Check>
              </div>

              <div>
                <div>
                  <div>
                    Báo cáo hàng tuần
                  </div>
                  <p>
                    Nhận báo cáo tổng hợp về sức khỏe học sinh mỗi tuần
                  </p>
                </div>
                <Form.Check
                  type="switch"
                  checked={settings.weeklyReports}
                  onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                >
                  <Form.Check.Input />
                </Form.Check>
              </div>
            </div>
          </Card>

          <Card>
            <div>
              <h3>
                <div>
                  <FaCog />
                </div>
                Cài đặt hệ thống
              </h3>
            </div>
            <div>
              <div>
                <div>
                  <div>
                    <FaLanguage />
                    Ngôn ngữ
                  </div>
                  <p>
                    Chọn ngôn ngữ hiển thị cho giao diện
                  </p>
                </div>
                <Form.Select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </Form.Select>
              </div>
            </div>
          </Card>

          <Card>
            <div>
              <h3>
                <div>
                  <FaLock />
                </div>
                Bảo mật
              </h3>
            </div>
            <div>
              <div>
                <div>
                  <div>
                    Thay đổi mật khẩu
                  </div>
                  <p>
                    Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                  </p>
                </div>
                <Button
                  onClick={() => setShowPasswordModal(true)}
                >
                  <FaLock />
                  Thay đổi
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div>
              <Button onClick={handleSaveSettings}>
                <FaSave />
                Lưu cài đặt
              </Button>
            </div>
          </Card>
        </Container>
      </div>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <div>
          <div>
            <h4>
              <div>
                <FaLock />
              </div>
              Thay đổi mật khẩu
            </h4>
          </div>
          <Modal.Body className="p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Mật khẩu hiện tại *</Form.Label>
                <div>
                  <Form.Control
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="form-control pe-5"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Mật khẩu mới *</Form.Label>
                <div>
                  <Form.Control
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="form-control pe-5"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Xác nhận mật khẩu mới *</Form.Label>
                <div>
                  <Form.Control
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="form-control pe-5"
                  />
                  <button
                    type="button"
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
            >
              Hủy
            </Button>
            <Button
              onClick={handlePasswordSubmit}
            >
              <FaSave />
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
