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
  FaFilter,
  FaEye,
  FaCheck
} from "react-icons/fa";
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import {
  getNotificationDetailById,
  getNotifications,
} from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";
// Styles được import từ main.jsx

const tabList = [
  {
    key: "all",
    label: (
      <>
        <FaBell className="me-2" /> Tất cả
      </>
    ),
    color: "#6b46c1"
  },
  {
    key: "Vaccination",
    label: (
      <>
        <FaSyringe className="me-2" /> Tiêm chủng
      </>
    ),
    color: "#8b5cf6"
  },
  {
    key: "HealthCheck",
    label: (
      <>
        <FaStethoscope className="me-2" /> Khám sức khỏe
      </>
    ),
    color: "#3b82f6"
  },
];

const icons = {
  Vaccination: <FaSyringe style={{ color: "#6b46c1" }} />,
  HealthCheck: <FaStethoscope style={{ color: "#3b82f6" }} />,
};

// Thêm hàm getStatusClass cho badge trạng thái
function getStatusClass(status) {
  if (!status) return "badge-status";
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "đã xác nhận") return "badge-status completed";
  if (s === "pending" || s === "chờ xác nhận") return "badge-status pending";
  if (s === "rejected" || s === "đã từ chối") return "badge-status rejected";
  return "badge-status";
}

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
  const pageSize = 6;

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

  // Statistics
  const stats = {
    total: uniqueNotifications.length,
    pending: uniqueNotifications.filter(n => n.status === 'Pending').length,
    confirmed: uniqueNotifications.filter(n => n.status === 'Confirmed').length,
    rejected: uniqueNotifications.filter(n => n.status === 'Rejected').length,
  };

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
    } catch (error) { }
  };

  return (
    <div className="parent-container">
      {/* Page Header */}
      <div className="parent-page-header parent-animate-fade-in">
        <div className="parent-page-header-bg"></div>
        <div className="parent-page-header-content">
          <h1 className="parent-page-title">
            <FaBell />
            Thông báo của tôi
          </h1>
          <p className="parent-page-subtitle">
            Theo dõi và phản hồi các thông báo quan trọng từ nhà trường
          </p>
        </div>
      </div>

      <Container>
        {/* Statistics Cards */}
        <Row className="mb-4 parent-animate-slide-in">
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon">
                <FaBell />
              </div>
              <div className="parent-stat-value">{stats.total}</div>
              <div className="parent-stat-label">Tổng thông báo</div>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                <FaExclamationCircle />
              </div>
              <div className="parent-stat-value">{stats.pending}</div>
              <div className="parent-stat-label">Chờ phản hồi</div>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                <FaCheckCircle />
              </div>
              <div className="parent-stat-value">{stats.confirmed}</div>
              <div className="parent-stat-label">Đã xác nhận</div>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
                <FaTimesCircle />
              </div>
              <div className="parent-stat-value">{stats.rejected}</div>
              <div className="parent-stat-label">Đã từ chối</div>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <div className="parent-card parent-animate-scale-in">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            {/* Navigation Tabs */}
            <div className="parent-card-header mb-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h3 className="parent-card-title">
                  <FaFilter />
                  Lọc thông báo
                </h3>
                <Nav variant="pills" className="d-flex">
                  {tabList.map((tab) => (
                    <Nav.Item key={tab.key}>
                      <Nav.Link
                        eventKey={tab.key}
                        className="mx-1"
                        onClick={() => setPage(1)}
                        style={{
                          background: activeTab === tab.key ? 'var(--parent-gradient-primary)' : 'transparent',
                          color: activeTab === tab.key ? 'white' : 'var(--parent-primary)',
                          border: `2px solid ${activeTab === tab.key ? 'transparent' : 'rgba(107, 70, 193, 0.2)'}`,
                          fontWeight: '600',
                          borderRadius: 'var(--parent-border-radius-lg)',
                          padding: '0.75rem 1.5rem',
                          transition: 'all var(--parent-transition-normal)'
                        }}
                      >
                        {tab.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </div>

            <Tab.Content>
              {/* Search Section */}
              <div className="parent-card-body mb-4">
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label className="parent-form-label">
                        <FaSearch className="me-2" />
                        Tìm kiếm thông báo
                      </Form.Label>
                      <div style={{ position: 'relative' }}>
                        <FaSearch
                          style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--parent-primary)',
                            zIndex: 2
                          }}
                        />
                        <Form.Control
                          type="text"
                          className="parent-form-control"
                          placeholder="Tìm theo tiêu đề, nội dung thông báo..."
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                          style={{ paddingLeft: '3rem' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      className="parent-secondary-btn w-100"
                      onClick={() => {
                        setSearch("");
                        setActiveTab("all");
                        setPage(1);
                      }}
                    >
                      <FaTimes className="me-2" />
                      Xóa bộ lọc
                    </Button>
                  </Col>
                </Row>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="parent-spinner mb-3"></div>
                  <h5 style={{ color: 'var(--parent-primary)', fontWeight: '600' }}>
                    Đang tải thông báo...
                  </h5>
                  <p className="text-muted">Vui lòng chờ trong giây lát</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem',
                    color: '#9ca3af'
                  }}>
                    <FaClipboardList />
                  </div>
                  <h5 style={{ color: 'var(--parent-primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Không có thông báo nào
                  </h5>
                  <p className="text-muted">
                    {search ? 'Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm' : 'Chưa có thông báo nào trong mục này'}
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
                            Tiêu đề & Nội dung
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
                          <th className="text-center">
                            <FaEye className="me-2" />
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((notification, idx) => (
                          <tr key={notification.id}>
                            <td className="text-center">
                              <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                background: notification.type === 'Vaccination'
                                  ? 'linear-gradient(135deg, #6b46c1, #8b5cf6)'
                                  : notification.type === 'HealthCheck'
                                    ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                                    : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                fontSize: '1.25rem',
                                color: 'white',
                                boxShadow: 'var(--parent-shadow-sm)'
                              }}>
                                {icons[notification.type] || <FaBell />}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div style={{
                                  fontWeight: '700',
                                  color: 'var(--parent-primary)',
                                  marginBottom: '0.25rem',
                                  fontSize: '1rem'
                                }}>
                                  {notification.title}
                                </div>
                                <div style={{
                                  color: '#6b7280',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.4'
                                }}>
                                  {notification.message?.length > 80
                                    ? notification.message.substring(0, 80) + '...'
                                    : notification.message || 'Không có nội dung'}
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <div style={{ fontWeight: '500', color: '#374151' }}>
                                {formatDateTime(notification.createdAt)}
                              </div>
                            </td>
                            <td className="text-center">
                              <div style={{
                                fontWeight: '600',
                                color: 'var(--parent-primary)',
                                background: 'linear-gradient(135deg, #faf7ff 0%, #f0f9ff 100%)',
                                padding: '0.5rem',
                                borderRadius: 'var(--parent-border-radius-md)',
                                border: '1px solid rgba(107, 70, 193, 0.1)'
                              }}>
                                {notification.studentName || "---"}
                              </div>
                            </td>
                            <td className="text-center">
                              <Badge
                                style={{
                                  padding: '0.5rem 1rem',
                                  borderRadius: 'var(--parent-border-radius-lg)',
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  background: notification.status === 'Confirmed'
                                    ? 'linear-gradient(135deg, #10b981, #34d399)' :
                                    notification.status === 'Rejected'
                                      ? 'linear-gradient(135deg, #ef4444, #f87171)'
                                      : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                  color: 'white',
                                  border: 'none',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  boxShadow: 'var(--parent-shadow-sm)'
                                }}
                              >
                                {notification.status === 'Confirmed' && <FaCheckCircle />}
                                {notification.status === 'Rejected' && <FaTimesCircle />}
                                {notification.status === 'Pending' && <FaExclamationCircle />}
                                {notification.status === 'Confirmed' ? 'Đã xác nhận' :
                                  notification.status === 'Rejected' ? 'Đã từ chối' : 'Chờ xác nhận'}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <Button
                                size="sm"
                                className="parent-primary-btn"
                                onClick={() => openModal(notification.id, notification.studentId)}
                                title="Xem chi tiết và phản hồi"
                              >
                                <FaEye className="me-1" />
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
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '2rem',
                      padding: '1rem',
                      background: 'white',
                      borderRadius: 'var(--parent-border-radius-xl)',
                      boxShadow: 'var(--parent-shadow-md)',
                      border: '1px solid rgba(107, 70, 193, 0.1)'
                    }}>
                      <Button
                        className="parent-secondary-btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        size="sm"
                        style={{ minWidth: '45px', height: '45px' }}
                      >
                        <FaChevronLeft />
                      </Button>

                      <div style={{
                        color: 'var(--parent-primary)',
                        fontWeight: '700',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #faf7ff 0%, #f0f9ff 100%)',
                        borderRadius: 'var(--parent-border-radius-lg)',
                        border: '2px solid rgba(107, 70, 193, 0.1)'
                      }}>
                        Trang {page} / {totalPage}
                      </div>

                      <Button
                        className="parent-secondary-btn"
                        onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                        disabled={page === totalPage}
                        size="sm"
                        style={{ minWidth: '45px', height: '45px' }}
                      >
                        <FaChevronRight />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>

      {/* Detail Modal */}
      <Modal show={modal.show} onHide={closeModal} size="lg" centered className="parent-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaInfoCircle className="me-2" />
            Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.notification && (
            <div>
              {/* Notification Info */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--parent-border-radius-lg)',
                marginBottom: '1.5rem',
                border: '1px solid rgba(107, 70, 193, 0.1)',
                boxShadow: 'var(--parent-shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--parent-gradient-primary)'
                }}></div>

                <h5 style={{ color: 'var(--parent-primary)', marginBottom: '1rem', fontWeight: '700' }}>
                  {modal.notification?.title}
                </h5>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong style={{ color: 'var(--parent-primary)' }}>
                        <FaCalendarAlt className="me-2" />
                        Ngày tạo:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(107, 70, 193, 0.1)'
                      }}>
                        {modal.notification?.createdAt ?
                          new Date(modal.notification.createdAt).toLocaleDateString("vi-VN") : "---"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong style={{ color: 'var(--parent-primary)' }}>
                        <FaUser className="me-2" />
                        Học sinh:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(107, 70, 193, 0.1)',
                        fontWeight: '600'
                      }}>
                        {modal.notification?.studentName || "---"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong style={{ color: 'var(--parent-primary)' }}>
                        <FaBuilding className="me-2" />
                        Địa điểm:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(107, 70, 193, 0.1)'
                      }}>
                        {modal.notification?.location || "---"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong style={{ color: 'var(--parent-primary)' }}>
                        <FaUserMd className="me-2" />
                        Y tá phụ trách:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(107, 70, 193, 0.1)',
                        fontWeight: '600'
                      }}>
                        {modal.notification?.nurseName || "---"}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <strong style={{ color: 'var(--parent-primary)' }}>
                    <FaInfoCircle className="me-2" />
                    Nội dung thông báo:
                  </strong>
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                    borderRadius: 'var(--parent-border-radius-md)',
                    lineHeight: '1.6',
                    border: '1px solid rgba(107, 70, 193, 0.1)'
                  }}>
                    {modal.notification?.message || "Không có nội dung"}
                  </div>
                </div>

                {modal.notification?.note && (
                  <div className="mb-3">
                    <strong style={{ color: 'var(--parent-primary)' }}>
                      <FaInfoCircle className="me-2" />
                      Ghi chú:
                    </strong>
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)',
                      borderRadius: 'var(--parent-border-radius-md)',
                      lineHeight: '1.6',
                      border: '1px solid rgba(107, 70, 193, 0.1)'
                    }}>
                      {modal.notification?.note}
                    </div>
                  </div>
                )}

                <div className="text-center mb-3">
                  <Badge
                    style={{
                      fontSize: '1rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 'var(--parent-border-radius-lg)',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: modal.notification?.status === 'Confirmed'
                        ? 'linear-gradient(135deg, #10b981, #34d399)' :
                        modal.notification?.status === 'Rejected'
                          ? 'linear-gradient(135deg, #ef4444, #f87171)'
                          : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      color: 'white',
                      border: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: 'var(--parent-shadow-md)'
                    }}
                  >
                    {modal.notification?.status === 'Confirmed' && <FaCheckCircle />}
                    {modal.notification?.status === 'Rejected' && <FaTimesCircle />}
                    {modal.notification?.status === 'Pending' && <FaExclamationCircle />}
                    {modal.notification?.status === "Confirmed" ? "Đã xác nhận" :
                      modal.notification?.status === "Rejected" ? "Đã từ chối" : "Chờ xác nhận"}
                  </Badge>
                </div>
              </div>

              {/* Response Section */}
              {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: 'var(--parent-border-radius-lg)',
                  border: '1px solid rgba(107, 70, 193, 0.1)',
                  boxShadow: 'var(--parent-shadow-sm)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'var(--parent-gradient-secondary)'
                  }}></div>

                  <h6 style={{
                    color: 'var(--parent-primary)',
                    marginBottom: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaCheck />
                    Phản hồi của bạn:
                  </h6>
                  <Form.Group>
                    <Form.Label className="parent-form-label">
                      Ý kiến của bạn (tùy chọn):
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="parent-form-control"
                      placeholder="Nhập ý kiến của bạn về thông báo này..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Form.Group>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex gap-2 w-100 justify-content-end">
            <Button
              onClick={closeModal}
              className="parent-secondary-btn"
              style={{
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                borderRadius: 'var(--parent-border-radius-lg)'
              }}
            >
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
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--parent-border-radius-lg)',
                    transition: 'all var(--parent-transition-normal)'
                  }}
                  onClick={() => handleSubmitConsent(false, "Rejected", reason)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = 'var(--parent-shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
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
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--parent-border-radius-lg)',
                    transition: 'all var(--parent-transition-normal)'
                  }}
                  onClick={() => handleSubmitConsent(true, "Confirmed", reason)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = 'var(--parent-shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <FaCheckCircle className="me-1" />
                  Xác nhận
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
