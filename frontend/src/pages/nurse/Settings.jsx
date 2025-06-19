import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { FaCog } from 'react-icons/fa';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordType, setPasswordType] = useState("success");
  const [notify, setNotify] = useState(() => {
    return localStorage.getItem("nurse_notify") === "true";
  });

  useEffect(() => {
    localStorage.setItem("nurse_notify", notify);
  }, [notify]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Vui lòng nhập đầy đủ thông tin.");
      setPasswordType("danger");
      return;
    }
    if (currentPassword !== "123456") {
      setPasswordMsg("Mật khẩu hiện tại không đúng (demo: 123456)");
      setPasswordType("danger");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Mật khẩu mới không trùng khớp.");
      setPasswordType("danger");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("Mật khẩu mới phải từ 6 ký tự trở lên.");
      setPasswordType("danger");
      return;
    }
    setPasswordMsg("Đổi mật khẩu thành công!");
    setPasswordType("success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <FaCog className="me-2" /> Cài đặt tài khoản
        </h1>
      </div>

      <div className="row">
        <div className="col-lg-6 offset-lg-3">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Cài đặt tài khoản</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleChangePassword} autoComplete="off">
                <h5 className="mb-3 text-gray-800">Đổi mật khẩu</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Đổi mật khẩu
                </Button>
                {passwordMsg && (
                  <Alert variant={passwordType} className="mt-3">
                    {passwordMsg}
                  </Alert>
                )}
              </Form>

              <hr className="my-4" />

              <h5 className="mb-3 text-gray-800">Cài đặt thông báo</h5>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="notifySwitch"
                  label="Bật/tắt thông báo hệ thống"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
              </Form.Group>

              <div className="text-muted small mt-4">
                * Đổi mật khẩu demo: mật khẩu hiện tại là <b>123456</b>.<br />* Các chức năng sẽ được cập nhật trong phiên bản tiếp theo.
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
