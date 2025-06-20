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
  FaClipboardList
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
        <FaBell /> Tất cả
      </>
    ),
  },
  {
    key: "Vaccination",
    label: (
      <>
        <FaSyringe /> Tiêm chủng
      </>
    ),
  },
  {
    key: "HealthCheck",
    label: (
      <>
        <FaStethoscope /> Khám sức khỏe
      </>
    ),
  },
];

const icons = {
  Vaccination: <FaSyringe style={{ color: "#2980B9" }} />,
  HealthCheck: <FaStethoscope style={{ color: "#27AE60" }} />,
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
  // Loại bỏ trùng lặp theo id
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
    } catch (error) { }
  };

  return (
    <div className="parent-theme">
      {/* Professional CSS Override */}
      <style>
        {`
          .notifications-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .notifications-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .notifications-header::before {
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
          
          .page-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 1rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1rem !important;
          }
          
          .page-subtitle {
            font-size: 1.2rem !important;
            opacity: 0.95 !important;
            margin: 0 !important;
            font-weight: 400 !important;
          }
          
          .notifications-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .notifications-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .notifications-tabs {
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
          
          .search-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            padding: 1.5rem !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            margin-bottom: 2rem !important;
          }
          
          .search-input {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 0.75rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
            width: 100% !important;
          }
          
          .search-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .data-table {
            background: white !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1) !important;
          }
          
          .table-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          .table tbody tr:hover {
            background: #f8f9fa !important;
          }
          
          .pagination-section {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 0.5rem !important;
            margin-top: 2rem !important;
          }
          
          .page-btn {
            background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
            border: none !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
          }
          
          .page-btn:hover {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            transform: translateY(-2px) !important;
          }
          
          .page-btn:disabled {
            background: #d1d5db !important;
            cursor: not-allowed !important;
            transform: none !important;
          }
          
          .action-btn {
            background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
            border: none !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .action-btn:hover {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
          }
          
          .empty-state {
            text-align: center !important;
            padding: 3rem 2rem !important;
            color: #6b7280 !important;
          }
          
          .empty-state-icon {
            font-size: 4rem !important;
            color: #d1d5db !important;
            margin-bottom: 1rem !important;
          }
          
          .status-badge {
            padding: 0.5rem 1rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            font-size: 0.875rem !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .status-confirmed {
            background: #dcfce7 !important;
            color: #166534 !important;
          }
          
          .status-pending {
            background: #fef3c7 !important;
            color: #92400e !important;
          }
          
          .status-rejected {
            background: #fee2e2 !important;
            color: #991b1b !important;
          }
          
          .modal-actions {
            display: flex !important;
            gap: 1rem !important;
            justify-content: flex-end !important;
            margin-top: 2rem !important;
          }
          
          .btn-confirm {
            background: linear-gradient(135deg, #10b981, #34d399) !important;
            border: none !important;
            color: white !important;
          }
          
          .btn-reject {
            background: linear-gradient(135deg, #ef4444, #f87171) !important;
            border: none !important;
            color: white !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            
            .notifications-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .nav-pills .nav-link {
              margin: 0.25rem !important;
              padding: 0.75rem 1rem !important;
              font-size: 0.9rem !important;
            }
            
            .tab-content {
              padding: 1rem !important;
            }
          }
        `}
      </style>

      <div className="notifications-page">
        {/* Header */}
        <div className="notifications-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                <FaBell />
                Thông báo
              </h1>
              <p className="page-subtitle">
                Theo dõi và phản hồi các thông báo từ nhà trường
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="notifications-container">
          <Container>
            <Card className="notifications-card">
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="pills" className="notifications-tabs justify-content-center">
                  {tabList.map((tab) => (
                    <Nav.Item key={tab.key}>
                      <Nav.Link
                        eventKey={tab.key}
                        onClick={() => setPage(1)}
                      >
                        {tab.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <Tab.Content className="tab-content">
                  {/* Search Section */}
                  <div className="search-section">
                    <Form.Group>
                      <Form.Label className="fw-bold text-primary">
                        <FaSearch className="me-2" />
                        Tìm kiếm thông báo
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="search-input"
                        placeholder="Tìm theo tiêu đề, nội dung..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                      />
                    </Form.Group>
                  </div>

                  {loading ? (
                    <div className="empty-state">
                      <Spinner animation="border" className="empty-state-icon" />
                      <h5>Đang tải thông báo...</h5>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="empty-state">
                      <FaClipboardList className="empty-state-icon" />
                      <h5>Không có thông báo nào</h5>
                      <p>Chưa có thông báo nào phù hợp với tìm kiếm của bạn</p>
                    </div>
                  ) : (
                    <>
                      {/* Data Table */}
                      <div className="data-table">
                        <Table responsive className="mb-0">
                          <thead className="table-header">
                            <tr>
                              <th className="text-center" style={{ width: "60px" }}>
                                <FaBell className="me-1" />
                                Loại
                              </th>
                              <th className="text-center">
                                <FaInfoCircle className="me-2" />
                                Tiêu đề
                              </th>
                              <th className="text-center">
                                <FaCalendarAlt className="me-2" />
                                Ngày
                              </th>
                              <th className="text-center">
                                <FaUser className="me-2" />
                                Học sinh
                              </th>
                              <th className="text-center">
                                <FaCheckCircle className="me-2" />
                                Trạng thái
                              </th>
                              <th className="text-center">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paged.map((notification, idx) => (
                              <tr key={notification.id}>
                                <td className="text-center">
                                  {icons[notification.type] || <FaBell />}
                                </td>
                                <td className="text-center">{notification.title}</td>
                                <td className="text-center">{formatDateTime(notification.createdAt)}</td>
                                <td className="text-center">{notification.studentName || "-"}</td>
                                <td className="text-center">
                                  <Badge
                                    className={`status-badge ${notification.status === 'Confirmed' ? 'status-confirmed' :
                                      notification.status === 'Rejected' ? 'status-rejected' : 'status-pending'
                                      }`}
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
                                    className="action-btn"
                                    onClick={() => openModal(notification.id, notification.studentId)}
                                    title="Xem chi tiết"
                                  >
                                    <FaInfoCircle /> Chi tiết
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPage > 1 && (
                        <div className="pagination-section">
                          <Button
                            className="page-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                          >
                            <FaChevronLeft />
                          </Button>

                          <span className="mx-3">
                            Trang {page} / {totalPage}
                          </span>

                          <Button
                            className="page-btn"
                            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                            disabled={page === totalPage}
                          >
                            <FaChevronRight />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card>
          </Container>
        </div>

        {/* Detail Modal */}
        <Modal show={modal.show} onHide={closeModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaInfoCircle className="me-2" />
              {modal.notification?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modal.notification && (
              <div>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><FaCalendarAlt className="me-2" />Ngày:</strong><br />
                      {modal.notification?.createdAt ?
                        new Date(modal.notification.createdAt).toLocaleDateString("vi-VN") : ""}
                    </div>
                    <div className="mb-3">
                      <strong><FaUser className="me-2" />Học sinh:</strong><br />
                      {modal.notification?.studentName || "---"}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><FaBuilding className="me-2" />Địa điểm:</strong><br />
                      {modal.notification?.location || "---"}
                    </div>
                    <div className="mb-3">
                      <strong><FaUserMd className="me-2" />Bác sĩ phụ trách:</strong><br />
                      {modal.notification?.nurseName || "---"}
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <strong><FaInfoCircle className="me-2" />Nội dung:</strong><br />
                  <div className="p-3 bg-light rounded mt-2">
                    {modal.notification?.message || ""}
                  </div>
                </div>

                {modal.notification?.note && (
                  <div className="mb-3">
                    <strong><FaInfoCircle className="me-2" />Ghi chú:</strong><br />
                    <div className="p-3 bg-light rounded mt-2">
                      {modal.notification?.note}
                    </div>
                  </div>
                )}

                <div className="text-center mb-3">
                  <Badge
                    className={`status-badge ${modal.notification?.status === 'Confirmed' ? 'status-confirmed' :
                      modal.notification?.status === 'Rejected' ? 'status-rejected' : 'status-pending'
                      }`}
                    style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                  >
                    {modal.notification?.status === "Confirmed" ? "Đã xác nhận" :
                      modal.notification?.status === "Rejected" ? "Đã từ chối" : "Chờ xác nhận"}
                  </Badge>
                </div>

                {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                  <div className="mb-3">
                    <Form.Label className="fw-bold">Ý kiến của bạn:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập ý kiến của bạn (nếu có)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-actions w-100">
              <Button variant="secondary" onClick={closeModal}>
                <FaTimes className="me-1" />
                Đóng
              </Button>
              {(modal.notification?.status === "Pending" || modal.notification?.status === "Chờ xác nhận") && (
                <>
                  <Button
                    className="btn-reject"
                    onClick={() => handleSubmitConsent(false, "Rejected", reason)}
                  >
                    <FaTimesCircle className="me-1" />
                    Từ chối
                  </Button>
                  <Button
                    className="btn-confirm"
                    onClick={() => handleSubmitConsent(true, "Confirmed")}
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
    </div>
  );
}
