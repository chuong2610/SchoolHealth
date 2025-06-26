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
  Spinner,
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
  FaCheck,
  FaTags
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import {
  getNotificationDetailById,
  getNotifications,
  getHealthCheckNotifications,
  getVaccinationNotifications,
} from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";
import PaginationBar from "../../components/common/PaginationBar";
import { useDebounce } from "use-debounce";
// Styles được import từ main.jsx

const tabList = [
  {
    key: "all",
    label: (
      <>
        <FaBell className="me-2" /> Tất cả
      </>
    ),
    color: "#6b46c1",
  },
  {
    key: "Vaccination",
    label: (
      <>
        <FaSyringe className="me-2" /> Tiêm chủng
      </>
    ),
    color: "#8b5cf6",
  },
  {
    key: "HealthCheck",
    label: (
      <>
        <FaStethoscope className="me-2" /> Khám sức khỏe
      </>
    ),
    color: "#3b82f6",
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
  const { user } = useAuth();
  const { refreshNotificationStatus } = useNotification();

  // Helper function to validate user ID
  const isValidUserId = (id) => {
    if (!id) return false;
    const numId = typeof id === 'string' ? parseInt(id) : id;
    return !isNaN(numId) && numId > 0;
  };

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
  const [debouncedSearch] = useDebounce(search, 500); // 500ms delay
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Increased from 1 to show more notifications per page

  // Fetch notifications based on active tab
  const fetchNotifications = async () => {
    // Add flexible validation for user.id (accept string or number)
    if (!user?.id || !isValidUserId(user.id)) {
      setLoading(false);
      setNotifications([]);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    try {
      let res;
      const apiCall = (apiFunc) =>
        apiFunc(user.id, page, pageSize, debouncedSearch);

      switch (activeTab) {
        case "HealthCheck":
          res = await apiCall(getHealthCheckNotifications);
          break;
        case "Vaccination":
          res = await apiCall(getVaccinationNotifications);
          break;
        case "all":
        default:
          res = await apiCall(getNotifications);
          break;
      }

      // Handle different response formats
      if (res && typeof res === 'object') {
        setNotifications(res.items || res.data || []);
        setTotalPages(res.totalPages || Math.ceil((res.totalItems || 0) / pageSize) || 0);
      } else {
        setNotifications([]);
        setTotalPages(0);
      }
    } catch (error) {
      setNotifications([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, activeTab, page, debouncedSearch]);

  // Listen for SignalR refresh event
  useEffect(() => {
    const handleRefreshNotifications = () => {
      fetchNotifications();
    };

    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    return () => {
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [fetchNotifications]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // Reset page to 1 when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Statistics
  const stats = {
    total: notifications.length,
    pending: notifications.filter((n) => n.status === "Pending").length,
    confirmed: notifications.filter((n) => n.status === "Confirmed").length,
    rejected: notifications.filter((n) => n.status === "Rejected").length,
  };

  // Modal logic
  const openModal = async (notificationId, studentId) => {
    try {
      // Validate parameters
      if (!notificationId || !studentId) {
        toast.error("Thiếu thông tin để hiển thị chi tiết thông báo");
        return;
      }

      // Convert to numbers if they're strings
      const data = {
        notificationId: typeof notificationId === 'string' ? parseInt(notificationId) : notificationId,
        studentId: typeof studentId === 'string' ? parseInt(studentId) : studentId
      };

      const detail = await getNotificationDetailById(data);

      setReason("");
      setModal({ show: true, notification: { ...detail }, consent: false });
    } catch (error) {
      toast.error("Không thể tải chi tiết thông báo. Vui lòng thử lại.");
      setModal({ show: false, notification: null, consent: false });
    }
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
      await fetchNotifications(); // Refresh notifications after consent
      closeModal();
      refreshNotificationStatus();
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
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
      <div style={{ backgroundColor: 'rgb(255, 255, 255)', padding: '1rem', marginTop: '-2rem', border: '1px solid #2563eb', borderRadius: '10px' }}>
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
                <div className="parent-stat-icon" style={{ background: '#F59E0B' }}>
                  <FaExclamationCircle />
                </div>
                <div className="parent-stat-value">{stats.pending}</div>
                <div className="parent-stat-label">Chờ phản hồi</div>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="parent-stat-card">
                <div className="parent-stat-icon" style={{ background: '#059669' }}>
                  <FaCheckCircle />
                </div>
                <div className="parent-stat-value">{stats.confirmed}</div>
                <div className="parent-stat-label">Đã xác nhận</div>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="parent-stat-card">
                <div className="parent-stat-icon" style={{ background: '#dc2626' }}>
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
                            background: activeTab === tab.key ? '#2563eb' : 'transparent',
                            color: activeTab === tab.key ? 'white' : 'var(--parent-primary)',
                            border: `2px solid ${activeTab === tab.key ? 'transparent' : 'rgba(37, 99, 235, 0.2)'}`,
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
                        <div style={{ position: "relative" }}>
                          <FaSearch
                            style={{
                              position: "absolute",
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--parent-primary)",
                              zIndex: 2,
                            }}
                          />
                          <Form.Control
                            type="text"
                            className=" "
                            placeholder="      Tìm theo tiêu đề, nội dung thông báo..."
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setPage(1);
                            }}
                            style={{ paddingLeft: '2rem' }}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Button
                        className="parent-secondary-btn w-100"
                        onClick={() => {
                          setSearch("");
                          // setActiveTab("all"); // Optional: decide if you want to reset tab as well
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
                    <h5
                      style={{
                        color: "var(--parent-primary)",
                        fontWeight: "600",
                      }}
                    >
                      Đang tải thông báo...
                    </h5>
                    <p className="text-muted">Vui lòng chờ trong giây lát</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem",
                        fontSize: "2rem",
                        color: "#9ca3af",
                      }}
                    >
                      <FaClipboardList />
                    </div>
                    <h5
                      style={{
                        color: "var(--parent-primary)",
                        fontWeight: "700",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Không có thông báo nào
                    </h5>
                    <p className="text-muted">
                      {search
                        ? "Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm"
                        : "Chưa có thông báo nào trong mục này"}
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
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <FaTags />
                                Loại
                              </div>
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
                          {notifications.map((notification, idx) => (
                            <tr key={`notification-row-${idx}`}>
                              <td className="text-center">
                                <div style={{
                                  width: '45px',
                                  height: '45px',
                                  borderRadius: '50%',
                                  background: notification.type === 'Vaccination'
                                    ? 'linear-gradient(135deg,rgba(255, 255, 255, 0.63), #8b5cf6)'
                                    : notification.type === 'HealthCheck'
                                      ? 'linear-gradient(135deg,rgb(252, 253, 255), #60a5fa)'
                                      : 'linear-gradient(135deg,rgb(222, 217, 235), #a78bfa)',
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
                                  <div
                                    style={{
                                      fontWeight: "700",
                                      color: "var(--parent-primary)",
                                      marginBottom: "0.25rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {notification.title}
                                  </div>
                                  <div
                                    style={{
                                      color: "#6b7280",
                                      fontSize: "0.875rem",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    {notification.message?.length > 80
                                      ? notification.message.substring(0, 80) +
                                      "..."
                                      : notification.message ||
                                      "Không có nội dung"}
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <div
                                  style={{ fontWeight: "500", color: "#374151" }}
                                >
                                  {formatDateTime(notification.createdAt)}
                                </div>
                              </td>
                              <td className="text-center">
                                <div style={{
                                  fontWeight: '600',
                                  color: 'var(--parent-primary)',
                                  background: '#f8fafc',
                                  padding: '0.5rem',
                                  borderRadius: 'var(--parent-border-radius-md)',
                                  border: '1px solid rgba(37, 99, 235, 0.1)'
                                }}>
                                  {notification.studentName || "---"}
                                </div>
                              </td>
                              <td className="text-center">
                                <Badge
                                  className={`status-badge ${notification.status === 'Confirmed' ? 'status-confirmed' :
                                    notification.status === 'Rejected' ? 'status-rejected' : 'status-pending'
                                    }`}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--parent-border-radius-lg)',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: notification.status === 'Confirmed'
                                      ? '#059669' :
                                      notification.status === 'Rejected'
                                        ? '#dc2626'
                                        : '#F59E0B',
                                    color: 'white',
                                    border: 'none',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: 'var(--parent-shadow-sm)'
                                  }}
                                >
                                  {notification.status === "Confirmed" && (
                                    <FaCheckCircle />
                                  )}
                                  {notification.status === "Rejected" && (
                                    <FaTimesCircle />
                                  )}
                                  {notification.status === "Pending" && (
                                    <FaExclamationCircle />
                                  )}
                                  {notification.status === "Confirmed"
                                    ? "Đã xác nhận"
                                    : notification.status === "Rejected"
                                      ? "Đã từ chối"
                                      : "Chờ xác nhận"}
                                </Badge>
                              </td>
                              <td className="text-center">
                                <Button
                                  size="sm"
                                  className="parent-primary-btn"
                                  onClick={() =>
                                    openModal(
                                      notification.id,
                                      notification.studentId
                                    )
                                  }
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
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-4">
                        <PaginationBar
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
      </div>
      {/* Detail Modal */}
      <Modal
        show={modal.show}
        onHide={closeModal}
        size="lg"
        centered
        className="parent-modal"
      >
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
                border: '1px solid rgba(37, 99, 235, 0.1)',
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
                  background: '#2563eb'
                }}></div>

                <h5
                  style={{
                    color: "var(--parent-primary)",
                    marginBottom: "1rem",
                    fontWeight: "700",
                  }}
                >
                  {modal.notification?.title}
                </h5>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong style={{ color: "var(--parent-primary)" }}>
                        <FaCalendarAlt className="me-2" />
                        Ngày tạo:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(37, 99, 235, 0.1)'
                      }}>
                        {modal.notification?.createdAt ?
                          new Date(modal.notification.createdAt).toLocaleDateString("vi-VN") : "---"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong style={{ color: "var(--parent-primary)" }}>
                        <FaUser className="me-2" />
                        Học sinh:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(37, 99, 235, 0.1)',
                        fontWeight: '600'
                      }}>
                        {modal.notification?.studentName || "---"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong style={{ color: "var(--parent-primary)" }}>
                        <FaBuilding className="me-2" />
                        Địa điểm:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(37, 99, 235, 0.1)'
                      }}>
                        {modal.notification?.location || "---"}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong style={{ color: "var(--parent-primary)" }}>
                        <FaUserMd className="me-2" />Y tá phụ trách:
                      </strong>
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--parent-border-radius-md)',
                        border: '1px solid rgba(37, 99, 235, 0.1)',
                        fontWeight: '600'
                      }}>
                        {modal.notification?.nurseName || "---"}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <strong style={{ color: "var(--parent-primary)" }}>
                    <FaInfoCircle className="me-2" />
                    Nội dung thông báo:
                  </strong>
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: 'var(--parent-border-radius-md)',
                    lineHeight: '1.6',
                    border: '1px solid rgba(37, 99, 235, 0.1)'
                  }}>
                    {modal.notification?.message || "Không có nội dung"}
                  </div>
                </div>

                {modal.notification?.note && (
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      <FaInfoCircle className="me-2" />
                      Ghi chú:
                    </strong>
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: 'var(--parent-border-radius-md)',
                      lineHeight: '1.6',
                      border: '1px solid rgba(37, 99, 235, 0.1)'
                    }}>
                      {modal.notification?.note}
                    </div>
                  </div>
                )}

                <div className="text-center mb-3">
                  <Badge
                    className={`status-badge ${modal.notification?.status === 'Confirmed' ? 'status-confirmed' :
                      modal.notification?.status === 'Rejected' ? 'status-rejected' : 'status-pending'
                      }`}
                    style={{
                      fontSize: '1rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 'var(--parent-border-radius-lg)',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: modal.notification?.status === 'Confirmed'
                        ? '#059669' :
                        modal.notification?.status === 'Rejected'
                          ? '#dc2626'
                          : '#F59E0B',
                      color: 'white',
                      border: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: 'var(--parent-shadow-md)'
                    }}
                  >
                    {modal.notification?.status === "Confirmed" && (
                      <FaCheckCircle />
                    )}
                    {modal.notification?.status === "Rejected" && (
                      <FaTimesCircle />
                    )}
                    {modal.notification?.status === "Pending" && (
                      <FaExclamationCircle />
                    )}
                    {modal.notification?.status === "Confirmed"
                      ? "Đã xác nhận"
                      : modal.notification?.status === "Rejected"
                        ? "Đã từ chối"
                        : "Chờ xác nhận"}
                  </Badge>
                </div>
              </div>

              {/* Response Section */}
              {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: 'var(--parent-border-radius-lg)',
                  border: '1px solid rgba(37, 99, 235, 0.1)',
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
                    background: '#60A5FA'
                  }}></div>

                  <h6
                    style={{
                      color: "var(--parent-primary)",
                      marginBottom: "1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
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
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
                borderRadius: "var(--parent-border-radius-lg)",
              }}
            >
              <FaTimes className="me-1" />
              Đóng
            </Button>
            {(modal.notification?.status === "Pending" ||
              modal.notification?.status === "Chờ xác nhận") && (
                <>
                  <Button
                    className="btn-danger"
                    style={{
                      background: '#dc2626',
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
                      e.target.style.background = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#dc2626';
                    }}
                  >
                    <FaTimesCircle className="me-1" />
                    Từ chối
                  </Button>
                  <Button
                    className="btn-success"
                    style={{
                      background: '#059669',
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
                      e.target.style.background = '#047857';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#059669';
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
