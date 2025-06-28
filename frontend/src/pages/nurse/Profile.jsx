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
  FaUserMd,
} from "react-icons/fa";
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
      // showNotification("Cập nhật thông tin thành công!", "success");
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      // showNotification("Lỗi khi cập nhật thông tin!", "error");
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
      // showNotification("Mật khẩu xác nhận không khớp!", "error");
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
        // showNotification("Đổi mật khẩu thành công!", "success");
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại!");
        // showNotification("Đổi mật khẩu thất bại!", "error");
      }
    } catch (error) {
      // alert("Có lỗi khi đổi mật khẩu!");
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
      // setSelectedImage(file);
      // console.log("dsad", selectedImage);
      hanldeUpdateProfile(file);
    }
    // } else {
    //   setSelectedImage(null);
    // }
  };

  const hanldeUpdateProfile = async (file) => {
    try {
      let imageUrl = nurseInfo.imageUrl;

      // Nếu userInfo.imageUrl là URL đầy đủ, tách lấy tên file
      if (imageUrl && imageUrl.startsWith("http")) {
        // Lấy phần sau cùng của đường dẫn
        imageUrl = imageUrl.split("/").pop();
      }

      if (file) {
        imageUrl = await uploadAvatar(file);
      }

      await updateProfile(nurseId, {
        ...formData,
        imageUrl,
      });

      setEditMode(false);
      // Reload lại userInfo nếu muốn cập nhật giao diện ngay
      fetchNurseInfo(nurseId);
      // Reload lai Header
      updateAvatarVersion();
    } catch (error) {
      alert("Có lỗi khi lưu thông tin hoặc upload ảnh!");
      console.error(error);
    }
  };

  return (
    <div
      className="container-fluid nurse-theme medicine-management"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Updated CSS Styles with Pink Theme */}
      <style>
        {`
          .profile-management {
            background: linear-gradient(135deg, #f8f9fc 0%, #fce4ec 100%) !important;
            min-height: 100vh !important;
            padding: 0 !important;
          }
          
          .profile-header {
            background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
            color: white !important;
            padding: 2rem !important;
            margin: -1.5rem -1.5rem 2rem -1.5rem !important;
            border-radius: 0 0 20px 20px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .profile-avatar-container {
            position: relative !important;
            display: inline-block !important;
          }
          
          .profile-avatar {
            width: 120px !important;
            height: 120px !important;
            border-radius: 50% !important;
            border: 4px solid white !important;
            box-shadow: 0 8px 32px rgba(240, 98, 146, 0.3) !important;
            object-fit: cover !important;
            transition: all 0.3s ease !important;
          }
          
          .profile-avatar:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 12px 40px rgba(240, 98, 146, 0.4) !important;
          }
          
          .avatar-upload-btn {
            position: absolute !important;
            bottom: 0 !important;
            right: 0 !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            border: 3px solid white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(240, 98, 146, 0.3) !important;
          }
          
          .avatar-upload-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 20px rgba(240, 98, 146, 0.5) !important;
          }
          
          .profile-card {
            background: white !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
            border: none !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            margin-bottom: 2rem !important;
          }
          
          .profile-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 16px 48px rgba(240, 98, 146, 0.12) !important;
          }
          
          .profile-tabs .nav-tabs {
            border-bottom: none !important;
            background: linear-gradient(135deg, #fce4ec, #f8bbd9) !important;
            padding: 1rem !important;
            border-radius: 16px 16px 0 0 !important;
          }
          
          .profile-tabs .nav-link {
            border: none !important;
            border-radius: 12px !important;
            margin-right: 0.5rem !important;
            padding: 0.75rem 1.5rem !important;
            font-weight: 600 !important;
            color: #666 !important;
            background: transparent !important;
            transition: all 0.3s ease !important;
          }
          
          .profile-tabs .nav-link:hover {
            background: rgba(255, 255, 255, 0.7) !important;
            color: #E91E63 !important;
            transform: translateY(-2px) !important;
          }
          
          .profile-tabs .nav-link.active {
            background: white !important;
            color: #E91E63 !important;
            border-bottom: 3px solid #F06292 !important;
            box-shadow: 0 4px 16px rgba(240, 98, 146, 0.15) !important;
            transform: translateY(-2px) !important;
          }
          
          /* Enhanced Info Items */
          .info-item {
            display: flex !important;
            align-items: center !important;
            padding: 1.2rem !important;
            border-radius: 12px !important;
            background: linear-gradient(135deg, #fce4ec 0%, #ffffff 100%) !important;
            margin-bottom: 1rem !important;
            transition: all 0.3s ease !important;
            border: 2px solid rgba(240, 98, 146, 0.1) !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .info-item::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 4px !important;
            height: 100% !important;
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
          }
          
          .info-item:hover {
            background: linear-gradient(135deg, #f8bbd9 0%, #ffffff 100%) !important;
            transform: translateX(6px) !important;
            box-shadow: 0 8px 25px rgba(240, 98, 146, 0.15) !important;
            border-color: #F06292 !important;
          }
          
          .info-item:hover::before {
            opacity: 1 !important;
          }
          
          .info-icon {
            width: 45px !important;
            height: 45px !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-right: 1rem !important;
            font-size: 1.3rem !important;
            transition: all 0.3s ease !important;
          }
          
          .info-item:hover .info-icon {
            transform: scale(1.1) !important;
          }
          
          .info-icon.primary {
            background: linear-gradient(135deg, rgba(240, 98, 146, 0.2), rgba(233, 30, 99, 0.2)) !important;
            color: #F06292 !important;
            box-shadow: 0 4px 12px rgba(240, 98, 146, 0.2) !important;
          }
          
          .info-icon.success {
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)) !important;
            color: #4caf50 !important;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2) !important;
          }
          
          .info-icon.warning {
            background: linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 87, 34, 0.2)) !important;
            color: #ff9800 !important;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2) !important;
          }
          
          .info-icon.purple {
            background: linear-gradient(135deg, rgba(240, 98, 146, 0.2), rgba(194, 24, 91, 0.2)) !important;
            color: #C2185B !important;
            box-shadow: 0 4px 12px rgba(194, 24, 91, 0.2) !important;
          }
          
          .status-badge {
            padding: 0.6rem 1.2rem !important;
            border-radius: 20px !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s ease !important;
          }
          
          .status-badge.active {
            background: linear-gradient(135deg, #F8BBD9, #F06292) !important;
            color: white !important;
            border: 2px solid rgba(240, 98, 146, 0.3) !important;
            box-shadow: 0 4px 12px rgba(240, 98, 146, 0.3) !important;
          }
          
          .status-badge:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(240, 98, 146, 0.4) !important;
          }
          
          /* Enhanced Buttons */
          .edit-btn,
          .save-btn,
          .cancel-btn {
            padding: 0.8rem 2rem !important;
            border-radius: 25px !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            transition: all 0.3s ease !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
          
          .edit-btn {
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            color: white !important;
          }
          
          .edit-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(240, 98, 146, 0.4) !important;
            background: linear-gradient(135deg, #E91E63, #C2185B) !important;
          }
          
          .save-btn {
            background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
            color: white !important;
          }
          
          .save-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
          }
          
          .cancel-btn {
            background: linear-gradient(135deg, #6c757d, #495057) !important;
            color: white !important;
          }
          
          .cancel-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4) !important;
          }
          
          /* Enhanced Form Elements */
          .form-control {
            border: 2px solid #fce4ec !important;
            border-radius: 10px !important;
            padding: 0.8rem 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
          }
          
          .form-control:focus {
            border-color: #F06292 !important;
            box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
            background: #fefefe !important;
            transform: translateY(-1px) !important;
          }
          
          .form-select {
            border: 2px solid #fce4ec !important;
            border-radius: 10px !important;
            padding: 0.8rem 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
          }
          
          .form-select:focus {
            border-color: #F06292 !important;
            box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
            transform: translateY(-1px) !important;
          }
          
          .form-check-input:checked {
            background-color: #F06292 !important;
            border-color: #F06292 !important;
          }
          
          .form-check-input:focus {
            box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
          }
          
          /* Enhanced Modal Styling */
          .medicine-detail-modal .modal-content {
            border: none !important;
            border-radius: 20px !important;
            box-shadow: 0 25px 80px rgba(240, 98, 146, 0.2) !important;
            overflow: hidden !important;
          }
          
          .modal-header-custom {
            background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
            color: white !important;
            padding: 1.5rem 2rem !important;
            border-bottom: none !important;
          }
          
          .modal-body-custom {
            background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
            padding: 2rem !important;
          }
          
          .modal-footer-custom {
            background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
            border-top: none !important;
            padding: 1.5rem 2rem !important;
          }
          
          .modal-icon {
            color: white !important;
            margin-right: 0.5rem !important;
            font-size: 1.3rem !important;
          }
          
          /* Enhanced Badge Colors */
          .badge {
            background: linear-gradient(135deg, #F8BBD9, #F06292) !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 0.4rem 0.8rem !important;
            font-weight: 600 !important;
          }
          
          .badge:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(240, 98, 146, 0.3) !important;
          }
          
          /* Enhanced Notification Styling */
          .notification-alert {
            border-radius: 12px !important;
            border: none !important;
            box-shadow: 0 8px 32px rgba(240, 98, 146, 0.15) !important;
            backdrop-filter: blur(10px) !important;
          }
          
          /* Section Headers */
          h5 {
            color: #E91E63 !important;
            font-weight: 700 !important;
            margin-bottom: 1.5rem !important;
          }
          
          /* Loading and Animation Effects */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .info-item {
            animation: fadeInUp 0.5s ease-out !important;
          }
          
          .info-item:nth-child(1) { animation-delay: 0.1s !important; }
          .info-item:nth-child(2) { animation-delay: 0.2s !important; }
          .info-item:nth-child(3) { animation-delay: 0.3s !important; }
          .info-item:nth-child(4) { animation-delay: 0.4s !important; }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .profile-header {
              padding: 1.5rem !important;
              text-align: center !important;
            }
            
            .profile-avatar {
              width: 100px !important;
              height: 100px !important;
            }
            
            .info-item {
              flex-direction: column !important;
              text-align: center !important;
              padding: 1rem !important;
            }
            
            .info-icon {
              margin-bottom: 0.5rem !important;
              margin-right: 0 !important;
            }
            
            .edit-btn,
            .save-btn,
            .cancel-btn {
              width: 100% !important;
              justify-content: center !important;
              margin-bottom: 0.5rem !important;
            }
          }
        `}
      </style>

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
                src={nurseInfo.imageUrl}
                alt="Avatar"
                className="profile-avatar"
              />
              <div
                className="avatar-upload-btn"
                title="Đổi ảnh đại diện"
                onClick={
                  // Trigger click vào input type="file"
                  () => fileInputRef.current.click()
                }
              >
                <FaCamera style={{ color: "white", fontSize: "14px" }} />
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
                  {nurseInfo.name}
                </h1>
                {/* <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                  <Badge className="status-badge active">
                    <FaStethoscope className="me-1" />
                    {nurseInfo.position}
                  </Badge>
                  <Badge
                    bg="light"
                    text="dark"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    <FaIdCard className="me-1" />
                    {nurseInfo.id}
                  </Badge>
                  <Badge
                    bg="info"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    <FaBuilding className="me-1" />
                    {nurseInfo.department}
                  </Badge>
                </div> */}
              </div>
              <div className="d-flex gap-2">
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
              {/* <Nav.Item>
                <Nav.Link eventKey="professional">
                  <FaUserNurse className="me-2" />
                  Thông tin nghề nghiệp
                </Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FaShieldAlt className="me-2" />
                  Bảo mật
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="settings">
                  <FaCog className="me-2" />
                  Cài đặt
                </Nav.Link>
              </Nav.Item> */}
            </Nav>

            <Tab.Content style={{ padding: "2rem" }}>
              <Tab.Pane eventKey="profile">
                <Row>
                  <Col lg={6}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaUser className="me-2" style={{ color: "#667eea" }} />
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
                          <div style={{ color: "#666" }}>{nurseInfo.email}</div>
                        )}
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon warning">
                        <FaBirthdayCake />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Ngày sinh
                        </div>
                        {editMode ? (
                          <Form.Control
                          disabled
                            type="date"
                            value={formatDDMMYYYY(nurseInfo.dateOfBirth)}
                            onChange={(e) =>
                              setFormData({ ...formData, dob: e.target.value })
                            }
                          />
                        ) : (
                          <div style={{ color: "#666" }}>{formatDDMMYYYY(nurseInfo.dateOfBirth)}</div>
                        )}
                      </div>
                    </div> */}

                    <div className="info-item">
                      <div className="info-icon purple">
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
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Other">Khác</option>
                          </Form.Select>
                        ) : (
                          <div style={{ color: "#666" }}>
                            {nurseInfo.gender === "Male"
                              ? "Nam"
                              : nurseInfo.gender === "Female"
                              ? "Nữ"
                              : "Khác"}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaMapMarkerAlt
                        className="me-2"
                        style={{ color: "#667eea" }}
                      />
                      Thông tin liên hệ
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
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
                            as="textarea"
                            rows={2}
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div style={{ color: "#666" }}>
                            {nurseInfo.address}
                          </div>
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
                          />
                        ) : (
                          <div style={{ color: "#666" }}>{nurseInfo.phone}</div>
                        )}
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaHeart />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Nhóm máu</div>
                        {editMode ? (
                          <Form.Select
                            value={formData.bloodType}
                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        ) : (
                          <div style={{ color: '#666' }}>{formData.bloodType}</div>
                        )}
                      </div>
                    </div> */}

                    {/* <div className="info-item">
                      <div className="info-icon purple">
                        <FaExclamationTriangle />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Dị ứng</div>
                        {editMode ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            placeholder="Mô tả các loại dị ứng (nếu có)"
                          />
                        ) : (
                          <div style={{ color: '#666' }}>{formData.allergies}</div>
                        )}
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="professional">
                <Row>
                  <Col lg={6}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaUserNurse
                        className="me-2"
                        style={{ color: "#667eea" }}
                      />
                      Thông tin công việc
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaBuilding />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Phòng ban
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.department}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaStethoscope />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Chức vụ
                        </div>
                        <div style={{ color: "#666" }}>{formData.position}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon warning">
                        <FaCalendarAlt />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Ngày bắt đầu
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.startDate}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon purple">
                        <FaChartLine />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Kinh nghiệm
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.experience}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaCertificate
                        className="me-2"
                        style={{ color: "#667eea" }}
                      />
                      Bằng cấp & Chứng chỉ
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaGraduationCap />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Trình độ học vấn
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.education}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon success">
                        <FaCertificate />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Chứng chỉ hành nghề
                        </div>
                        <div style={{ color: "#666" }}>{formData.license}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon warning">
                        <FaMedkit />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Chuyên môn
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.specialization}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon purple">
                        <FaAward />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Trạng thái
                        </div>
                        <Badge className="status-badge active">
                          <FaCheck className="me-1" />
                          {formData.status}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="security">
                <Row>
                  <Col lg={8}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaShieldAlt
                        className="me-2"
                        style={{ color: "#667eea" }}
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

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaHistory />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Lịch sử đăng nhập</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Xem lịch sử đăng nhập gần đây</div>
                        <Button variant="outline-success" size="sm">
                          <FaHistory className="me-1" />
                          Xem lịch sử
                        </Button>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="settings">
                <Row>
                  <Col lg={8}>
                    <h5
                      className="mb-4"
                      style={{ fontWeight: "700", color: "#333" }}
                    >
                      <FaCog className="me-2" style={{ color: "#667eea" }} />
                      Cài đặt ứng dụng
                    </h5>

                    <div className="info-item">
                      <div className="info-icon primary">
                        <FaBell />
                      </div>
                      <div className="flex-grow-1">
                        <div
                          style={{ fontWeight: "600", marginBottom: "0.25rem" }}
                        >
                          Thông báo
                        </div>
                        <div style={{ color: "#666", marginBottom: "0.5rem" }}>
                          Quản lý thông báo và cảnh báo
                        </div>
                        <Form.Check
                          type="switch"
                          id="notifications"
                          label="Nhận thông báo qua email"
                          defaultChecked
                        />
                        <Form.Check
                          type="switch"
                          id="push-notifications"
                          label="Thông báo đẩy"
                          defaultChecked
                        />
                      </div>
                    </div>

                    {/* <div className="info-item">
                      <div className="info-icon success">
                        <FaLanguage />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Ngôn ngữ</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Chọn ngôn ngữ hiển thị</div>
                        <Form.Select style={{ maxWidth: '200px' }}>
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </Form.Select>
                      </div>
                    </div> */}

                    {/* <div className="info-item">
                      <div className="info-icon warning">
                        <FaPalette />
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Giao diện</div>
                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>Tùy chỉnh giao diện ứng dụng</div>
                        <div className="d-flex gap-2">
                          <Button variant="outline-primary" size="sm">
                            <FaSun className="me-1" />
                            Sáng
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <FaMoon className="me-1" />
                            Tối
                          </Button>
                        </div>
                      </div>
                    </div> */}
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
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="secondary"
            onClick={() => setShowChangePassword(false)}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="fa-spin me-1" />
            ) : (
              <FaSave className="me-1" />
            )}
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
