import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import {
  formatDateTime,
  formatDDMMYYYY,
  formatTime,
} from "../../utils/dateFormatter";
import { exportExcelFile, importExcelFile } from "../../api/admin/excelApi";
import { toast } from "react-toastify";
import PaginationBar from "../../components/common/PaginationBar";
import { usePagination } from "../../hooks/usePagination";
import {
  getClassList,
  getHealthCheckResultDeltail,
  getNotificationDetail,
  getNotifications,
  getNotiManagementStats,
  getNurseList,
  getVaccinationResultDeltail,
  postNotification,
} from "../../api/admin/notification";
import { useDebounce } from "use-debounce";
import {
  getNotificationsByNurseId,
  getOtherResultDeltail,
} from "../../api/nurse/NotificationsNurseManagement";
import styles from "./NotificationsNurseManagement.module.css";

const icons = [
  {
    id: 1,
    type: "Vaccination",
    icon: "fas fa-syringe",
    badgeClass: "bg-primary",
  },
  {
    id: 2,
    type: "HealthCheck",
    icon: "fas fa-stethoscope",
    badgeClass: "bg-success",
  },
  {
    id: 3,
    type: "date",
    icon: "fas fa-calendar",
    badgeClass: "bg-primary",
  },
  {
    id: 4,
    type: "time",
    icon: "fas fa-clock",
    badgeClass: "bg-primary",
  },
  {
    id: 5,
    type: "address",
    icon: "fas fa-map-marker-alt",
    badgeClass: "bg-primary",
  },
  {
    id: 6,
    type: "hospital",
    icon: "fas fa-syringe",
    badgeClass: "bg-primary",
  },
];

const resultDefault = {
  id: "",
  height: "",
  weight: "",
  bmi: "",
  conclusion: "",
  nurseName: "",
  studentName: "",
  date: "",
};

const NotificationsNurseManagement = () => {
  const nurseId = localStorage.userId;
  const [validated, setValidated] = useState(false);
  const [reload, setReload] = useState(false);
  const [classList, setClassList] = useState([]);
  const [nurseList, setNurseList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [datetime, setDatetime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [modalAdd, setModalAdd] = useState({
    status: false,
    notification: {
      classId: null,
      location: "",
      type: "",
      vaccineName: "",
      title: "",
      date: "",
      message: "",
      note: "",
      assignedToId: null,
    },
  });
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [modalDetail, setModalDetail] = useState({
    status: false,
    notificationDetail: {},
  });
  const [modalResultDetail, setModalResultDetail] = useState({
    status: false,
    healthCheck: {},
    vaccination: {},
    other: {},
  });
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500); // 500ms delay
  const [filterType, setFilterType] = useState("");
  const [importFile, setImportFile] = useState();
  const fileInputRef = useRef(null);
  const [currentDetailPage, setCurrentDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);

  // const {
  //   currentPage: modalDetailCurrentPage,
  //   totalPages: modalDetailTotalPages,
  //   currentItems: modalDetailCurrentItems,
  //   handlePageChange: modalDetailHandlePageChange,
  // } = usePagination(modalDetail?.notificationDetail?.results);

  // const {
  //   currentPage: notificationCurrentPage,
  //   totalPages: notificationTotalPages,
  //   currentItems: notificationsCurrentItems,
  //   handlePageChange: notificationHandlePageChange,
  // } = usePagination(notifications, 8);

  // Statistics
  const [stats, setStats] = useState({
    totalNotifications: 0,
    vaccinationNotifications: 0,
    healthcheckNotifications: 0,
    notificationsSentToday: 0,
  });

  const fetchNotiManagementStats = async () => {
    try {
      const res = await getNotiManagementStats();
      if (res) {
        setStats({
          totalNotifications: res.totalNotifications,
          vaccinationNotifications: res.vaccinationNotifications,
          healthcheckNotifications: res.healthcheckNotifications,
          notificationsSentToday: res.notificationsSentToday,
        });
      } else {
        setStats({
          totalNotifications: 0,
          vaccinationNotifications: 0,
          healthcheckNotifications: 0,
          notificationsSentToday: 0,
        });
      }
    } catch (error) {
      setStats({
        totalNotifications: 0,
        vaccinationNotifications: 0,
        healthcheckNotifications: 0,
        notificationsSentToday: 0,
      });
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    setDatetime(getMinDateTime());
  }, [modalAdd?.status]);

  const fetchClassList = async (force = false) => {
    if (classList.length > 0 && !force) {
      return true;
    }

    setLoadingClasses(true);
    try {
      const res = await getClassList(); // This will return sample data if API fails

      // getClassList now handles fallbacks internally, so res should always be valid
      if (res && Array.isArray(res) && res.length > 0) {
        // Validate each class has proper id and name
        const validClasses = res.filter((cls) => {
          const hasValidId = cls.id && !isNaN(parseInt(cls.id));
          const hasValidName = cls.name || cls.className || cls.ClassName;

          if (!hasValidId || !hasValidName) {
            return false;
          }
          return true;
        });

        setClassList([...validClasses]);

        // Check if this is sample data (sample data has predictable IDs 1-4)
        const isSampleData = validClasses.every((cls) =>
          [1, 2, 3, 4].includes(cls.id)
        );

        // if (isSampleData) {
        //   toast.info(`Sử dụng dữ liệu mẫu: ${validClasses.length} lớp học`);
        // } else {
        //   toast.success(`Đã tải ${validClasses.length} lớp học từ hệ thống`);
        // }

        return true;
      } else {
        setClassList([]);
        // toast.error("Không có dữ liệu lớp học");
        return false;
      }
    } catch (error) {
      setClassList([]);
      // toast.error("Lỗi không mong đợi khi tải lớp học");
      return false;
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchNurseList = async (force = false) => {
    if (nurseList.length > 0 && !force) {
      return true;
    }

    setLoadingNurses(true);
    try {
      const res = await getNurseList(); // This will return sample data if API fails

      // getNurseList now handles fallbacks internally, so res should always be valid
      if (res && Array.isArray(res) && res.length > 0) {
        // Validate each nurse has proper id and name
        const validNurses = res.filter((nurse) => {
          const hasValidId = nurse.id && !isNaN(parseInt(nurse.id));
          const hasValidName = nurse.fullName || nurse.name || nurse.Name;

          if (!hasValidId || !hasValidName) {
            return false;
          }
          return true;
        });

        setNurseList([...validNurses]);

        // Check if this is sample data (sample data has predictable IDs 1-4)
        const isSampleData = validNurses.every((nurse) =>
          [1, 2, 3, 4].includes(nurse.id)
        );

        // if (isSampleData) {
        //   toast.info(`Sử dụng dữ liệu mẫu: ${validNurses.length} y tá`);
        // } else {
        //   toast.success(`Đã tải ${validNurses.length} y tá từ hệ thống`);
        // }

        return true;
      } else {
        setNurseList([]);
        // toast.error("Không có dữ liệu y tá");
        return false;
      }
    } catch (error) {
      setNurseList([]);
      //  toast.error("Lỗi không mong đợi khi tải y tá");
      return false;
    } finally {
      setLoadingNurses(false);
    }
  };

  // Function to handle opening modal with data loading
  const handleOpenCreateModal = async () => {
    // Show loading state
    toast.info("Đang tải dữ liệu...", { autoClose: 1000 });

    try {
      // Load both APIs in parallel
      const [classSuccess, nurseSuccess] = await Promise.all([
        fetchClassList(),
        fetchNurseList(),
      ]);

      if (!classSuccess) {
        // toast.error("Không thể tải danh sách lớp học. Vui lòng thử lại.");
        return;
      }

      if (!nurseSuccess) {
        //  toast.error("Không thể tải danh sách y tá. Vui lòng thử lại.");
        return;
      }

      // Only open modal if both APIs succeeded

      setModalAdd({ ...modalAdd, status: true });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
    }
  };

  useEffect(() => {}, [classList]);

  const handleSubmitModalAdd = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const notificationData = { ...modalAdd?.notification };

    // Additional validation
    if (!notificationData.classId || notificationData.classId === "") {
      toast.error("Vui lòng chọn lớp học");
      setValidated(true);
      return;
    }

    if (
      !notificationData.assignedToId ||
      notificationData.assignedToId === ""
    ) {
      toast.error("Vui lòng chọn y tá phụ trách");
      setValidated(true);
      return;
    }

    // Validate vaccine name only for Vaccination type
    if (notificationData.type === "Vaccination") {
      if (
        !notificationData.vaccineName ||
        notificationData.vaccineName.trim() === ""
      ) {
        toast.error("Vui lòng nhập tên vắc xin cho thông báo tiêm chủng");
        setValidated(true);
        return;
      }
    }

    // Check for invalid ID values (emojis, non-numeric)
    if (
      isNaN(parseInt(notificationData.classId)) ||
      notificationData.classId.includes("🎓")
    ) {
      toast.error(
        `Lỗi: ID lớp học không hợp lệ: "${notificationData.classId}". Vui lòng chọn lại.`
      );

      setValidated(true);
      return;
    }

    if (
      isNaN(parseInt(notificationData.assignedToId)) ||
      notificationData.assignedToId.includes("👩‍⚕️")
    ) {
      toast.error(
        `Lỗi: ID y tá không hợp lệ: "${notificationData.assignedToId}". Vui lòng chọn lại.`
      );

      setValidated(true);
      return;
    }

    try {
      const res = await postNotification(notificationData);
      toast.success("Tạo và gửi thông báo thành công");
      setReload(!reload);
      setModalAdd({
        notification: {
          classId: null,
          location: "",
          type: "",
          vaccineName: "",
          title: "",
          date: "",
          message: "",
          note: "",
          assignedToId: null,
        },
        status: false,
      });
      setValidated(false);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.");
      } else if (error.response?.status === 401) {
        toast.error("Bạn không có quyền thực hiện thao tác này.");
      } else {
        toast.error("Tạo và gửi thông báo thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleClickImport = () => {
    fileInputRef.current.click();
  };

  const handleImport = async (e, notificationId) => {
    const file = e.target.files[0];
    try {
      await importExcelFile(notificationId, file);
      toast.success("Thêm tệp kết quả thành công");
      fetchNotificationDetail(notificationId);
    } catch (error) {
      toast.error("Thêm tệp kết quả thất bại");
    }
  };

  const handleExport = async (notificationId) => {
    try {
      await exportExcelFile(notificationId);
      toast.success("Lấy tệp mẫu thành công");
    } catch (error) {
      toast.error("Lấy tệp mẫu thất bại");
    }
  };

  const fetchNotificationDetail = async (notificationId) => {
    try {
      const res = await getNotificationDetail(
        notificationId
        // currentDetailPage,
        // pageSize
      );
      if (res) {
        setModalDetail({
          notificationDetail: { ...res, results: res.results || [] },
          status: true,
        });
        // setDetailTotalPages(res.pagedResults.totalPages || 1);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (modalDetail?.notificationDetail?.id) {
      fetchNotificationDetail(modalDetail?.notificationDetail?.id);
    }
  }, [currentDetailPage]);

  const fetchHealthCheckResultDetail = async (healthCheckId) => {
    try {
      const res = await getHealthCheckResultDeltail(healthCheckId);
      if (res) {
        setModalDetail({ ...modalDetail, status: false });
        setModalResultDetail({
          healthCheck: { ...res },
          vaccination: {},
          other: {},
          status: true,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {}, [modalResultDetail]);

  const fetchVaccinationResultDetail = async (vaccinationId) => {
    try {
      const res = await getVaccinationResultDeltail(vaccinationId);
      if (res) {
        setModalDetail({ ...modalDetail, status: false });
        setModalResultDetail({
          healthCheck: {},
          vaccination: { ...res },
          other: {},
          status: true,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {}, [modalResultDetail]);

  const fetchOtherResultDetail = async (otherId) => {
    try {
      const res = await getOtherResultDeltail(otherId);
      if (res) {
        setModalDetail({ ...modalDetail, status: false });
        setModalResultDetail({
          healthCheck: {},
          vaccination: {},
          other: { ...res },
          status: true,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {}, [modalResultDetail]);

  const fetchNotification = async (pageNumber = 1) => {
    try {
      const res = await getNotificationsByNurseId(
        nurseId,
        pageNumber,
        pageSize,
        debouncedSearch
      ); // truyền page, pageSize vào API
      if (res && res.data) {
        setNotifications(res.data.items || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      } else {
        setNotifications([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      setNotifications([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotification(currentPage);
    fetchNotiManagementStats();
  }, [reload, currentPage, debouncedSearch]);

  // Force refresh data function for testing
  const forceRefreshData = async () => {
    // Clear existing data first
    setClassList([]);
    setNurseList([]);

    // Reload data with force=true to bypass cache
    try {
      await Promise.all([
        fetchClassList(true), // Force refresh
        fetchNurseList(true), // Force refresh
      ]);
      toast.success("Dữ liệu đã được refresh thành công!");
    } catch (error) {
      toast.error("Có lỗi khi refresh dữ liệu");
    }
  };

  // Preload class and nurse data when component mounts
  useEffect(() => {
    // Don't wait for these, just start loading in background
    fetchClassList().catch((error) => {});

    fetchNurseList().catch((error) => {});
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className={styles.notiContainer}>
      {/* Modern Header */}
      <div className={styles.notiHeaderCard}>
        <h1 className={styles.notiHeaderTitle}>
          <i className="fas fa-bell"></i>
          Lịch khám
        </h1>
        <p className={styles.notiHeaderDesc}>
          Thêm thông tin và kết quả cho học sinh và phụ huynh
        </p>
      </div>
      {/* Stats Cards */}
      <div className={styles.notiStatsRow}>
        <div className={`${styles.notiStatCard} ${styles.notiStatCardPink}`}>
          <div className={styles.notiStatIconWrap}>
            <i className={`fas fa-hourglass-half ${styles.notiStatIcon}`}></i>
          </div>
          <div className={styles.notiStatText}>
            <div className={styles.notiStatLabel}>Yêu cầu chờ duyệt</div>
            <div className={styles.notiStatValue}>
              {stats.totalNotifications}
            </div>
          </div>
        </div>
        <div className={`${styles.notiStatCard} ${styles.notiStatCardYellow}`}>
          <div className={styles.notiStatIconWrap}>
            <i className={`fas fa-bullhorn ${styles.notiStatIcon}`}></i>
          </div>
          <div className={styles.notiStatText}>
            <div className={styles.notiStatLabel}>Đang sử dụng</div>
            <div className={styles.notiStatValue}>
              {stats.vaccinationNotifications}
            </div>
          </div>
        </div>
        <div className={`${styles.notiStatCard} ${styles.notiStatCardBlue}`}>
          <div className={styles.notiStatIconWrap}>
            <i className={`fas fa-handshake ${styles.notiStatIcon}`}></i>
          </div>
          <div className={styles.notiStatText}>
            <div className={styles.notiStatLabel}>Đã hoàn thành</div>
            <div className={styles.notiStatValue}>
              {stats.healthcheckNotifications}
            </div>
          </div>
        </div>
        <div className={`${styles.notiStatCard} ${styles.notiStatCardOrange}`}>
          <div className={styles.notiStatIconWrap}>
            <i className={`fas fa-calendar-alt ${styles.notiStatIcon}`}></i>
          </div>
          <div className={styles.notiStatText}>
            <div className={styles.notiStatLabel}>Yêu cầu hôm nay</div>
            <div className={styles.notiStatValue}>
              {stats.notificationsSentToday}
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      {/* <div className="admin-notifications-tabs">
        <button
          className={`admin-notifications-tab ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          <i className="fas fa-list me-2"></i>
          Tất cả
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'vaccination' ? 'active' : ''}`}
          onClick={() => setSelectedTab('vaccination')}
        >
          <i className="fas fa-syringe me-2"></i>
          Tiêm chủng
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'healthcheck' ? 'active' : ''}`}
          onClick={() => setSelectedTab('healthcheck')}
        >
          <i className="fas fa-stethoscope me-2"></i>
          Kiểm tra sức khỏe
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'today' ? 'active' : ''}`}
          onClick={() => setSelectedTab('today')}
        >
          <i className="fas fa-calendar-day me-2"></i>
          Hôm nay
        </button>
      </div> */}

      {/* Search and Filter Controls */}
      <div className={styles.notiSearchBar}>
        <form
          className={styles.notiSearchGroup}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            className={styles.notiSearchInput}
            placeholder="Tìm kiếm theo loại sự kiện, địa điểm, học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={styles.notiSearchBtn}>
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Notifications Table */}
      <div className={styles.notiTableWrapper}>
        {notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#ff6b8d" }}>
            <div style={{ fontSize: 48 }}>
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3>Không có lịch</h3>
            <p>Chưa có nội dung nào phù hợp với tiêu chí tìm kiếm</p>
          </div>
        ) : (
          <table className={styles.notiTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Nội dung</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {notifications?.map((notification, idx) => (
                <tr key={idx}>
                  <td>{(currentPage - 1) * 8 + idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{notification.title}</div>
                  </td>
                  <td>
                    {notification.type === "Vaccination"
                      ? "Tiêm chủng"
                      : notification.type === "HealthCheck"
                      ? "Kiểm tra sức khỏe"
                      : "Khác"}
                  </td>
                  <td>
                    <div>
                      {notification.message && notification.message.length > 80
                        ? `${notification.message.substring(0, 80)}...`
                        : notification.message}
                    </div>
                  </td>
                  <td>
                    <div>{formatDateTime(notification.createdAt)}</div>
                  </td>
                  <td>
                    <span className={styles.notiStatusSent}>
                      <i className="fas fa-check-circle"></i>
                      Đã gửi
                    </span>
                  </td>
                  <td>
                    <div>
                      <button
                        className={styles.notiActionBtn}
                        onClick={() => {
                          setCurrentDetailPage(1);
                          fetchNotificationDetail(notification.id);
                        }}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div
        style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}
      >
        {totalPages > 1 && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add Notification Modal */}
      <Modal
        show={modalAdd.status}
        onHide={() => {
          // Reset form when closing modal
          setModalAdd({
            status: false,
            notification: {
              classId: null,
              location: "",
              type: "",
              vaccineName: "",
              title: "",
              date: "",
              message: "",
              note: "",
              assignedToId: null,
            },
          });
          setValidated(false);
        }}
        size="xl"
        className=""
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <i className=""></i>
            </div>
            Tạo thông báo mới
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmitModalAdd}
          >
            {/* Section 1: Basic Information */}
            <fieldset className="">
              <legend>
                <i className=""></i>
                Thông tin cơ bản
              </legend>

              <Row>
                <Col md={6}>
                  <div className="">
                    <label className="">
                      <i className=""></i>
                      Loại thông báo
                    </label>
                    <Form.Select
                      className=""
                      required
                      value={modalAdd.notification.type}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            type: selectedType,
                            // Clear vaccine name if switching to HealthCheck
                            vaccineName:
                              selectedType === "HealthCheck"
                                ? ""
                                : modalAdd.notification.vaccineName,
                          },
                        });
                      }}
                    >
                      <option key="empty-type" value="">
                        Chọn loại thông báo
                      </option>
                      <option key="vaccination" value="Vaccination">
                        💉 Tiêm chủng
                      </option>
                      <option key="healthcheck" value="HealthCheck">
                        🩺 Kiểm tra sức khỏe
                      </option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="">
                    <label className="">
                      <i className=""></i>
                      Lớp học
                    </label>
                    <Form.Select
                      className=""
                      required
                      value={modalAdd.notification.classId || ""}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            classId: e.target.value,
                          },
                        })
                      }
                    >
                      <option style={{ color: "blackhay" }} value="">
                        Chọn lớp học
                      </option>
                      {classList.map((cls) => (
                        <option key={cls.classId} value={cls.classId}>
                          {cls.className}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
              </Row>

              <div className="">
                <label className="">
                  <i className=""></i>
                  Tiêu đề thông báo
                </label>
                <Form.Control
                  type="text"
                  className=""
                  placeholder="Nhập tiêu đề thông báo rõ ràng, dễ hiểu..."
                  required
                  value={modalAdd.notification.title}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="">
                <label className="">
                  <i className=""></i>
                  Tên Vắc Xin (Chỉ tiêm chủng)
                </label>
                <Form.Control
                  disabled={modalAdd.notification.type !== "Vaccination"}
                  type="text"
                  className=""
                  placeholder="Nhập tên vắc xin cụ thể (ví dụ: Vaccine COVID-19, Vaccine cúm mùa)..."
                  value={modalAdd.notification.vaccineName}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        vaccineName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </fieldset>

            {/* Section 2: Notification Details */}
            <fieldset className="">
              <legend>
                <i className=""></i>
                Chi tiết thông báo
              </legend>

              <Row>
                <Col md={6}>
                  <div className="">
                    <label className="">
                      <i className=""></i>
                      Ngày và giờ thực hiện
                    </label>
                    <Form.Control
                      type="datetime-local"
                      className=""
                      required
                      min={datetime}
                      value={modalAdd.notification.date}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            date: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="">
                    <label className="">
                      <i className=""></i>
                      Địa điểm thực hiện
                    </label>
                    <Form.Control
                      type="text"
                      className=""
                      placeholder="Ví dụ: Phòng y tế trường, Sân trường..."
                      required
                      value={modalAdd.notification.location}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            location: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>

              <div className="">
                <label className="">
                  <i className=""></i>
                  Nội dung thông báo
                </label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className=""
                  placeholder="Nhập nội dung chi tiết của thông báo để phụ huynh và học sinh hiểu rõ về hoạt động..."
                  required
                  value={modalAdd.notification.message}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        message: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </fieldset>

            {/* Section 3: Nurse Assignment */}
            <fieldset className="">
              <legend>
                <i className=""></i>
                Phân công y tá
              </legend>

              <div className="">
                <label className="">
                  <i className=""></i>Y tá phụ trách
                </label>
                <Form.Select
                  className=""
                  required
                  value={modalAdd.notification.assignedToId || ""}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        assignedToId: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Chọn y tá phụ trách</option>
                  {nurseList.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      {nurse.nurseName}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="">
                <label className="">
                  <i className=""></i>
                  Ghi chú thêm
                  <span>(không bắt buộc)</span>
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className=""
                  placeholder="Ghi chú thêm cho y tá về cách thực hiện, lưu ý đặc biệt..."
                  value={modalAdd.notification.note}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        note: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </fieldset>

            {/* Form Actions */}
            <div>
              <button
                type="button"
                onClick={() => {
                  // Reset form when canceling
                  setModalAdd({
                    status: false,
                    notification: {
                      classId: null,
                      location: "",
                      type: "",
                      vaccineName: "",
                      title: "",
                      date: "",
                      message: "",
                      note: "",
                      assignedToId: null,
                    },
                  });
                  setValidated(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f3f4f6";
                  e.target.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#d1d5db";
                }}
              >
                <i className=""></i>
                Hủy bỏ
              </button>
              <button
                type="submit"
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 20px rgba(240, 98, 146, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(240, 98, 146, 0.3)";
                }}
              >
                <i className=""></i>
                Tạo và gửi thông báo
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Detail Modal */}
      <Modal
        show={modalDetail.status}
        onHide={() => {
          setModalDetail({ ...modalDetail, status: false });
        }}
        size="xl"
        className=""
      >
        <Modal.Header closeButton className={styles.notiModalHeader}>
          <Modal.Title className={styles.notiModalTitle}>
            <i className="fas fa-eye"></i>
            Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.notiModalContent}>
          {modalDetail.notificationDetail && (
            <div>
              <div className={styles.notiModalSection}>
                <div className={styles.notiModalSectionTitle}>
                  Thông tin thông báo
                </div>
                <div className={styles.notiModalInfoRow}>
                  <div>
                    <span className={styles.notiModalLabel}>Tiêu đề:</span>
                    <span className={styles.notiModalValue}>
                      {modalDetail.notificationDetail.title}
                    </span>
                  </div>
                  <div>
                    <span className={styles.notiModalLabel}>Loại:</span>
                    <span className={styles.notiModalValue}>
                      {modalDetail.notificationDetail.type === "Vaccination"
                        ? "Tiêm chủng"
                        : modalDetail.notificationDetail.type === "HealthCheck"
                        ? "Kiểm tra sức khỏe"
                        : "Khác"}
                    </span>
                  </div>
                  <div>
                    <span className={styles.notiModalLabel}>Ngày tạo:</span>
                    <span className={styles.notiModalValue}>
                      {formatDateTime(modalDetail.notificationDetail.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.notiModalLabel}>Lớp:</span>
                    <span className={styles.notiModalValue}>
                      {modalDetail.notificationDetail?.className || "Không có"}
                    </span>
                  </div>
                </div>
                <div className={styles.notiModalInfoRow}>
                  <div>
                    <span className={styles.notiModalLabel}>Địa điểm:</span>
                    <span className={styles.notiModalValue}>
                      {modalDetail.notificationDetail.location}
                    </span>
                  </div>
                </div>
                <div className={styles.notiModalInfoRow}>
                  <div>
                    <span className={styles.notiModalLabel}>Nội dung:</span>
                    <span className={styles.notiModalValue}>
                      {modalDetail.notificationDetail.message}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.notiModalSection}>
                <div className={styles.notiModalSectionTitle}>
                  Kết quả thực hiện
                </div>
                <div className={styles.notiModalTableWrapper}>
                  {modalDetail.notificationDetail?.results?.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <button
                        className={styles.notiActionBtn}
                        style={{
                          background: "#fff",
                          color: "#ff6b8d",
                          border: "2px solid #ffb6c1",
                          fontWeight: 600,
                          minWidth: 120,
                        }}
                        onClick={() =>
                          handleExport(modalDetail.notificationDetail.id)
                        }
                      >
                        <i
                          className="fas fa-download"
                          style={{ marginRight: 6 }}
                        ></i>{" "}
                        Tải mẫu
                      </button>
                      <button
                        className={styles.notiActionBtn}
                        style={{
                          background:
                            "linear-gradient(90deg, #ff6b8d 0%, #f06292 100%)",
                          color: "#fff",
                          fontWeight: 600,
                          minWidth: 140,
                        }}
                        onClick={handleClickImport}
                      >
                        <i
                          className="fas fa-upload"
                          style={{ marginRight: 6 }}
                        ></i>{" "}
                        Nhập kết quả
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".xlsx,.xls"
                        onChange={(e) =>
                          handleImport(e, modalDetail.notificationDetail.id)
                        }
                      />
                    </div>
                  )}
                  {modalDetail.notificationDetail?.type === "Vaccination" ? (
                    <>
                      <div className={styles.scrollTableContent}>
                      <table className={styles.notiModalTable}>
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Họ tên học sinh</th>
                            <th>Ngày thực hiện</th>
                            <th>Vắc-xin</th>
                            <th>Y tá</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                      {/* </table> */}
                        {/* <table className={styles.notiModalTable}> */}
                          <tbody>
                            {modalDetail.notificationDetail.results?.length ===
                            0 ? (
                              <tr>
                                <td colSpan="6">Không có kết quả</td>
                              </tr>
                            ) : (
                              modalDetail.notificationDetail.results?.map(
                                (result, idx) => (
                                  <tr key={result.id || idx}>
                                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                                    <td>{result.studentName}</td>
                                    <td>{formatDDMMYYYY(result.date)}</td>
                                    <td>{result.vaccineName}</td>
                                    <td>{result.nurseName}</td>
                                    <td>
                                      <div>
                                        {result.id && (
                                          <button
                                            className={styles.notiActionBtn}
                                            onClick={() => {
                                              if (result.id) {
                                                fetchVaccinationResultDetail(
                                                  result.id
                                                );
                                              }
                                            }}
                                          >
                                            <i className="fas fa-eye"></i>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : modalDetail.notificationDetail?.type === "HealthCheck" ? (
                    <>
                      <div className={styles.scrollTableContent}>
                        <table className={styles.notiModalTable}>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Họ tên học sinh</th>
                              <th>Chiều cao</th>
                              <th>Cân nặng</th>
                              <th>Kết luận</th>
                              <th>Y tá</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalDetail.notificationDetail.results?.length ===
                            0 ? (
                              <tr>
                                <td colSpan="7">Không có kết quả</td>
                              </tr>
                            ) : (
                              modalDetail.notificationDetail.results?.map(
                                (result, idx) => (
                                  <tr key={result.id || idx}>
                                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                                    <td>{result.studentName}</td>
                                    <td>{result.height}</td>
                                    <td>{result.weight}</td>
                                    <td>{result.conclusion}</td>
                                    <td>{result.nurseName}</td>
                                    <td>
                                      <div>
                                        {result.id && (
                                          <button
                                            className={styles.notiActionBtn}
                                            onClick={() => {
                                              if (result.id) {
                                                fetchHealthCheckResultDetail(
                                                  result.id
                                                );
                                              }
                                            }}
                                          >
                                            <i className="fas fa-eye"></i>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.scrollTableContent}>
                        <table className={styles.notiModalTable}>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Họ tên học sinh</th>
                              <th>Tiêu đề</th>
                              <th>Theo dõi tại nhà</th>
                              <th>Kết luận</th>
                              <th>Y tá</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalDetail.notificationDetail.results?.length ===
                            0 ? (
                              <tr>
                                <td colSpan="7">Không có kết quả</td>
                              </tr>
                            ) : (
                              modalDetail.notificationDetail.results?.map(
                                (result, idx) => (
                                  <tr key={result.id || idx}>
                                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                                    <td>{result.studentName}</td>
                                    <td>{result.name}</td>
                                    <td>{result.resultAtHome}</td>
                                    <td>{result.conclusion}</td>
                                    <td>{result.nurseName}</td>
                                    <td>
                                      <div>
                                        {result.id && (
                                          <button
                                            className={styles.notiActionBtn}
                                            onClick={() => {
                                              if (result.id) {
                                                fetchOtherResultDetail(
                                                  result.id
                                                );
                                              }
                                            }}
                                          >
                                            <i className="fas fa-eye"></i>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Result Detail Modal */}
      <Modal
        show={modalResultDetail.status}
        onHide={() => {
          setModalResultDetail({ ...modalResultDetail, status: false });
          setModalDetail({ ...modalDetail, status: true });
        }}
        size="lg"
        className=""
      >
        <Modal.Header closeButton className={styles.notiResultModalHeader}>
          <Modal.Title className={styles.notiResultModalTitle}>
            <i className="fas fa-plus-square"></i>
            Chi tiết kết quả
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.notiResultModalContent}>
          {(modalResultDetail.healthCheck &&
            Object.keys(modalResultDetail.healthCheck).length !== 0) ||
          (modalResultDetail.vaccination &&
            Object.keys(modalResultDetail.vaccination).length !== 0) ||
          (modalResultDetail.other &&
            Object.keys(modalResultDetail.other).length !== 0) ? (
            <div className={styles.notiResultSection}>
              <div className={styles.notiResultSectionTitle}>Kết quả</div>
              <div className={styles.notiResultInfoGrid}>
                {/* HealthCheck */}
                {modalResultDetail.healthCheck &&
                  Object.keys(modalResultDetail.healthCheck).length !== 0 && (
                    <>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Học sinh:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.studentName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Ngày kiểm tra:
                        </span>
                        <span className={styles.notiResultValue}>
                          {formatDDMMYYYY(modalResultDetail.healthCheck.date)}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Chiều cao:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.height} cm
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Cân nặng:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.weight} kg
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Thị lực trái:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.visionLeft}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Thị lực phải:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.visionRight}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Huyết áp:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.bloodPressure}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Nhịp tim:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.heartRate}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>BMI:</span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.bmi}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Y tá thực hiện:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.nurseName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Kết luận:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.healthCheck.conclusion}
                        </span>
                      </div>
                    </>
                  )}
                {/* Vaccination */}
                {modalResultDetail.vaccination &&
                  Object.keys(modalResultDetail.vaccination).length !== 0 && (
                    <>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Học sinh:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.vaccination.studentName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Ngày tiêm:
                        </span>
                        <span className={styles.notiResultValue}>
                          {formatDDMMYYYY(modalResultDetail.vaccination.date)}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>Vaccine:</span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.vaccination.vaccineName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Y tá thực hiện:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.vaccination.nurseName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Kết luận:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.vaccination.result}
                        </span>
                      </div>
                    </>
                  )}
                {/* Other */}
                {modalResultDetail.other &&
                  Object.keys(modalResultDetail.other).length !== 0 && (
                    <>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Học sinh:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.studentName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>Tiêu đề:</span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.name}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Thời gian:
                        </span>
                        <span className={styles.notiResultValue}>
                          {formatDDMMYYYY(modalResultDetail.other.date)}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Địa điểm:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.location}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>Mô tả:</span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.description}
                        </span>
                      </div>
                      {modalResultDetail?.other?.checkList?.map((c, idx) => (
                        <div key={idx}>
                          <span className={styles.notiResultLabel}>
                            {c.name}:
                          </span>
                          <span className={styles.notiResultValue}>
                            {c.value}
                          </span>
                        </div>
                      ))}
                      <div>
                        <span className={styles.notiResultLabel}>
                          Theo dõi tại nhà:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.resultAtHome}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Y tá thực hiện:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.nurseName}
                        </span>
                      </div>
                      <div>
                        <span className={styles.notiResultLabel}>
                          Kết luận:
                        </span>
                        <span className={styles.notiResultValue}>
                          {modalResultDetail.other.conclusion}
                        </span>
                      </div>
                    </>
                  )}
              </div>
              <div>
                <span className={styles.notiResultLabel}>Ghi chú:</span>
                <textarea
                  className={styles.notiResultTextarea}
                  value={
                    modalResultDetail.vaccination?.note ||
                    modalResultDetail.other?.note ||
                    "Không có ghi chú"
                  }
                  readOnly
                  rows={2}
                />
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationsNurseManagement;
