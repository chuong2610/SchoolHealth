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
  FaUsers,
  FaHeart,
  FaCalendarAlt,
  FaBriefcase,
  FaHome
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
    <div className="parent-container">
      {/* Profile Header */}
      <div className="parent-page-header parent-animate-fade-in">
        <div className="parent-page-header-bg"></div>
        <div className="parent-page-header-content">
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <img
              src={formData.avatar}
              alt="Avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                objectFit: 'cover'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                background: 'var(--parent-accent)',
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'var(--parent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'var(--parent-accent)';
              }}
            >
              <FaCamera size={14} />
            </div>
          </div>
          <h1 className="parent-page-title">
            <FaUser />
            {formData.name}
          </h1>
          <p className="parent-page-subtitle">
            {formData.role} - Mã: {formData.code}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
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
                  className="parent-primary-btn"
                >
                  {loading ? <FaSpinner className="me-2 fa-spin" /> : <FaSave className="me-2" />}
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
            <Button
              onClick={() => setShowChangePasswordModal(true)}
              className="parent-secondary-btn"
            >
              <FaLock className="me-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>

      <Container>
        {/* Notification */}
        {notification && (
          <Alert 
            variant={notification.type === 'success' ? 'success' : 'danger'}
            dismissible
            onClose={() => setNotification(null)}
            className="parent-animate-fade-in"
            style={{
              borderRadius: 'var(--parent-border-radius-md)',
              border: 'none',
              boxShadow: 'var(--parent-shadow-md)'
            }}
          >
            <FaCheck className="me-2" />
            {notification.message}
          </Alert>
        )}

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
                  <h3 className="parent-card-title">
                    <FaUser />
                    Thông tin cá nhân
                  </h3>
                </div>
                <div className="parent-card-body">
                  <Row className="g-4">
                    {/* Basic Information */}
                    <Col md={6}>
                      <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                        <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaIdCard />
                          Thông tin cơ bản
                        </h5>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaUser className="me-2" />
                              Họ và tên
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="parent-form-control"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.name}
                              </div>
                            )}
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaEnvelope className="me-2" />
                              Email
                            </label>
                            {isEditing ? (
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="parent-form-control"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.email}
                              </div>
                            )}
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaPhone className="me-2" />
                              Số điện thoại
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="parent-form-control"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Personal Details */}
                    <Col md={6}>
                      <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                        <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaBirthdayCake />
                          Thông tin chi tiết
                        </h5>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaBirthdayCake className="me-2" />
                              Ngày sinh
                            </label>
                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                              {formData.dob}
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaVenusMars className="me-2" />
                              Giới tính
                            </label>
                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                              {formData.gender}
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaBriefcase className="me-2" />
                              Nghề nghiệp
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                className="parent-form-control"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.occupation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Address and Contact */}
                    <Col md={12}>
                      <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                        <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaMapMarkerAlt />
                          Địa chỉ & Liên hệ
                        </h5>
                        <Row className="g-3">
                          <Col md={8}>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaMapMarkerAlt className="me-2" />
                              Địa chỉ
                            </label>
                            {isEditing ? (
                              <textarea
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="parent-form-control"
                                rows="2"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.address}
                              </div>
                            )}
                          </Col>
                          <Col md={4}>
                            <label style={{ display: 'block', fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                              <FaPhone className="me-2" />
                              Liên hệ khẩn cấp
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.emergencyContact}
                                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                className="parent-form-control"
                              />
                            ) : (
                              <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '600' }}>
                                {formData.emergencyContact}
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
                  {formData.children.map((child, index) => (
                    <div key={index} style={{ background: 'linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '2px solid var(--parent-secondary)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <h5 style={{ color: 'var(--parent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          <FaUserGraduate />
                          {child.name}
                        </h5>
                        <Badge style={{ background: 'var(--parent-gradient-button)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                          {child.class}
                        </Badge>
                      </div>
                      <Row className="g-3">
                        <Col md={3}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--parent-border-radius-md)' }}>
                            <div style={{ color: '#6c757d', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Mã học sinh</div>
                            <div style={{ color: 'var(--parent-primary)', fontWeight: '700' }}>{child.id}</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--parent-border-radius-md)' }}>
                            <div style={{ color: '#6c757d', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Ngày sinh</div>
                            <div style={{ color: 'var(--parent-primary)', fontWeight: '700' }}>{child.birthDate}</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--parent-border-radius-md)' }}>
                            <div style={{ color: '#6c757d', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Nhóm máu</div>
                            <div style={{ color: 'var(--parent-primary)', fontWeight: '700' }}>{child.bloodType}</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--parent-border-radius-md)' }}>
                            <div style={{ color: '#6c757d', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Quan hệ</div>
                            <div style={{ color: 'var(--parent-primary)', fontWeight: '700' }}>{child.relationship}</div>
                          </div>
                        </Col>
                        <Col md={12}>
                          <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--parent-border-radius-md)' }}>
                            <div style={{ color: '#6c757d', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Dị ứng</div>
                            <div style={{ color: 'var(--parent-primary)', fontWeight: '700' }}>{child.allergies}</div>
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
                    <Col md={6}>
                      <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)', height: '100%' }}>
                        <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaLock />
                          Mật khẩu
                        </h5>
                        <p className="text-muted mb-3">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        <Button
                          onClick={() => setShowChangePasswordModal(true)}
                          className="parent-primary-btn"
                        >
                          <FaKey className="me-2" />
                          Đổi mật khẩu
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)', height: '100%' }}>
                        <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaBell />
                          Thông báo
                        </h5>
                        <p className="text-muted mb-3">Quản lý cài đặt thông báo của bạn</p>
                        <Button className="parent-secondary-btn">
                          <FaCog className="me-2" />
                          Cài đặt thông báo
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>

      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)} centered className="parent-modal">
        <Modal.Header closeButton style={{ background: 'var(--parent-gradient-primary)', color: 'white' }}>
          <Modal.Title>
            <FaLock className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--parent-gradient-card)' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>Mật khẩu hiện tại</Form.Label>
              <Form.Control type="password" className="parent-form-control" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>Mật khẩu mới</Form.Label>
              <Form.Control type="password" className="parent-form-control" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control type="password" className="parent-form-control" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: 'var(--parent-gradient-card)' }}>
          <Button onClick={() => setShowChangePasswordModal(false)} className="parent-secondary-btn">
            <FaTimes className="me-2" />
            Hủy
          </Button>
          <Button className="parent-primary-btn">
            <FaSave className="me-2" />
            Cập nhật mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
