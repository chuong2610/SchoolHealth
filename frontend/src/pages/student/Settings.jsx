import React, { useState, useEffect } from "react";

const Settings = () => {
  // State cho đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordType, setPasswordType] = useState("success");

  // State cho nhận thông báo
  const [notify, setNotify] = useState(() => {
    return localStorage.getItem("student_notify") === "true";
  });

  useEffect(() => {
    localStorage.setItem("student_notify", notify);
  }, [notify]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Giả lập kiểm tra mật khẩu hiện tại là '123456'
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
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        <div
          className="card shadow-sm border-0 rounded-4 p-4"
          style={{ margin: "0 auto" }}
        >
          <h2 className="fw-bold mb-4" style={{ fontSize: 26 }}>
            Cài đặt tài khoản
          </h2>
          <form
            className="mb-4"
            onSubmit={handleChangePassword}
            autoComplete="off"
          >
            <label className="form-label fw-semibold">Đổi mật khẩu</label>
            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button className="btn btn-primary mt-2" type="submit">
              Đổi mật khẩu
            </button>
            {passwordMsg && (
              <div
                className={`alert alert-${passwordType} mt-3 py-2 px-3`}
                role="alert"
                style={{ fontSize: 15 }}
              >
                {passwordMsg}
              </div>
            )}
          </form>
          <div className="mb-4">
            <label className="form-label fw-semibold">Nhận thông báo</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="notifySwitch"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="notifySwitch">
                Bật/tắt thông báo hệ thống
              </label>
            </div>
          </div>
          <div className="text-muted small">
            * Đổi mật khẩu demo: mật khẩu hiện tại là <b>123456</b>.<br />* Các
            chức năng sẽ được cập nhật trong phiên bản tiếp theo.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
