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
    <div >
      {/* Page Heading */}
      <div >
        <h1 >
          <FaCog /> Cài đặt tài khoản
        </h1>
      </div>

      <div >
        <div >
          <Card >
            <Card.Header >
              <h6 >Cài đặt tài khoản</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleChangePassword} autoComplete="off">
                <h5 >Đổi mật khẩu</h5>
                <Form.Group >
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Form.Group>
                <Form.Group >
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group >
                  <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" >
                  Đổi mật khẩu
                </Button>
                {passwordMsg && (
                  <Alert variant={passwordType} >
                    {passwordMsg}
                  </Alert>
                )}
              </Form>

              <hr />

              <h5 >Cài đặt thông báo</h5>
              <Form.Group >
                <Form.Check
                  type="switch"
                  id="notifySwitch"
                  label="Bật/tắt thông báo hệ thống"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
              </Form.Group>

              <div >
                * Các chức năng sẽ được cập nhật trong phiên bản tiếp theo.
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
