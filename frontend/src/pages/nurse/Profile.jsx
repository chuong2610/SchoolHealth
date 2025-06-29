import React, { useState, useEffect, useRef } from "react";
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
  Tab,
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

import {
  getNurseInfo,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "../../api/nurse/ProfileApi";
import { formatDDMMYYYY } from "../../utils/dateFormatter";
import { useAvatar } from "../../context/AvatarContext";
import { toast } from "react-toastify";
// CSS được import tự động từ main.jsx

// const nurseInfo = {
//   avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//   name: "Nguyễn Thị B",
//   id: "YT001",
//   dob: "12/05/1985",
//   gender: "Nữ",
//   email: "nguyenthib@nurse.edu.vn",
//   phone: "0901 234 567",
//   address: "123 Đường ABC, Quận 1, TP.HCM",
//   department: "Phòng Y tế Trường",
//   position: "Y tá trưởng",
//   startDate: "01/09/2020",
//   education: "Cử nhân Điều dưỡng",
//   license: "CK-123456789",
//   experience: "5 năm",
//   specialization: "Chăm sóc sức khỏe học đường",
//   emergencyContact: "0912 345 678",
//   bloodType: "A+",
//   allergies: "Không có",
//   status: "Đang làm việc",
// };

const Profile = () => {
  const nurseId = localStorage.userId;
  // Professional state management
  const [nurseInfo, setNurseInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    imageUrl: "",
    dateOfBirth: "",
    roleName: "",
  });
  const { updateAvatarVersion } = useAvatar();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState(nurseInfo);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const fileInputRef = useRef(null);

  const fetchNurseInfo = async () => {
    try {
      const res = await getNurseInfo(nurseId);
      if (res) {
        setNurseInfo(res);
        setFormData(res);
      }
    } catch (error) {
      console.log("Error fetching nurse info:", error);
    }
  };
  useEffect(() => {
    fetchNurseInfo();
  }, []);

  // Professional notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEditMode(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await updatePassword(nurseId, passwordData);
      if (res?.success === true) {
        toast.success("Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi đổi mật khẩu!");
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      hanldeUpdateProfile(file);
    }
  };

  const hanldeUpdateProfile = async (file) => {
    try {
      if (file) {
        const res = await uploadAvatar(nurseId, file);
        if (res?.success === true) {
          setNurseInfo((prev) => ({ ...prev, imageUrl: res.imageUrl }));
          updateAvatarVersion();
          toast.success("Cập nhật ảnh thành công");
        } else {
          toast.error("Cập nhật ảnh thất bại");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật ảnh thất bại");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await updateProfile(nurseId, formData);
      if (res?.success === true) {
        setNurseInfo(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile-management">
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
                src={nurseInfo.imageUrl || "/default-avatar.png"}
                alt="Avatar"
                className="profile-avatar"
              />
              <div
                className="avatar-upload-btn"
                title="Đổi ảnh đại diện"
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera style={{ color: "white", fontSize: "14px" }} />
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleChangeImage}
              />
            </div>
          </div>
          <div className="col-md">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-md-between">
              <div className="text-center text-md-start mb-3 mb-md-0">
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {nurseInfo.name || "Mary Nurse"}
                </h1>
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
                      onClick={() => {
                        handleSave();
                        hanldeUpdateProfile();
                      }}
                      disabled={loading}
                      className="save-btn"
                    >
                      {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
                      Lưu
                    </Button>
                    <Button
                      onClick={() => {
                        setEditMode(false);
                        handleUpdateProfile();
                      }}
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
              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FaShieldAlt className="me-2" />
                  Bảo mật
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content style={{ padding: "2rem" }}>
              <Tab.Pane eventKey="profile">
                <Row>
                  <Col lg={6}>
                    <h5>
                      <FaUser className="me-2" style={{ color: "#FF6B8D" }} />
                      Thông tin cơ bản
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaEnvelope />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Email
                        </div>
                        {editMode ? (
                          <Form.Control
                            disabled
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div style={{ color: "#666" }}>{nurseInfo.email || "nurse@gmail.com"}</div>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon warning">
                        <FaVenusMars />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Giới tính
                        </div>
                        {editMode ? (
                          <Form.Select
                            value={formData.gender}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </Form.Select>
                        ) : (
                          <div style={{ color: "#666" }}>{nurseInfo.gender || "Nữ"}</div>
                        )}
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <h5>
                      <FaMapMarkerAlt className="me-2" style={{ color: "#FF6B8D" }} />
                      Thông tin liên hệ
                    </h5>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Địa chỉ
                        </div>
                        {editMode ? (
                          <Form.Control
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                            placeholder="Nhập địa chỉ"
                          />
                        ) : (
                          <div style={{ color: "#666" }}>{nurseInfo.address || "456 Oak Ave"}</div>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaPhone />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Số điện thoại
                        </div>
                        {editMode ? (
                          <Form.Control
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <div style={{ color: "#666" }}>{nurseInfo.phone || "2"}</div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="security">
                <Row>
                  <Col lg={8}>
                    <h5>
                      <FaShieldAlt
                        className="me-2"
                        style={{ color: "#FF6B8D" }}
                      />
                      Bảo mật tài khoản
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaLock />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Mật khẩu
                        </div>
                        <div style={{ color: "#666", marginBottom: "0.5rem" }}>
                          Đổi mật khẩu để bảo vệ tài khoản
                        </div>
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
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmNewPassword: e.target.value,
                  })
                }
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={() => setShowChangePassword(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #FF6B8D, #FF4757)",
                  border: "none",
                }}
              >
                {loading ? <FaSpinner className="fa-spin me-1" /> : null}
                Đổi mật khẩu
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
