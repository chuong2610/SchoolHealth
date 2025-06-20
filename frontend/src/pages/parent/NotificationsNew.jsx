import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Badge,
    Modal,
    Nav,
    Tab,
    Form,
    Alert,
    Spinner
} from "react-bootstrap";
import {
    FaBell,
    FaSyringe,
    FaStethoscope,
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaTimesCircle,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaUserMd,
    FaCalendarAlt,
    FaBuilding,
    FaUser,
    FaClipboardList,
    FaFilter
} from "react-icons/fa";
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import {
    getNotificationDetailById,
    getNotifications,
} from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";

const tabList = [
    {
        key: "all",
        label: "Tất cả",
        icon: FaBell
    },
    {
        key: "Vaccination",
        label: "Tiêm chủng",
        icon: FaSyringe
    },
    {
        key: "HealthCheck",
        label: "Khám sức khỏe",
        icon: FaStethoscope
    },
];

const icons = {
    Vaccination: <FaSyringe style={{ color: "var(--parent-primary)" }} />,
    HealthCheck: <FaStethoscope style={{ color: "var(--parent-accent)" }} />,
};

export default function Notifications() {
    const [activeTab, setActiveTab] = useState("all");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({
        show: false,
        notification: null,
        consent: false,
    });
    const [reason, setReason] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotifications();
            const sortedNotifications = res.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(sortedNotifications);
        } catch (error) {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Filtered notifications
    const uniqueNotifications = Array.from(
        new Map(notifications.map(n => [n.id, n])).values()
    );
    const filtered = uniqueNotifications.filter(
        (n) =>
            (activeTab === "all" || n.type === activeTab) &&
            (n.title?.toLowerCase().includes(search.toLowerCase()) ||
                n.message?.toLowerCase().includes(search.toLowerCase()))
    );
    const totalPage = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Modal logic
    const openModal = async (notificationId, studentId) => {
        const data = { notificationId, studentId };
        const detail = await getNotificationDetailById(data);
        setReason("");
        setModal({ show: true, notification: { ...detail }, consent: false });
    };

    const closeModal = () => setModal({ ...modal, show: false });

    const handleSubmitConsent = async (consent, status, reason) => {
        const data = {
            notificationId: modal.notification.id,
            studentId: modal.notification.studentId,
            status: status,
            reason,
        };
        try {
            await sendConsentApi(data);
            fetchNotifications();
            closeModal();
        } catch (error) {
            console.error('Error submitting consent:', error);
        }
    };

    // Statistics
    const stats = {
        total: filtered.length,
        pending: filtered.filter(n => n.status === 'Pending').length,
        confirmed: filtered.filter(n => n.status === 'Confirmed').length,
        rejected: filtered.filter(n => n.status === 'Rejected').length
    };

    return (
        <div className="parent-container">
            {/* Page Header */}
            <div className="parent-page-header parent-animate-fade-in">
                <div className="parent-page-header-bg"></div>
                <div className="parent-page-header-content">
                    <h1 className="parent-page-title">
                        <FaBell />
                        Thông báo từ nhà trường
                    </h1>
                    <p className="parent-page-subtitle">
                        Theo dõi và phản hồi các thông báo quan trọng về sức khỏe học sinh
                    </p>
                </div>
            </div>

            <Container>
                {/* Statistics */}
                <Row className="g-4 mb-4">
                    <Col lg={3} md={6}>
                        <div className="parent-stat-card parent-animate-fade-in">
                            <div className="parent-stat-icon">
                                <FaBell />
                            </div>
                            <div className="parent-stat-value">{stats.total}</div>
                            <div className="parent-stat-label">Tổng thông báo</div>
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <div className="parent-stat-card parent-animate-fade-in">
                            <div className="parent-stat-icon">
                                <FaExclamationCircle />
                            </div>
                            <div className="parent-stat-value">{stats.pending}</div>
                            <div className="parent-stat-label">Chờ phản hồi</div>
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <div className="parent-stat-card parent-animate-fade-in">
                            <div className="parent-stat-icon">
                                <FaCheckCircle />
                            </div>
                            <div className="parent-stat-value">{stats.confirmed}</div>
                            <div className="parent-stat-label">Đã xác nhận</div>
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <div className="parent-stat-card parent-animate-fade-in">
                            <div className="parent-stat-icon">
                                <FaTimesCircle />
                            </div>
                            <div className="parent-stat-value">{stats.rejected}</div>
                            <div className="parent-stat-label">Đã từ chối</div>
                        </div>
                    </Col>
                </Row>

                {/* Main Content */}
                <div className="parent-card parent-animate-slide-in">
                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                        {/* Navigation Tabs */}
                        <div className="parent-card-header">
                            <h3 className="parent-card-title">
                                <FaFilter />
                                Bộ lọc thông báo
                            </h3>
                            <Nav variant="pills" className="d-flex gap-2">
                                {tabList.map((tab) => (
                                    <Nav.Item key={tab.key}>
                                        <Nav.Link
                                            eventKey={tab.key}
                                            onClick={() => setPage(1)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1rem',
                                                borderRadius: 'var(--parent-border-radius-md)',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <tab.icon />
                                            {tab.label}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </div>

                        <div className="parent-card-body">
                            {/* Search Section */}
                            <div style={{ background: 'var(--parent-gradient-card)', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', border: '1px solid rgba(30, 126, 156, 0.1)', marginBottom: '2rem' }}>
                                <Form.Group>
                                    <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaSearch />
                                        Tìm kiếm thông báo
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="parent-form-control"
                                        placeholder="Nhập từ khóa để tìm kiếm thông báo..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </Form.Group>
                            </div>

                            <Tab.Content>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" style={{ color: 'var(--parent-primary)', width: '3rem', height: '3rem' }} className="mb-3" />
                                        <h5 style={{ color: 'var(--parent-primary)' }}>Đang tải thông báo...</h5>
                                        <p className="text-muted">Vui lòng chờ trong giây lát</p>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="text-center py-5">
                                        <FaClipboardList size={64} className="mb-3" style={{ color: '#d1d5db' }} />
                                        <h5 className="text-muted mb-2">Không có thông báo nào</h5>
                                        <p className="text-muted">
                                            {search ? 'Không tìm thấy thông báo phù hợp với từ khóa của bạn' : 'Chưa có thông báo nào trong mục này'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Notifications Table */}
                                        <div className="parent-table-container">
                                            <table className="parent-table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" style={{ width: "80px" }}>
                                                            <FaBell className="me-1" />
                                                            Loại
                                                        </th>
                                                        <th>
                                                            <FaInfoCircle className="me-2" />
                                                            Tiêu đề thông báo
                                                        </th>
                                                        <th className="text-center">
                                                            <FaCalendarAlt className="me-2" />
                                                            Ngày tạo
                                                        </th>
                                                        <th className="text-center">
                                                            <FaUser className="me-2" />
                                                            Học sinh
                                                        </th>
                                                        <th className="text-center">
                                                            <FaCheckCircle className="me-2" />
                                                            Trạng thái
                                                        </th>
                                                        <th className="text-center" style={{ width: "120px" }}>
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paged.map((notification, idx) => (
                                                        <tr key={notification.id}>
                                                            <td className="text-center">
                                                                <div style={{ fontSize: '1.25rem' }}>
                                                                    {icons[notification.type] || <FaBell style={{ color: 'var(--parent-primary)' }} />}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style={{ fontWeight: '600', color: 'var(--parent-primary)', marginBottom: '0.25rem' }}>
                                                                    {notification.title}
                                                                </div>
                                                                {notification.message && (
                                                                    <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                                                        {notification.message.length > 80 ?
                                                                            `${notification.message.substring(0, 80)}...` :
                                                                            notification.message}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="text-center">
                                                                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                                                    {formatDateTime(notification.createdAt)}
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <span style={{ fontWeight: '500', color: 'var(--parent-dark)' }}>
                                                                    {notification.studentName || "---"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                <Badge
                                                                    style={{
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: 'var(--parent-border-radius-lg)',
                                                                        fontWeight: '600',
                                                                        fontSize: '0.75rem',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.375rem',
                                                                        background: notification.status === 'Confirmed' ? 'var(--parent-success)' :
                                                                            notification.status === 'Rejected' ? 'var(--parent-danger)' : 'var(--parent-warning)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px'
                                                                    }}
                                                                >
                                                                    {notification.status === 'Confirmed' && <FaCheckCircle size={12} />}
                                                                    {notification.status === 'Rejected' && <FaTimesCircle size={12} />}
                                                                    {notification.status === 'Pending' && <FaExclamationCircle size={12} />}
                                                                    {notification.status === 'Confirmed' ? 'Đã xác nhận' :
                                                                        notification.status === 'Rejected' ? 'Đã từ chối' : 'Chờ phản hồi'}
                                                                </Badge>
                                                            </td>
                                                            <td className="text-center">
                                                                <Button
                                                                    size="sm"
                                                                    className="parent-primary-btn"
                                                                    onClick={() => openModal(notification.id, notification.studentId)}
                                                                    title="Xem chi tiết và phản hồi"
                                                                >
                                                                    <FaInfoCircle className="me-1" />
                                                                    Chi tiết
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {totalPage > 1 && (
                                            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                                <Button
                                                    className="parent-secondary-btn"
                                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                    size="sm"
                                                >
                                                    <FaChevronLeft />
                                                    Trước
                                                </Button>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span style={{ color: 'var(--parent-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                                                        Trang {page} / {totalPage}
                                                    </span>
                                                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                                                        ({filtered.length} thông báo)
                                                    </span>
                                                </div>

                                                <Button
                                                    className="parent-secondary-btn"
                                                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                                                    disabled={page === totalPage}
                                                    size="sm"
                                                >
                                                    Sau
                                                    <FaChevronRight />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </Container>

            {/* Detail Modal */}
            <Modal show={modal.show} onHide={closeModal} size="lg" centered className="parent-modal">
                <Modal.Header closeButton style={{ background: 'var(--parent-gradient-primary)', color: 'white', borderBottom: 'none' }}>
                    <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaInfoCircle />
                        Chi tiết thông báo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--parent-gradient-card)', padding: '2rem' }}>
                    {modal.notification && (
                        <div>
                            {/* Notification Header */}
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--parent-border-radius-lg)', marginBottom: '1.5rem', border: '1px solid rgba(30, 126, 156, 0.1)', boxShadow: 'var(--parent-shadow-sm)' }}>
                                <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {icons[modal.notification?.type] || <FaBell />}
                                    {modal.notification?.title}
                                </h5>

                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <FaCalendarAlt />
                                                Ngày tạo:
                                            </strong>
                                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '500' }}>
                                                {modal.notification?.createdAt ?
                                                    new Date(modal.notification.createdAt).toLocaleDateString("vi-VN", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : "---"}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <FaUser />
                                                Học sinh:
                                            </strong>
                                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '500' }}>
                                                {modal.notification?.studentName || "---"}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <FaBuilding />
                                                Địa điểm:
                                            </strong>
                                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '500' }}>
                                                {modal.notification?.location || "---"}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <FaUserMd />
                                                Y tá phụ trách:
                                            </strong>
                                            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 'var(--parent-border-radius-md)', fontWeight: '500' }}>
                                                {modal.notification?.nurseName || "---"}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="mb-3">
                                    <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <FaInfoCircle />
                                        Nội dung thông báo:
                                    </strong>
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)',
                                        borderRadius: 'var(--parent-border-radius-md)',
                                        lineHeight: '1.6',
                                        border: '1px solid rgba(30, 126, 156, 0.1)'
                                    }}>
                                        {modal.notification?.message || "Không có nội dung chi tiết"}
                                    </div>
                                </div>

                                {modal.notification?.note && (
                                    <div className="mb-3">
                                        <strong style={{ color: 'var(--parent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <FaInfoCircle />
                                            Ghi chú thêm:
                                        </strong>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)',
                                            borderRadius: 'var(--parent-border-radius-md)',
                                            lineHeight: '1.6',
                                            border: '1px solid rgba(30, 126, 156, 0.1)'
                                        }}>
                                            {modal.notification?.note}
                                        </div>
                                    </div>
                                )}

                                <div className="text-center">
                                    <Badge
                                        style={{
                                            fontSize: '1rem',
                                            padding: '0.75rem 2rem',
                                            borderRadius: 'var(--parent-border-radius-xl)',
                                            fontWeight: '700',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: modal.notification?.status === 'Confirmed' ? 'var(--parent-success)' :
                                                modal.notification?.status === 'Rejected' ? 'var(--parent-danger)' : 'var(--parent-warning)',
                                            color: 'white',
                                            border: 'none',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {modal.notification?.status === 'Confirmed' && <FaCheckCircle />}
                                        {modal.notification?.status === 'Rejected' && <FaTimesCircle />}
                                        {modal.notification?.status === 'Pending' && <FaExclamationCircle />}
                                        {modal.notification?.status === "Confirmed" ? "Đã xác nhận" :
                                            modal.notification?.status === "Rejected" ? "Đã từ chối" : "Chờ phản hồi"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Response Section */}
                            {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                                <div style={{
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--parent-border-radius-lg)',
                                    border: '2px solid var(--parent-secondary)',
                                    boxShadow: 'var(--parent-shadow-sm)'
                                }}>
                                    <h6 style={{
                                        color: 'var(--parent-primary)',
                                        marginBottom: '1rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <FaInfoCircle />
                                        Phản hồi của bạn
                                    </h6>
                                    <Form.Group>
                                        <Form.Label style={{ fontWeight: '600', color: 'var(--parent-primary)' }}>
                                            Ý kiến của bạn (không bắt buộc):
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            className="parent-form-control"
                                            placeholder="Nhập ý kiến hoặc lý do của bạn về thông báo này..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                        <Form.Text className="text-muted mt-2">
                                            Bạn có thể để trống nếu không có ý kiến gì thêm
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--parent-gradient-card)', borderTop: 'none', padding: '1.5rem 2rem' }}>
                    <div className="d-flex gap-2 w-100 justify-content-end">
                        <Button onClick={closeModal} className="parent-secondary-btn">
                            <FaTimes className="me-1" />
                            Đóng
                        </Button>
                        {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                            <>
                                <Button
                                    style={{
                                        background: 'linear-gradient(135deg, #ef4444, #f87171)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: 'var(--parent-border-radius-lg)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => handleSubmitConsent(false, "Rejected", reason)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <FaTimesCircle className="me-1" />
                                    Từ chối
                                </Button>
                                <Button
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: 'var(--parent-border-radius-lg)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => handleSubmitConsent(true, "Confirmed")}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <FaCheckCircle className="me-1" />
                                    Đồng ý
                                </Button>
                            </>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
} 