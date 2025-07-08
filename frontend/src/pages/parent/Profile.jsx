import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Nav,
  Tab,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserGraduate,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";
import {
  getChildrenInfo,
  getParentInfo,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "../../api/parent/ProfileApi";
import { formatDDMMYYYY } from "../../utils/dateFormatter";
import { useAvatar } from "../../context/AvatarContext";
import { toast } from "react-toastify";
// Styles được import từ main.jsx

const Profile = () => {
  const parentId = localStorage.userId;
  const { updateAvatarVersion } = useAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [parentInfo, setParentInfo] = useState([]);
  const [formData, setFormData] = useState([
    {
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      imageUrl: "",
      dateOfBirth: "",
      roleName: "Parent",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const fetchParentInfo = async () => {
    try {
      const res = await getParentInfo(parentId);
      if (res) {
        setParentInfo(res);
        setFormData(res);
      } else {
        setParentInfo([]);
      }
    } catch (error) {
      console.error("Có lỗi khi lấy thông tin phụ huynh!");
    }
  };

  useEffect(() => {
    fetchParentInfo();
  }, []);

  const fetchChildrenInfo = async () => {
    try {
      const res = await getChildrenInfo(parentId);
      if (res) {
        setChildren(res);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Có lỗi khi lấy thông tin con em!");
    }
  };

  useEffect(() => {
    fetchChildrenInfo();
  }, [parentId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      hanldeUpdateProfile(file);
    } else {
      setSelectedImage(null);
    }
  };

  const hanldeUpdateProfile = async (file) => {
    try {
      let imageUrl = parentInfo.imageUrl;

      // Nếu userInfo.imageUrl là URL đầy đủ, tách lấy tên file
      if (imageUrl && imageUrl.startsWith("http")) {
        // Lấy phần sau cùng của đường dẫn
        imageUrl = imageUrl.split("/").pop();
      }

      if (file) {
        imageUrl = await uploadAvatar(file);
      }

      await updateProfile(parentId, {
        ...formData,
        imageUrl,
      });

      setIsEditing(false);
      // Reload lại userInfo nếu muốn cập nhật giao diện ngay
      fetchParentInfo();
      // Reload lai Header
      updateAvatarVersion();
    } catch (error) {
      alert("Có lỗi khi lưu thông tin hoặc upload ảnh!");
      console.error(error);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      hanldeUpdateProfile();
      setIsEditing(false);
      setLoading(false);
      setNotification({
        type: "success",
        message: "Cập nhật thông tin thành công!",
      });
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const handleCancel = () => {
    setFormData(parentInfo);
    setIsEditing(false);
  };

  const handleUpdatePassword = async () => {
    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmNewPassword
    ) {
      setNotification({
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (password.newPassword !== password.confirmNewPassword) {
      setNotification({
        type: "error",
        message: "Mật khẩu mới và mật khẩu xác nhận không khớp!",
      });
      setTimeout(() => setNotification(null), 3000);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }
    try {
      const res = await updatePassword(parentId, password);
      if (res?.success === true) {
        setNotification({
          type: "success",
          message: "Cập nhật mật khẩu thành công!",
        });
        setShowChangePasswordModal(false);
        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setNotification({
          type: "error",
          message: res?.message || "Có lỗi khi đổi mật khẩu!",
        });
      }
    } catch (error) {
      console.error("Có lỗi khi đổi mật khẩu!");
      setNotification({
        type: "error",
        message: error.message || "Có lỗi khi đổi mật khẩu!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
  };

  useEffect(() => {
    if (notification) {
      if (notification.type === "success") {
        toast.success(notification.message);
      } else {
        toast.error(notification.message);
      }
    }
    setNotification(null);
  }, [notification]);

  return (
    <div className="parent-container">
      {/* Profile Header */}
      <div className="parent-page-header-profile">
        <div className="parent-page-header-bg"></div>
        <div className="parent-page-header-content">
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src={parentInfo.imageUrl}
              alt="Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "4px solid white",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                background: "var(--parent-accent)",
                color: "white",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={
                // Trigger click vào input type="file"
                () => fileInputRef.current.click()
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "var(--parent-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "var(--parent-accent)";
              }}
            >
              <FaCamera size={14} />
            </div>
            {/* Input ẩn để chọn file */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleChangeImage}
            />
          </div>
          <h1 className="parent-page-title">
            <FaUser />
            {parentInfo.name}
          </h1>
          <p className="parent-page-subtitle">{parentInfo.role}</p>
        </div>
      </div>

      <Container>
        {/* Notification */}
        {/* {notification && (
          <Alert
            variant={notification.type === "success" ? "success" : "danger"}
            dismissible
            onClose={() => setNotification(null)}
            className="parent-animate-fade-in"
            style={{
              borderRadius: "var(--parent-border-radius-md)",
              border: "none",
              boxShadow: "var(--parent-shadow-md)",
            }}
          >
            <FaCheck className="me-2" />
            {notification.message}
          </Alert>
        )} */}

        {/* Profile Content */}
        <div className="parent-card parent-animate-slide-in">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="pills" className="justify-content-center mb-4">
              <Nav.Item>
                <Nav.Link eventKey="personal" className="mx-2">
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="children" className="mx-2">
                  <FaUsers className="me-2" />
                  Thông tin con em
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="security" className="mx-2">
                  <FaShieldAlt className="me-2" />
                  Bảo mật
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Personal Information Tab */}
              <Tab.Pane eventKey="personal">
                <div className="parent-card-header">
                  <Col>
                    <h3 className="parent-card-title">
                      <FaUser />
                      Thông tin cá nhân
                    </h3>
                  </Col>
                  <Col className="ms-auto text-end">
                    {!isEditing ? (
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setFormData(parentInfo);
                          setActiveTab("personal");
                        }}
                        className="parent-primary-btn"
                      >
                        <FaEdit className="me-2" />
                        Chỉnh sửa thông tin
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          className="parent-primary-btn me-3"
                        >
                          {loading ? (
                            <FaSpinner className="me-2 fa-spin" />
                          ) : (
                            <FaSave className="me-2" />
                          )}
                          Lưu thay đổi
                        </Button>
                        <Button
                          onClick={handleCancel}
                          disabled={loading}
                          className="parent-secondary-btn"
                        >
                          <FaTimes className="me-2" />
                          Hủy bỏ
                        </Button>
                      </>
                    )}
                  </Col>
                </div>
                <div className="parent-card-body">
                  <Row className="g-4">
                    {/* Basic Information */}
                    <Col md={6}>
                      <div
                        style={{
                          background: "var(--parent-gradient-card)",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-lg)",
                          border: "1px solid rgba(30, 126, 156, 0.1)",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaIdCard />
                          Thông tin cơ bản
                        </h5>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaUser className="me-2" />
                              Họ và tên
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {parentInfo.name}
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaEnvelope className="me-2" />
                              Email
                            </label>
                            {isEditing ? (
                              <input
                                disabled
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {parentInfo.email}
                              </div>
                            )}
                          </div>
                          {/* <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaPhone className="me-2" />
                              Số điện thoại
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {formData.phone}
                              </div>
                            )}
                          </div> */}
                        </div>
                      </div>
                    </Col>

                    {/* Personal Details */}
                    <Col md={6}>
                      <div
                        style={{
                          background: "var(--parent-gradient-card)",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-lg)",
                          border: "1px solid rgba(30, 126, 156, 0.1)",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaBirthdayCake />
                          Thông tin chi tiết
                        </h5>
                        <div style={{ display: "grid", gap: "1rem" }}>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaBirthdayCake className="me-2" />
                              Ngày sinh
                            </label>
                            {isEditing ? (
                              <input
                                disabled
                                type="text"
                                value={formData.dateOfBirth}
                                onChange={(e) =>
                                  handleInputChange(
                                    "dateOfBirth",
                                    e.target.value
                                  )
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {formatDDMMYYYY(parentInfo.dateOfBirth)}
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaVenusMars className="me-2" />
                              Giới tính
                            </label>
                            {isEditing ? (
                              // <input
                              //   disabled
                              //   type="text"
                              //   value={formData.gender}
                              //   onChange={(e) =>
                              //     handleInputChange("gender", e.target.value)
                              //   }
                              //   className="parent-form-control"
                              // />
                              <select
                                value={formData.gender || ""} // fallback về "" nếu chưa có
                                onChange={(e) =>
                                  handleInputChange("gender", e.target.value)
                                }
                                className="parent-form-control"
                              >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                              </select>
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {parentInfo.gender === "Male"
                                  ? "Nam"
                                  : parentInfo.gender === "Female"
                                    ? "Nữ"
                                    : "Khác"}
                              </div>
                            )}
                          </div>
                          {/* <div>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaBriefcase className="me-2" />
                              Nghề nghiệp
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) =>
                                  handleInputChange(
                                    "occupation",
                                    e.target.value
                                  )
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {formData.occupation}
                              </div>
                            )}
                          </div> */}
                        </div>
                      </div>
                    </Col>

                    {/* Address and Contact */}
                    <Col md={12}>
                      <div
                        style={{
                          background: "var(--parent-gradient-card)",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-lg)",
                          border: "1px solid rgba(30, 126, 156, 0.1)",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaMapMarkerAlt />
                          Địa chỉ & Liên hệ
                        </h5>
                        <Row className="g-3">
                          <Col md={8}>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaMapMarkerAlt className="me-2" />
                              Địa chỉ
                            </label>
                            {isEditing ? (
                              <textarea
                                value={formData.address}
                                onChange={(e) =>
                                  handleInputChange("address", e.target.value)
                                }
                                className="parent-form-control"
                                rows="2"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {parentInfo.address}
                              </div>
                            )}
                          </Col>
                          <Col md={4}>
                            <label
                              style={{
                                display: "block",
                                fontWeight: "600",
                                color: "var(--parent-primary)",
                                marginBottom: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <FaPhone className="me-2" />
                              Số điện thoại
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className="parent-form-control"
                              />
                            ) : (
                              <div
                                style={{
                                  padding: "0.75rem",
                                  background: "#f8f9fa",
                                  borderRadius:
                                    "var(--parent-border-radius-md)",
                                  fontWeight: "600",
                                }}
                              >
                                {parentInfo.phone}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab.Pane>

              {/* Children Information Tab */}
              <Tab.Pane eventKey="children">
                <div className="parent-card-header">
                  <h3 className="parent-card-title">
                    <FaUsers />
                    Thông tin con em
                  </h3>
                </div>
                <div className="parent-card-body">
                  {children.map((child, index) => (
                    <div
                      key={index}
                      style={{
                        background:
                          "linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)",
                        padding: "1.5rem",
                        borderRadius: "var(--parent-border-radius-lg)",
                        border: "2px solid var(--parent-secondary)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            margin: 0,
                          }}
                        >
                          <FaUserGraduate />
                          {/* {child.studentName} */}
                        </h5>
                        {/* <Badge
                          style={{
                            background: "var(--parent-gradient-button)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          {child.className}
                        </Badge> */}
                      </div>
                      <Row className="g-3">
                        <Col md={6}>
                          <div
                            style={{
                              background: "white",
                              padding: "1rem",
                              borderRadius: "var(--parent-border-radius-md)",
                            }}
                          >
                            <div
                              style={{
                                color: "#6c757d",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Mã học sinh
                            </div>
                            <div
                              style={{
                                color: "var(--parent-primary)",
                                fontWeight: "700",
                              }}
                            >
                              {child.studentNumber}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div
                            style={{
                              background: "white",
                              padding: "1rem",
                              borderRadius: "var(--parent-border-radius-md)",
                            }}
                          >
                            <div
                              style={{
                                color: "#6c757d",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Tên học sinh
                            </div>
                            <div
                              style={{
                                color: "var(--parent-primary)",
                                fontWeight: "700",
                              }}
                            >
                              {child.studentName}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div
                            style={{
                              background: "white",
                              padding: "1rem",
                              borderRadius: "var(--parent-border-radius-md)",
                            }}
                          >
                            <div
                              style={{
                                color: "#6c757d",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Lớp
                            </div>
                            <div
                              style={{
                                color: "var(--parent-primary)",
                                fontWeight: "700",
                              }}
                            >
                              {child.className}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div
                            style={{
                              background: "white",
                              padding: "1rem",
                              borderRadius: "var(--parent-border-radius-md)",
                            }}
                          >
                            <div
                              style={{
                                color: "#6c757d",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                marginBottom: "0.25rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Ngày sinh
                            </div>
                            <div
                              style={{
                                color: "var(--parent-primary)",
                                fontWeight: "700",
                              }}
                            >
                              {formatDDMMYYYY(child.dateOfBirth)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              </Tab.Pane>

              {/* Security Tab */}
              <Tab.Pane eventKey="security">
                <div className="parent-card-header">
                  <h3 className="parent-card-title">
                    <FaShieldAlt />
                    Cài đặt bảo mật
                  </h3>
                </div>
                <div className="parent-card-body">
                  <Row className="g-4">
                    <Col>
                      <div
                        style={{
                          background: "var(--parent-gradient-card)",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-lg)",
                          border: "1px solid rgba(30, 126, 156, 0.1)",
                          height: "100%",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaLock />
                          Mật khẩu
                        </h5>
                        <p className="text-muted mb-3">
                          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                        </p>
                        <Col className="text-end">
                          <Button
                            onClick={() => setShowChangePasswordModal(true)}
                            className="parent-primary-btn "
                          >
                            <FaKey className="me-2" />
                            Đổi mật khẩu
                          </Button>
                        </Col>
                      </div>
                    </Col>
                    {/* <Col md={6}>
                      <div
                        style={{
                          background: "var(--parent-gradient-card)",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-lg)",
                          border: "1px solid rgba(30, 126, 156, 0.1)",
                          height: "100%",
                        }}
                      >
                        <h5
                          style={{
                            color: "var(--parent-primary)",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FaBell />
                          Thông báo
                        </h5>
                        <p className="text-muted mb-3">
                          Quản lý cài đặt thông báo của bạn
                        </p>
                        <Button className="parent-secondary-btn">
                          <FaCog className="me-2" />
                          Cài đặt thông báo
                        </Button>
                      </div>
                    </Col> */}
                  </Row>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>

      {/* Change Password Modal */}
      <Modal
        show={showChangePasswordModal}
        onHide={() => {
          setShowChangePasswordModal(false);
          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          })
        }}
        centered
        className="parent-modal"
      >
        <Modal.Header
          closeButton
          style={{
            background: "var(--parent-gradient-primary)",
            color: "white",
          }}
        >
          <Modal.Title>
            <FaLock className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "var(--parent-gradient-card)" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label
                style={{ fontWeight: "600", color: "var(--parent-primary)" }}
              >
                Mật khẩu hiện tại
              </Form.Label>
              <Form.Control
                type="password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({ ...password, currentPassword: e.target.value })
                }
                className="parent-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label
                style={{ fontWeight: "600", color: "var(--parent-primary)" }}
              >
                Mật khẩu mới
              </Form.Label>
              <Form.Control
                type="password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
                className="parent-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label
                style={{ fontWeight: "600", color: "var(--parent-primary)" }}
              >
                Xác nhận mật khẩu mới
              </Form.Label>
              <Form.Control
                type="password"
                value={password.confirmNewPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    confirmNewPassword: e.target.value,
                  })
                }
                className="parent-form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: "var(--parent-gradient-card)" }}>
          <Button
            onClick={() => {
              setShowChangePasswordModal(false);
              setPassword({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            }}
            className="parent-secondary-btn"
          >
            <FaTimes className="me-2" />
            Hủy
          </Button>
          <Button
            onClick={() => {
              handleUpdatePassword();
            }}
            className="parent-primary-btn"
          >
            <FaSave className="me-2" />
            Cập nhật mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
