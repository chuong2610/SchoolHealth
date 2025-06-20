import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Modal,
    Badge,
    Nav,
    Tab
} from 'react-bootstrap';
import {
    FaHeartbeat,
    FaUser,
    FaPills,
    FaStethoscope,
    FaCalendarAlt,
    FaBell,
    FaCheckCircle,
    FaExclamationCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaSearch,
    FaEdit,
    FaSave,
    FaEye,
    FaShieldAlt,
    FaHome,
    FaStar
} from 'react-icons/fa';

const ParentDemo = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        healthNote: '',
        allergies: ''
    });

    // Mock data
    const stats = [
        { icon: FaHeartbeat, value: '98%', label: 'Sức khỏe tốt', color: 'success' },
        { icon: FaPills, value: '3', label: 'Đơn thuốc', color: 'primary' },
        { icon: FaStethoscope, value: '5', label: 'Lần khám', color: 'info' },
        { icon: FaBell, value: '2', label: 'Thông báo', color: 'warning' }
    ];

    const notifications = [
        {
            id: 1,
            type: 'vaccination',
            title: 'Tiêm chủng định kỳ',
            message: 'Học sinh cần tiêm vaccine phòng cúm theo lịch của Bộ Y tế',
            date: '2024-06-20',
            status: 'pending'
        },
        {
            id: 2,
            type: 'health-check',
            title: 'Khám sức khỏe định kỳ',
            message: 'Khám sức khỏe học kỳ II năm học 2023-2024',
            date: '2024-06-18',
            status: 'confirmed'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            action: 'Khai báo sức khỏe',
            description: 'Đã khai báo tình trạng sức khỏe cho học sinh Nguyễn Văn A',
            time: '2 giờ trước',
            icon: FaHeartbeat
        },
        {
            id: 2,
            action: 'Gửi thuốc',
            description: 'Đã gửi đơn thuốc cảm cúm cho học sinh',
            time: '1 ngày trước',
            icon: FaPills
        },
        {
            id: 3,
            action: 'Phản hồi thông báo',
            description: 'Đã xác nhận tham gia khám sức khỏe định kỳ',
            time: '3 ngày trước',
            icon: FaCheckCircle
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveForm = () => {
        console.log('Saving form data:', formData);
        setShowModal(false);
        // Reset form
        setFormData({
            studentName: '',
            healthNote: '',
            allergies: ''
        });
    };

    return (
        <div className="parent-container">
            {/* Page Header */}
            <div className="parent-page-header parent-animate-fade-in">
                <div className="parent-page-header-bg"></div>
                <div className="parent-page-header-content">
                    <h1 className="parent-page-title">
                        <FaHome />
                        Demo Parent Theme
                    </h1>
                    <p className="parent-page-subtitle">
                        Giao diện mới với theme trắng - xanh nước biển chuyên nghiệp
                    </p>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Button className="parent-primary-btn me-3" onClick={() => setShowModal(true)}>
                            <FaEdit className="me-2" />
                            Mở form demo
                        </Button>
                        <Button className="parent-secondary-btn">
                            <FaInfoCircle className="me-2" />
                            Xem hướng dẫn
                        </Button>
                    </div>
                </div>
            </div>

            <Container>
                {/* Statistics */}
                <Row className="g-4 mb-5">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <div className="parent-stat-card parent-animate-fade-in">
                                <div className="parent-stat-icon">
                                    <stat.icon />
                                </div>
                                <div className="parent-stat-value">{stat.value}</div>
                                <div className="parent-stat-label">{stat.label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Main Content Tabs */}
                <div className="parent-card parent-animate-slide-in">
                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav variant="pills" className="justify-content-center mb-4">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" className="mx-2">
                                    <FaHome className="me-2" />
                                    Tổng quan
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="notifications" className="mx-2">
                                    <FaBell className="me-2" />
                                    Thông báo
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="activities" className="mx-2">
                                    <FaStar className="me-2" />
                                    Hoạt động
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* Overview Tab */}
                            <Tab.Pane eventKey="overview">
                                <div className="parent-card-header">
                                    <h3 className="parent-card-title">
                                        <FaShieldAlt />
                                        Tổng quan sức khỏe
                                    </h3>
                                </div>
                                <div className="parent-card-body">
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <div style={{
                                                background: 'var(--parent-gradient-card)',
                                                padding: '1.5rem',
                                                borderRadius: 'var(--parent-border-radius-lg)',
                                                border: '1px solid rgba(30, 126, 156, 0.1)'
                                            }}>
                                                <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem' }}>
                                                    <FaHeartbeat className="me-2" />
                                                    Tình trạng sức khỏe
                                                </h5>
                                                <div className="mb-3">
                                                    <Badge
                                                        style={{
                                                            background: 'var(--parent-success)',
                                                            color: 'white',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: 'var(--parent-border-radius-lg)',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        <FaCheckCircle className="me-1" />
                                                        Sức khỏe tốt
                                                    </Badge>
                                                </div>
                                                <p className="text-muted mb-0">
                                                    Học sinh có tình trạng sức khỏe ổn định, không có vấn đề gì đáng lo ngại.
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div style={{
                                                background: 'var(--parent-gradient-card)',
                                                padding: '1.5rem',
                                                borderRadius: 'var(--parent-border-radius-lg)',
                                                border: '1px solid rgba(30, 126, 156, 0.1)'
                                            }}>
                                                <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem' }}>
                                                    <FaStethoscope className="me-2" />
                                                    Lần khám gần nhất
                                                </h5>
                                                <div className="mb-2">
                                                    <strong>Ngày:</strong> 15/06/2024
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Kết quả:</strong> Bình thường
                                                </div>
                                                <div className="mb-0">
                                                    <strong>Bác sĩ:</strong> Nguyễn Thị B
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Tab.Pane>

                            {/* Notifications Tab */}
                            <Tab.Pane eventKey="notifications">
                                <div className="parent-card-header">
                                    <h3 className="parent-card-title">
                                        <FaBell />
                                        Thông báo mới nhất
                                    </h3>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm thông báo..."
                                        className="parent-form-control"
                                        style={{ maxWidth: '300px' }}
                                    />
                                </div>
                                <div className="parent-card-body">
                                    <div className="parent-table-container">
                                        <table className="parent-table">
                                            <thead>
                                                <tr>
                                                    <th>Loại</th>
                                                    <th>Tiêu đề</th>
                                                    <th>Ngày</th>
                                                    <th>Trạng thái</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notifications.map((notification) => (
                                                    <tr key={notification.id}>
                                                        <td>
                                                            <div style={{ fontSize: '1.25rem', color: 'var(--parent-primary)' }}>
                                                                {notification.type === 'vaccination' ? <FaPills /> : <FaStethoscope />}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>
                                                                {notification.title}
                                                            </div>
                                                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                                                                {notification.message.length > 50
                                                                    ? `${notification.message.substring(0, 50)}...`
                                                                    : notification.message}
                                                            </div>
                                                        </td>
                                                        <td>{notification.date}</td>
                                                        <td>
                                                            <Badge
                                                                style={{
                                                                    background: notification.status === 'confirmed'
                                                                        ? 'var(--parent-success)'
                                                                        : 'var(--parent-warning)',
                                                                    color: 'white',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: 'var(--parent-border-radius-lg)',
                                                                    fontSize: '0.75rem',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.375rem'
                                                                }}
                                                            >
                                                                {notification.status === 'confirmed' ? (
                                                                    <>
                                                                        <FaCheckCircle size={12} />
                                                                        Đã xác nhận
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaExclamationCircle size={12} />
                                                                        Chờ phản hồi
                                                                    </>
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button size="sm" className="parent-primary-btn">
                                                                <FaEye className="me-1" />
                                                                Xem
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Tab.Pane>

                            {/* Activities Tab */}
                            <Tab.Pane eventKey="activities">
                                <div className="parent-card-header">
                                    <h3 className="parent-card-title">
                                        <FaStar />
                                        Hoạt động gần đây
                                    </h3>
                                </div>
                                <div className="parent-card-body">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            padding: '1rem',
                                            marginBottom: '1rem',
                                            background: 'var(--parent-gradient-card)',
                                            borderRadius: 'var(--parent-border-radius-lg)',
                                            border: '1px solid rgba(30, 126, 156, 0.1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = 'var(--parent-shadow-md)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'var(--parent-gradient-button)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1rem',
                                                color: 'white',
                                                flexShrink: 0
                                            }}>
                                                <activity.icon />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h6 style={{ color: 'var(--parent-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    {activity.action}
                                                </h6>
                                                <p style={{ color: '#495057', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                                                    {activity.description}
                                                </p>
                                                <small style={{ color: '#6c757d' }}>
                                                    <FaCalendarAlt className="me-1" />
                                                    {activity.time}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </Container>

            {/* Demo Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="parent-modal">
                <Modal.Header closeButton style={{ background: 'var(--parent-gradient-primary)', color: 'white' }}>
                    <Modal.Title>
                        <FaEdit className="me-2" />
                        Form Demo - Parent Theme
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--parent-gradient-card)' }}>
                    <Form>
                        <div className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>
                                <FaUser className="me-2" />
                                Tên học sinh
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                className="parent-form-control"
                                placeholder="Nhập tên học sinh..."
                            />
                        </div>
                        <div className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>
                                <FaStethoscope className="me-2" />
                                Ghi chú sức khỏe
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="healthNote"
                                value={formData.healthNote}
                                onChange={handleInputChange}
                                className="parent-form-control"
                                placeholder="Nhập ghi chú về tình trạng sức khỏe..."
                            />
                        </div>
                        <div className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>
                                <FaExclamationCircle className="me-2" />
                                Dị ứng (nếu có)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleInputChange}
                                className="parent-form-control"
                                placeholder="Nhập thông tin về dị ứng..."
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--parent-gradient-card)' }}>
                    <Button onClick={() => setShowModal(false)} className="parent-secondary-btn">
                        <FaTimesCircle className="me-1" />
                        Hủy
                    </Button>
                    <Button onClick={handleSaveForm} className="parent-primary-btn">
                        <FaSave className="me-1" />
                        Lưu thông tin
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ParentDemo; 