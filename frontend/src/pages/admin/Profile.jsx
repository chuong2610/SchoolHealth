import { Modal, Button, Form, Row, Col, Tab, Tabs } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaKey,
  FaHistory,
  FaCog,
  FaCamera,
  FaBell,
  FaLock,
  FaCalendarAlt,
  FaUserTie,
  FaIdCard,
  FaGlobe,
  FaEye,
  FaEyeSlash,
  FaClock,
  FaUserShield,
  FaCheck,
  FaExclamationTriangle,
  FaSave,
} from "react-icons/fa";
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
  timezone: "Asia/Ho_Chi_Minh",
};

const recentActivities = [
  {
    id: 1,
    action: "Cập nhật thông tin học sinh",
    time: "2 giờ trước",
    icon: "👤",
    type: "info",
  },
  {
    id: 2,
    action: "Tạo thông báo tiêm chủng",
    time: "4 giờ trước",
    icon: "💉",
    type: "success",
  },
  {
    id: 3,
    action: "Phê duyệt đơn thuốc",
    time: "1 ngày trước",
    icon: "💊",
    type: "warning",
  },
  {
    id: 4,
    action: "Xuất báo cáo sức khỏe",
    time: "2 ngày trước",
    icon: "📊",
    type: "info",
  },
  {
    id: 5,
    action: "Cập nhật kho thuốc",
    time: "3 ngày trước",
    icon: "🏥",
    type: "success",
  },
];
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

const Profile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (showEditModal && userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
      setPreviewImage(userInfo.imageUrl || "");
      setSelectedImage(null);
    }
  }, [showEditModal, userInfo]);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5182/api/Upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload ảnh thất bại!");

    const data = await response.json();
    return data.fileName; // hoặc data.filePath nếu backend yêu cầu
  };

  const handleSaveProfile = async () => {
    try {
      let imageUrl = userInfo.imageUrl;

      // Nếu userInfo.imageUrl là URL đầy đủ, tách lấy tên file
      if (imageUrl && imageUrl.startsWith("http")) {
        // Lấy phần sau cùng của đường dẫn
        imageUrl = imageUrl.split("/").pop();
      }

      if (selectedImage) {
        imageUrl = await uploadAvatar(selectedImage);
      }

      await axiosInstance.patch(`/User/profile/${userId}`, {
        ...formData,
        imageUrl,
      });

      setShowEditModal(false);
      // Reload lại userInfo nếu muốn cập nhật giao diện ngay
      const response = await axiosInstance.get(`/User/${userId}`);
      setUserInfo(response.data);
    } catch (error) {
      alert("Có lỗi khi lưu thông tin hoặc upload ảnh!");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    try {
      // Lấy userId từ localStorage hoặc state
      const userId = localStorage.getItem("userId");

      // Lấy dữ liệu từ form đổi mật khẩu
      // Giả sử bạn có 3 state: currentPassword, newPassword, confirmNewPassword
      const payload = {
        currentPassword, // mật khẩu hiện tại
        newPassword, // mật khẩu mới
        confirmNewPassword, // xác nhận mật khẩu mới
      };

      await axiosInstance.patch(`/User/change-password/${userId}`, payload);

      alert("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      alert(
        "Đổi mật khẩu thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/User/${userId}`);
        setUserInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userInfo) return <div>Loading...</div>;

  // console.log("Image URL:", userInfo.imageUrl);

  return (
    <div className="admin-profile-container">
      {/* Modern Header */}
      <div className="admin-profile-header">
        <div className="admin-profile-header-bg"></div>
        <div className="admin-profile-header-content">
          <div className="admin-profile-avatar-section">
            <div className="admin-profile-avatar">
              <img src={userInfo.imageUrl} alt="Avatar" />
              <button className="admin-profile-avatar-edit">
                <FaCamera />
              </button>
            </div>
            <div className="admin-profile-info">
              <h2 className="admin-profile-name">{userInfo.name}</h2>
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

      {/* Personal Information - moved up here */}
      <div
        className="admin-profile-section"
        style={{ width: "100%", margin: "32px 0 0 0" }}
      >
        <div className="admin-profile-section-header">
          <h5 className="admin-profile-section-title">
            <FaUser className="me-2" />
            Thông tin cá nhân
          </h5>
        </div>
        <div className="admin-profile-info-grid">
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaUser className="me-2" />
              Họ và tên
            </label>
            <div className="admin-profile-info-value">{userInfo.name}</div>
          </div>
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaCalendarAlt className="me-2" />
              Ngày sinh
            </label>
            <div className="admin-profile-info-value">
              {userInfo.dateOfBirth.split("-").reverse().join("/")}
            </div>
          </div>
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaUser className="me-2" />
              Giới tính
            </label>
            <div className="admin-profile-info-value">{userInfo.gender}</div>
          </div>
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaUserTie className="me-2" />
              Chức vụ
            </label>
            <div className="admin-profile-info-value">
              {adminProfile.position}
            </div>
          </div>
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaEnvelope className="me-2" />
              Email
            </label>
            <div className="admin-profile-info-value">{userInfo.email}</div>
          </div>
          <div className="admin-profile-info-item">
            <label className="admin-profile-info-label">
              <FaPhone className="me-2" />
              Số điện thoại
            </label>
            <div className="admin-profile-info-value">{userInfo.phone}</div>
          </div>
          <div className="admin-profile-info-item full-width">
            <label className="admin-profile-info-label">
              <FaMapMarkerAlt className="me-2" />
              Địa chỉ
            </label>
            <div className="admin-profile-info-value">{userInfo.address}</div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      {/* Đã xoá sidebar và các phần không cần thiết */}

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
                        <FaUser className="me-2" />
                        Họ và tên
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
                        <FaEnvelope className="me-2" />
                        Email
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
                        <FaPhone className="me-2" />
                        Số điện thoại
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

                  <Col md={12}>
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaMapMarkerAlt className="me-2" />
                        Địa chỉ
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
                  <Col md={12} className="mb-3">
                    <Form.Group className="admin-form-group">
                      <Form.Label className="admin-form-label">
                        <FaCamera className="me-2" />
                        Ảnh đại diện
                      </Form.Label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <img
                          src={previewImage || "/uploads/default.jpg"}
                          alt="Preview"
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #eee",
                            marginRight: 12,
                          }}
                        />
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ maxWidth: 220 }}
                        />
                      </div>
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
              <Form.Label className="admin-form-label">
                Mật khẩu hiện tại
              </Form.Label>
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
              <Form.Label className="admin-form-label">
                Xác nhận mật khẩu mới
              </Form.Label>
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
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
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
