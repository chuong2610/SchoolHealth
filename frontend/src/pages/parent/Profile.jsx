import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Badge,
  Nav,
  Tab,
  Alert
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
  FaBell,
  FaCog,
  FaLanguage,
  FaCheck,
  FaSpinner,
  FaHistory,
  FaUsers
} from 'react-icons/fa';
// Styles được import từ main.jsx

const parentInfo = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  name: "Nguyễn Văn B",
  code: "PH001",
  email: "nguyenvanb@gmail.com",
  phone: "0912 345 678",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  dob: "15/05/1980",
  gender: "Nam",
  role: "Phụ huynh",
  emergencyContact: "0909 876 543",
  workplace: "Công ty ABC",
  occupation: "Kỹ sư",
  relationship: "Bố",
  children: [
    {
      name: "Nguyễn Văn C",
      class: "10A1",
      id: "HS001",
      relationship: "Con trai",
      birthDate: "12/03/2008",
      bloodType: "O+",
      allergies: "Không có"
    },
  ],
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState(parentInfo);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setIsEditing(false);
      setLoading(false);
      setNotification({
        type: 'success',
        message: 'Cập nhật thông tin thành công!'
      });
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const handleCancel = () => {
    setFormData(parentInfo);
    setIsEditing(false);
  };

  return (
    <div
      className="parent-theme parent-profile"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh"
      }}
    >
      {/* Professional CSS Override */}
      <style>
        {`
          .parent-profile {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
          }
          
          .profile-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 4rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .profile-header::before {
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
          
          .profile-avatar-container {
            position: relative !important;
            display: inline-block !important;
            margin-bottom: 1.5rem !important;
          }
          
          .profile-avatar {
            width: 150px !important;
            height: 150px !important;
            border-radius: 50% !important;
            border: 5px solid white !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
            object-fit: cover !important;
          }
          
          .avatar-upload {
            position: absolute !important;
            bottom: 10px !important;
            right: 10px !important;
            background: #f59e0b !important;
            color: white !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            border: 3px solid white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
          }
          
          .avatar-upload:hover {
            background: #d97706 !important;
            transform: scale(1.1) !important;
          }
          
          .profile-name {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 0.5rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
          }
          
          .profile-role {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            padding: 0.5rem 1.5rem !important;
            border-radius: 25px !important;
            font-weight: 600 !important;
            margin-bottom: 1.5rem !important;
            display: inline-block !important;
          }
          
          .action-buttons {
            display: flex !important;
            gap: 1rem !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          
          .profile-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .profile-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .profile-tabs {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            border-bottom: 3px solid #e5e7eb !important;
            padding: 0 !important;
          }
          
          .nav-pills .nav-link {
            background: transparent !important;
            border: 2px solid transparent !important;
            border-radius: 12px !important;
            margin: 0.5rem !important;
            padding: 1rem 1.5rem !important;
            color: #6b7280 !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .nav-pills .nav-link:hover {
            background: rgba(59, 130, 246, 0.1) !important;
            border-color: #3b82f6 !important;
            color: #3b82f6 !important;
          }
          
          .nav-pills .nav-link.active {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border-color: transparent !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3) !important;
          }
          
          .tab-content {
            padding: 2rem !important;
          }
          
          .info-section {
            margin-bottom: 2rem !important;
            padding: 1.5rem !important;
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            transition: all 0.3s ease !important;
          }
          
          .info-section:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1) !important;
          }
          
          .section-title {
            font-size: 1.3rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1.5rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            padding-bottom: 0.75rem !important;
            border-bottom: 2px solid #e5e7eb !important;
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
          
          .info-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
            gap: 1.5rem !important;
          }
          
          .info-item {
            background: white !important;
            padding: 1.25rem !important;
            border-radius: 12px !important;
            border: 2px solid #f3f4f6 !important;
            transition: all 0.3s ease !important;
          }
          
          .info-item:hover {
            border-color: #dbeafe !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1) !important;
          }
          
          .info-label {
            color: #6b7280 !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
            margin-bottom: 0.5rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          .info-value {
            color: #1f2937 !important;
            font-weight: 600 !important;
            font-size: 1.1rem !important;
            word-break: break-word !important;
          }
          
          .info-value input {
            border: 2px solid #e5e7eb !important;
            border-radius: 8px !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            width: 100% !important;
          }
          
          .info-value input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .children-section {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
            border: 2px solid #3b82f6 !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            margin-top: 2rem !important;
          }
          
          .child-card {
            background: white !important;
            border-radius: 12px !important;
            padding: 1.25rem !important;
            margin-bottom: 1rem !important;
            border: 2px solid #e5e7eb !important;
            transition: all 0.3s ease !important;
          }
          
          .child-card:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1) !important;
          }
          
          .child-card:last-child {
            margin-bottom: 0 !important;
          }
          
          .child-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 1rem !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }
          
          .child-name {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            color: #1e40af !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .child-badge {
            background: linear-gradient(135deg, #38b6ff, #2563eb) !important;
            color: white !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
          }
          
          .child-info {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 1rem !important;
          }
          
          .child-info-item {
            background: #f8f9fa !important;
            padding: 0.75rem !important;
            border-radius: 8px !important;
          }
          
          .child-info-label {
            color: #6b7280 !important;
            font-weight: 600 !important;
            font-size: 0.8rem !important;
            margin-bottom: 0.25rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          .child-info-value {
            color: #1f2937 !important;
            font-weight: 600 !important;
            font-size: 0.95rem !important;
          }
          
          .btn-action {
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          .btn-edit {
            background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
            border: none !important;
            color: white !important;
          }
          
          .btn-edit:hover {
            background: linear-gradient(135deg, #d97706, #f59e0b) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3) !important;
            color: white !important;
          }
          
          .btn-save {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            border: none !important;
            color: white !important;
          }
          
          .btn-save:hover {
            background: linear-gradient(135deg, #059669, #047857) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important;
            color: white !important;
          }
          
          .btn-cancel {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            border: none !important;
            color: white !important;
          }
          
          .btn-cancel:hover {
            background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
            color: white !important;
          }
          
          .btn-secondary-custom {
            background: linear-gradient(135deg, #6b7280, #9ca3af) !important;
            border: none !important;
            color: white !important;
          }
          
          .btn-secondary-custom:hover {
            background: linear-gradient(135deg, #4b5563, #6b7280) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3) !important;
            color: white !important;
          }
          
          .notification-alert {
            position: fixed !important;
            top: 2rem !important;
            right: 2rem !important;
            z-index: 9999 !important;
            min-width: 300px !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
          }
          
          @media (max-width: 768px) {
            .profile-header {
              padding: 2rem 0 3rem 0 !important;
              margin-bottom: 2rem !important;
            }
            
            .profile-name {
              font-size: 2rem !important;
            }
            
            .profile-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .action-buttons {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            .nav-pills .nav-link {
              margin: 0.25rem !important;
              padding: 0.75rem 1rem !important;
              font-size: 0.9rem !important;
            }
            
            .tab-content {
              padding: 1rem !important;
            }
            
            .info-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            
            .child-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            
            .child-info {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type}
          className="notification-alert"
          dismissible
          onClose={() => setNotification(null)}
        >
          <FaCheck className="me-2" />
          {notification.message}
        </Alert>
      )}

      {/* Profile Header */}
      <div className="profile-header">
        <Container>
          <div className="header-content">
            <div className="profile-avatar-container">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="profile-avatar"
              />
              <div className="avatar-upload">
                <FaCamera />
              </div>
            </div>

            <h1 className="profile-name">{formData.name}</h1>
            <div className="profile-role">
              <FaUser className="me-2" />
              {formData.role} - Mã: {formData.code}
            </div>

            <div className="action-buttons">
              {!isEditing ? (
                <Button
                  className="btn-action btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                  Chỉnh sửa thông tin
                </Button>
              ) : (
                <>
                  <Button
                    className="btn-action btn-save"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button
                    className="btn-action btn-cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <FaTimes />
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Profile Content */}
      <div className="profile-container">
        <Container>
          <Card className="profile-card">
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="pills" className="profile-tabs justify-content-center">
                <Nav.Item>
                  <Nav.Link eventKey="personal">
                    <FaUser />
                    Thông tin cá nhân
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="children">
                    <FaUsers />
                    Thông tin con em
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="security">
                    <FaShieldAlt />
                    Bảo mật
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings">
                    <FaCog />
                    Cài đặt
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="tab-content">
                {/* Personal Information Tab */}
                <Tab.Pane eventKey="personal">
                  <div className="info-section">
                    <h3 className="section-title">
                      <div className="section-icon">
                        <FaUser />
                      </div>
                      Thông tin liên hệ
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">
                          <FaEnvelope />
                          Email
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                          ) : (
                            formData.email
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaPhone />
                          Số điện thoại
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          ) : (
                            formData.phone
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaPhone />
                          Liên hệ khẩn cấp
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formData.emergencyContact}
                              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            />
                          ) : (
                            formData.emergencyContact
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaMapMarkerAlt />
                          Địa chỉ
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                          ) : (
                            formData.address
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">
                      <div className="section-icon">
                        <FaIdCard />
                      </div>
                      Thông tin cá nhân
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">
                          <FaBirthdayCake />
                          Ngày sinh
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => handleInputChange('dob', e.target.value)}
                            />
                          ) : (
                            formData.dob
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaVenusMars />
                          Giới tính
                        </div>
                        <div className="info-value">
                          {formData.gender}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaIdCard />
                          Nghề nghiệp
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.occupation}
                              onChange={(e) => handleInputChange('occupation', e.target.value)}
                            />
                          ) : (
                            formData.occupation
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaMapMarkerAlt />
                          Nơi làm việc
                        </div>
                        <div className="info-value">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.workplace}
                              onChange={(e) => handleInputChange('workplace', e.target.value)}
                            />
                          ) : (
                            formData.workplace
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Children Information Tab */}
                <Tab.Pane eventKey="children">
                  <div className="children-section">
                    <h3 className="section-title">
                      <div className="section-icon">
                        <FaUsers />
                      </div>
                      Thông tin con em ({formData.children.length} học sinh)
                    </h3>

                    {formData.children.map((child, index) => (
                      <div key={index} className="child-card">
                        <div className="child-header">
                          <div className="child-name">
                            <FaUserGraduate />
                            {child.name}
                          </div>
                          <div className="child-badge">
                            {child.id}
                          </div>
                        </div>

                        <div className="child-info">
                          <div className="child-info-item">
                            <div className="child-info-label">Lớp học</div>
                            <div className="child-info-value">{child.class}</div>
                          </div>
                          <div className="child-info-item">
                            <div className="child-info-label">Mối quan hệ</div>
                            <div className="child-info-value">{child.relationship}</div>
                          </div>
                          <div className="child-info-item">
                            <div className="child-info-label">Ngày sinh</div>
                            <div className="child-info-value">{child.birthDate}</div>
                          </div>
                          <div className="child-info-item">
                            <div className="child-info-label">Nhóm máu</div>
                            <div className="child-info-value">{child.bloodType}</div>
                          </div>
                          <div className="child-info-item">
                            <div className="child-info-label">Dị ứng</div>
                            <div className="child-info-value">{child.allergies}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Pane>

                {/* Security Tab */}
                <Tab.Pane eventKey="security">
                  <div className="info-section">
                    <h3 className="section-title">
                      <div className="section-icon">
                        <FaShieldAlt />
                      </div>
                      Bảo mật tài khoản
                    </h3>

                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">
                          <FaLock />
                          Mật khẩu
                        </div>
                        <div className="info-value">
                          <Button
                            className="btn-action btn-secondary-custom"
                            onClick={() => setShowChangePasswordModal(true)}
                          >
                            <FaKey />
                            Đổi mật khẩu
                          </Button>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaHistory />
                          Đăng nhập lần cuối
                        </div>
                        <div className="info-value">
                          Hôm nay, 14:30
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Settings Tab */}
                <Tab.Pane eventKey="settings">
                  <div className="info-section">
                    <h3 className="section-title">
                      <div className="section-icon">
                        <FaBell />
                      </div>
                      Cài đặt thông báo
                    </h3>

                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">
                          <FaBell />
                          Thông báo email
                        </div>
                        <div className="info-value">
                          <Form.Check
                            type="switch"
                            label="Bật thông báo qua email"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaLanguage />
                          Ngôn ngữ
                        </div>
                        <div className="info-value">
                          <Form.Select>
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                          </Form.Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card>
        </Container>
      </div>

      {/* Change Password Modal */}
      <Modal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control type="password" placeholder="Nhập mật khẩu hiện tại" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control type="password" placeholder="Nhập mật khẩu mới" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control type="password" placeholder="Nhập lại mật khẩu mới" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
            <FaTimes className="me-1" />
            Hủy
          </Button>
          <Button className="btn-action btn-save">
            <FaSave className="me-1" />
            Cập nhật mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
