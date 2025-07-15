import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
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
  FaTags,
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
  getNotificationsStatistics,
  getOtherNotifications,
} from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";
import PaginationBar from "../../components/common/PaginationBar";
import { useDebounce } from "use-debounce";
import styles from "./Notifications.module.css";
import ConfirmModal from "../../components/common/ConfirmModal"; // Thêm dòng này

const tabList = [
  {
    key: "all",
    label: (
      <>
        <FaBell /> Tất cả
      </>
    ),
    color: "#6b46c1",
  },
  {
    key: "Vaccination",
    label: (
      <>
        <FaSyringe /> Tiêm chủng
      </>
    ),
    color: "#8b5cf6",
  },
  {
    key: "HealthCheck",
    label: (
      <>
        <FaStethoscope /> Khám sức khỏe
      </>
    ),
    color: "#3b82f6",
  },
  {
    key: "other",
    label: (
      <>
        <FaClipboardList /> Thông báo khác
      </>
    ),
    color: "#6366f1",
  },
];

const icons = {
  Vaccination: <FaSyringe />,
  HealthCheck: <FaStethoscope />,
};

// Thêm hàm getStatusClass cho badge trạng thái
function getStatusClass(status) {
  if (!status) return styles.badgePending;
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "đã xác nhận") return styles.badgeConfirmed;
  if (s === "pending" || s === "chờ xác nhận") return styles.badgePending;
  if (s === "rejected" || s === "đã từ chối") return styles.badgeRejected;
  return styles.badgePending;
}

export default function Notifications() {
  const { user } = useAuth();
  const { refreshNotificationStatus } = useNotification();

  // Helper function to validate user ID
  const isValidUserId = (id) => {
    if (!id) return false;
    const numId = typeof id === "string" ? parseInt(id) : id;
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
  const pageSize = 10;
  const [notificationStats, setNotificationStats] = useState({
    totalNotification: 0,
    pendingNotification: 0,
    confirmedNotification: 0,
    rejectedNotification: 0,
  });
  // State cho ConfirmModal
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // "confirm" hoặc "reject"
  });

  // Fetch notifications stats
  const fetchNotificationsStats = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const res = await getNotificationsStatistics(user.id);
      if (res) {
        setNotificationStats({
          totalNotification: res.totalNotification || 0,
          pendingNotification: res.pendingNotification || 0,
          confirmedNotification: res.confirmedNotification || 0,
          rejectedNotification: res.rejectedNotification || 0,
        });
      }
    } catch (error) {}
  };

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
        case "other":
          res = await apiCall(getOtherNotifications);
          break;
        case "all":
        default:
          res = await apiCall(getNotifications);
          break;
      }

      // Handle different response formats
      if (res && typeof res === "object") {
        setNotifications(res.items || res.data || []);
        setTotalPages(
          res.totalPages || Math.ceil((res.totalItems || 0) / pageSize) || 0
        );
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
    fetchNotificationsStats();
  }, [user?.id, activeTab, page, debouncedSearch]);

  // Listen for SignalR refresh event
  useEffect(() => {
    const handleRefreshNotifications = () => {
      fetchNotifications();
    };

    window.addEventListener("refreshNotifications", handleRefreshNotifications);
    return () => {
      window.removeEventListener(
        "refreshNotifications",
        handleRefreshNotifications
      );
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
    total: notificationStats.totalNotification,
    pending: notificationStats.pendingNotification,
    confirmed: notificationStats.confirmedNotification,
    rejected: notificationStats.rejectedNotification,
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
        notificationId:
          typeof notificationId === "string"
            ? parseInt(notificationId)
            : notificationId,
        studentId:
          typeof studentId === "string" ? parseInt(studentId) : studentId,
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

  // Hàm mở ConfirmModal
  const openConfirmModal = (action) => {
    setConfirmModal({ show: true, action });
  };

  // Hàm xử lý xác nhận từ ConfirmModal
  const handleConfirmAction = () => {
    if (confirmModal.action === "confirm") {
      handleSubmitConsent(true, "Confirmed", reason);
    } else if (confirmModal.action === "reject") {
      handleSubmitConsent(false, "Rejected", reason);
    }
    setConfirmModal({ show: false, action: null });
  };

  return (
    <div className={styles.notificationsContainer}>
      {/* Page Header */}
      <div className={styles.notificationsHeader}>
        <Container>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>
              <FaBell className={styles.headerIcon} />
              Thông báo
            </h1>
          </div>
          {/* Statistics Cards */}
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.total}</div>
              <div className={styles.statLabel}>Tổng thông báo</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.pending}</div>
              <div className={styles.statLabel}>Chờ phản hồi</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.confirmed}</div>
              <div className={styles.statLabel}>Đã xác nhận</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.rejected}</div>
              <div className={styles.statLabel}>Đã từ chối</div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Main Content */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabNav}>
            {tabList.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${
                  activeTab === tab.key ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Section */}
          <div className={styles.filtersSection}>
            <div className={styles.searchRow}>
              <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Tìm theo tiêu đề, nội dung thông báo..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <button
                className={styles.clearBtn}
                type="button"
                onClick={() => setSearch("")}
                disabled={!search}
              >
                <FaTimes /> Xóa bộ lọc
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner animation="border" className={styles.loadingSpinner} />
              <div className={styles.loadingText}>Đang tải thông báo...</div>
              <p>Vui lòng chờ trong giây lát</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <FaClipboardList className={styles.emptyIcon} />
              <div className={styles.emptyMessage}>Không có thông báo nào</div>
              <p>
                {search
                  ? "Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm"
                  : "Chưa có thông báo nào trong mục này"}
              </p>
            </div>
          ) : (
            <>
              {/* Notifications Table */}
              <div className={styles.notificationsContent}>
                <div className={styles.tableContainer}>
                  <table className={styles.notificationsTable}>
                    <thead>
                      <tr>
                        <th>Loại</th>
                        <th>Tiêu đề & Nội dung</th>
                        <th className="d-none d-md-table-cell">Ngày tạo</th>
                        <th className="d-none d-md-table-cell">Học sinh</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notification, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: "center" }}>
                            {/* Hiển thị loại thông báo bằng badge màu */}
                            {notification.type === "Vaccination" && (
                              <span className={styles.badgeCategoryVaccination}>
                                Tiêm chủng
                              </span>
                            )}
                            {notification.type === "HealthCheck" && (
                              <span className={styles.badgeCategoryHealthCheck}>
                                Khám sức khỏe
                              </span>
                            )}
                            {notification.type === "OtherCheck" && (
                              <span className={styles.badgeCategoryOther}>
                                Thông báo khác
                              </span>
                            )}
                            {![
                              "Vaccination",
                              "HealthCheck",
                              "OtherCheck",
                            ].includes(notification.type) && <span>Khác</span>}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div className={styles.notificationItem}>
                              <div className={styles.notificationContent}>
                                <div className={styles.notificationTitle}>
                                  {notification.title}
                                </div>
                                <div className={styles.notificationMessage}>
                                  {notification.message?.length > 80
                                    ? notification.message.substring(0, 80) +
                                      "..."
                                    : notification.message ||
                                      "Không có nội dung"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`${styles.notificationDate} d-none d-md-table-cell`}
                            style={{ textAlign: "center" }}
                          >
                            <div className={styles.dateText}>
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("vi-VN")}
                            </div>
                            <div className={styles.timeText}>
                              {new Date(
                                notification.createdAt
                              ).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td
                            className={`${styles.notificationStudent} d-none d-md-table-cell`}
                            style={{ textAlign: "center" }}
                          >
                            {notification.studentName || "---"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span
                              className={getStatusClass(notification.status)}
                            >
                              {notification.status === "Confirmed" &&
                                "Đã xác nhận"}
                              {notification.status === "Rejected" &&
                                "Đã từ chối"}
                              {notification.status === "Pending" &&
                                "Chờ xác nhận"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className={styles.detailBtn}
                              onClick={() =>
                                openModal(
                                  notification.id,
                                  notification.studentId
                                )
                              }
                              title="Xem chi tiết và phản hồi"
                            >
                              <FaInfoCircle style={{ marginBottom: 2 }} /> Xem
                              chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.paginationContainer}>
                    <PaginationBar
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Container>

      {/* Detail Modal */}
      <Modal
        show={modal.show}
        onHide={closeModal}
        size="lg"
        centered
        className={styles.modal}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaInfoCircle className={styles.modalTitleIcon} />
            Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.notification && (
            <div>
              {/* Notification Info */}
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>
                  <FaInfoCircle /> {modal.notification?.title}
                </div>
                <div className={styles.modalValue}>
                  <div
                    className={styles.modalSection}
                    style={{
                      background: "#f7faff",
                      borderRadius: 12,
                      padding: "16px 18px",
                      margin: "10px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "18px 32px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ minWidth: 180 }}>
                        <div className={styles.modalLabel}>
                          <FaCalendarAlt /> Ngày tạo:
                        </div>
                        <div className={styles.modalValue}>
                          {modal.notification?.createdAt
                            ? new Date(
                                modal.notification.createdAt
                              ).toLocaleDateString("vi-VN")
                            : "---"}
                        </div>
                      </div>
                      <div style={{ minWidth: 180 }}>
                        <div className={styles.modalLabel}>
                          <FaUser /> Học sinh:
                        </div>
                        <div className={styles.modalValue}>
                          {modal.notification?.studentName || "---"}
                        </div>
                      </div>
                      <div style={{ minWidth: 180 }}>
                        <div className={styles.modalLabel}>
                          <FaBuilding /> Địa điểm:
                        </div>
                        <div className={styles.modalValue}>
                          {modal.notification?.location || "---"}
                        </div>
                      </div>
                      <div style={{ minWidth: 180 }}>
                        <div className={styles.modalLabel}>
                          <FaUserMd /> Y tá phụ trách:
                        </div>
                        <div className={styles.modalValue}>
                          {modal.notification?.nurseName || "---"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>
                  <FaInfoCircle /> Nội dung thông báo:
                </div>
                <div
                  className={styles.modalValue}
                  style={{
                    background: "#f7faff",
                    borderRadius: 12,
                    padding: "16px 18px",
                    margin: "10px 0",
                  }}
                >
                  {modal.notification?.message || "Không có nội dung"}
                </div>
              </div>
              {modal.notification?.note && (
                <div className={styles.modalSection}>
                  <div className={styles.modalLabel}>
                    <FaInfoCircle /> Ghi chú:
                  </div>
                  <div
                    className={styles.modalValue}
                    style={{
                      background: "#f7faff",
                      borderRadius: 12,
                      padding: "16px 18px",
                      margin: "10px 0",
                    }}
                  >
                    {modal.notification?.note}
                  </div>
                </div>
              )}
              {modal.notification?.type === "OtherCheck" &&
                Array.isArray(modal.notification?.checkList) &&
                modal.notification.checkList.length > 0 && (
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>
                      <FaClipboardList /> Danh sách kiểm tra:
                    </div>
                    <ul
                      className={styles.modalValue}
                      style={{
                        background: "#f7faff",
                        borderRadius: 12,
                        padding: "16px 18px",
                        margin: "10px 0",
                        listStyle: "none",
                        paddingLeft: 0,
                      }}
                    >
                      {modal.notification.checkList.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <FaCheckCircle
                            style={{ color: "#2563eb", marginRight: 6 }}
                          />
                          <span style={{ fontWeight: 500 }}>
                            {typeof item === "string" ? item : item.name}
                          </span>
                          {typeof item === "object" && item.result && (
                            <span
                              style={{
                                marginLeft: 8,
                                color: "#2563eb",
                                fontWeight: 600,
                              }}
                            >
                              {item.result}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              <div className={styles.modalSection}>
                <span className={getStatusClass(modal.notification.status)}>
                  {modal.notification.status === "Confirmed" && "Đã xác nhận"}
                  {modal.notification.status === "Rejected" && "Đã từ chối"}
                  {modal.notification.status === "Pending" && "Chờ xác nhận"}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "flex-end" }}>
          <button className={styles.closeBtn} onClick={closeModal}>
            <FaTimes /> Đóng
          </button>
          {(modal.notification?.status === "Pending" ||
            modal.notification?.status === "Chờ xác nhận") && (
            <>
              <button
                className={styles.rejectBtn}
                onClick={() => openConfirmModal("reject")}
              >
                <FaTimesCircle className="me-1" />
                Từ chối
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => openConfirmModal("confirm")}
              >
                <FaCheckCircle className="me-1" />
                Xác nhận
              </button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* ConfirmModal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, action: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === "confirm"
            ? "Xác nhận đồng ý"
            : "Xác nhận từ chối"
        }
        message={
          confirmModal.action === "confirm"
            ? "Bạn có chắc chắn muốn xác nhận thông báo này không?"
            : "Bạn có chắc chắn muốn từ chối thông báo này không?"
        }
        confirmText={confirmModal.action === "confirm" ? "Xác nhận" : "Từ chối"}
        confirmVariant={
          confirmModal.action === "confirm" ? "success" : "danger"
        }
      />
    </div>
  );
}
