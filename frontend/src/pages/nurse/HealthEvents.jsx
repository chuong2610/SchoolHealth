import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  Badge,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormatter";
import {
  getMedicalEventDetail,
  getMedicalEvents,
  getMedicalSupply,
  postMedicalEvent,
} from "../../api/nurse/healthEventsApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import cendal from "../../assets/calendar-svgrepo-com.svg";
import nearly from "../../assets/history-svgrepo-com.svg";
import Today from "../../assets/clock-islam-svgrepo-com.svg";
import {
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaEye,
  FaTrash,
  FaEdit,
  FaMedkit,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaUserNurse,
  FaCheckCircle,
  FaStickyNote,
  FaList,
  FaStethoscope,
  FaHospital,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaClock,
  FaCheckDouble,
  FaChartBar,
  FaBell,
  FaFilter,
  FaDownload,
  FaCapsules,
  FaSpinner,
  FaTimesCircle,
  FaHistory,
  FaHeartbeat,
  FaAmbulance,
  FaNotesMedical,
  FaTimes,
  FaUserMd,
  FaInfoCircle,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import axiosInstance from "../../api/axiosInstance";
// Import CSS cho HealthEvents
import "../../styles/nurse/health-events/index.css";

// Force CSS reload with timestamp
const timestamp = Date.now();

const HealthEvents = () => {
  const { user } = useAuth();
  const formRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(false);
  const [modalEventDetail, setModalEventDetail] = useState({});
  const [modalAdd, setModalAdd] = useState(false);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [formAdd, setFormAdd] = useState({
    eventType: "",
    location: "",
    description: "",
    studentNumber: "",
    medicalEventSupplys: [{ medicalSupplyId: "", quantity: 1 }],
  });

  // Professional state management
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [animateStats, setAnimateStats] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [nurseNote, setNurseNote] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    dateFrom: "",
    dateTo: "",
    eventType: "",
    location: "",
    status: "",
  });

  //phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 2;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // 👈 trigger useEffect để fetch lại dữ liệu
    }
  };

  //phân trang

  //search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // cập nhật sau 500ms nếu không gõ nữa
    }, 500);

    return () => {
      clearTimeout(handler); // clear timeout nếu user vẫn đang gõ
    };
  }, [search]);
  //kết thúc xử lí search

  // Search states
  const [searchAll, setSearchAll] = useState("");
  const [searchRecent, setSearchRecent] = useState("");
  const [searchToday, setSearchToday] = useState("");
  const [searchEmergency, setSearchEmergency] = useState("");

  // Show all states
  const [allShowAll, setAllShowAll] = useState(false);
  const [recentShowAll, setRecentShowAll] = useState(false);
  const [todayShowAll, setTodayShowAll] = useState(false);
  const [emergencyShowAll, setEmergencyShowAll] = useState(false);

  const [validated, setValidated] = useState(false);
  const ROW_LIMIT = 5;

  // Professional notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Enhanced export functionality
  const exportToExcel = (data, filename) => {
    try {
      const headers = [
        "STT",
        "Loại sự kiện",
        "Địa điểm",
        "Ngày",
        "Học sinh",
        "Y tá",
        "Mô tả",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((event, index) =>
          [
            index + 1,
            `"${event.eventType || "N/A"}"`,
            `"${event.location || "N/A"}"`,
            `"${formatDateTime(event.date) || "N/A"}"`,
            `"${event.studentName || "N/A"}"`,
            `"${event.nurseName || "N/A"}"`,
            `"${event.description || "N/A"}"`,
          ].join(",")
        ),
      ].join("\n");

      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Xuất Excel thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi xuất Excel!", "error");
    }
  };

  // Enhanced filter functionality
  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((event) => {
      const eventDate = new Date(event.date);
      const fromDate = filterOptions.dateFrom
        ? new Date(filterOptions.dateFrom)
        : null;
      const toDate = filterOptions.dateTo
        ? new Date(filterOptions.dateTo)
        : null;

      return (
        (!fromDate || eventDate >= fromDate) &&
        (!toDate || eventDate <= toDate) &&
        (!filterOptions.eventType ||
          event.eventType
            ?.toLowerCase()
            .includes(filterOptions.eventType.toLowerCase())) &&
        (!filterOptions.location ||
          event.location
            ?.toLowerCase()
            .includes(filterOptions.location.toLowerCase()))
      );
    });
  };

  const clearFilters = () => {
    setFilterOptions({
      dateFrom: "",
      dateTo: "",
      eventType: "",
      location: "",
      status: "",
    });
    showNotification("Đã xóa bộ lọc", "info");
  };

  // Data filtering
  const today = new Date().toDateString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const allEvents = applyFilters(events || []).filter(
    (event) =>
      event.eventType?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.studentName?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.nurseName?.toLowerCase().includes(searchAll.toLowerCase())
  );

  const recentEvents = applyFilters(events || []).filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate >= lastWeek &&
      (event.eventType?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(searchRecent.toLowerCase()))
    );
  });

  const todayEvents = applyFilters(events || []).filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.toDateString() === today &&
      (event.eventType?.toLowerCase().includes(searchToday.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchToday.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(searchToday.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(searchToday.toLowerCase()))
    );
  });

  // Statistics
  const totalEvents = (events || []).length;
  const totalRecent = recentEvents.length;
  const totalToday = todayEvents.length;
  const totalEmergency = (events || []).filter(
    (e) => e.eventType === "emergency"
  ).length;

  // Original handlers with enhanced error handling
  const handleChangeSelect = (idx, value) => {
    const updatedSupplys = [...formAdd.medicalEventSupplys];
    updatedSupplys[idx] = {
      quantity: 1,
      medicalSupplyId: value === "" ? "" : parseInt(value),
    };
    setFormAdd((prev) => ({
      ...prev,
      medicalEventSupplys: updatedSupplys,
    }));
  };

  const handleChangeQuantity = (idx, value) => {
    const updatedSupplys = [...formAdd.medicalEventSupplys];
    const selectedSupply = updatedSupplys[idx];

    if (value === "" || isNaN(parseInt(value))) {
      updatedSupplys[idx] = {
        ...selectedSupply,
        quantity: 1,
      };
    } else {
      const maxQuantity =
        medicalSupplies.find(
          (m) => String(m.id) === String(selectedSupply.medicalSupplyId)
        )?.quantity || 999;

      updatedSupplys[idx] = {
        ...selectedSupply,
        quantity: Math.min(Math.max(1, parseInt(value)), maxQuantity),
      };
    }

    setFormAdd((prev) => ({
      ...prev,
      medicalEventSupplys: updatedSupplys,
    }));
  };

  const handleRemoveSupply = (idx) => {
    const updatedSupplys = [...formAdd.medicalEventSupplys].filter(
      (_, i) => i !== idx
    );
    setFormAdd({ ...formAdd, medicalEventSupplys: updatedSupplys });
  };

  const handleAddSupply = () => {
    const updatedSupplys = [
      ...formAdd.medicalEventSupplys,
      { medicalSupplyId: "", quantity: 1 },
    ];
    setFormAdd({ ...formAdd, medicalEventSupplys: updatedSupplys });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Check if studentNumber is provided and not empty - moved outside try block
    const hasStudentNumber = formAdd.studentNumber && formAdd.studentNumber.trim() !== "";

    try {
      // Validate required fields according to API
      if (!formAdd.eventType || formAdd.eventType.trim() === "") {
        showNotification("Vui lòng chọn loại sự kiện!", "error");
        return;
      }

      if (!formAdd.location || formAdd.location.trim() === "") {
        showNotification("Vui lòng chọn địa điểm!", "error");
        return;
      }

      if (!formAdd.description || formAdd.description.trim() === "") {
        showNotification("Vui lòng nhập mô tả sự kiện!", "error");
        return;
      }

      // Validate nurse ID
      if (!user?.id || isNaN(parseInt(user.id))) {
        showNotification("Không xác định được thông tin y tá!", "error");
        return;
      }

      // Filter out empty medical supplies - keep only valid ones
      const validSupplies = formAdd.medicalEventSupplys.filter(
        (supply) =>
          supply.medicalSupplyId &&
          supply.medicalSupplyId !== "" &&
          !isNaN(parseInt(supply.medicalSupplyId)) &&
          supply.quantity > 0 &&
          !isNaN(parseInt(supply.quantity))
      );

      // No validation error for medical supplies - they're optional

      // Prepare data exactly as API expects
      const data = {
        eventType: formAdd.eventType,
        location: formAdd.location,
        description: formAdd.description,
        date: new Date().toISOString(),
        nurseId: parseInt(user.id),
      };

      // Validate student selection - yêu cầu bắt buộc chọn học sinh
      if (!hasStudentNumber) {
        showNotification("Vui lòng chọn lớp và học sinh!", "error");
        return;
      }

      data.studentNumber = formAdd.studentNumber.trim();

      // Only include medicalEventSupplys if there are valid supplies
      // Backend might not handle empty arrays or supplies with ID 0
      if (validSupplies.length > 0) {
        data.medicalEventSupplys = validSupplies.map((supply) => ({
          medicalSupplyId: parseInt(supply.medicalSupplyId),
          quantity: parseInt(supply.quantity),
        }));
      }



      const res = await postMedicalEvent(data);
      showNotification(
        `✅ Sự kiện y tế đã được tạo thành công cho học sinh ${formAdd.studentNumber}! 
        📋 Thông tin đã được lưu vào hệ thống.
        ⚠️ Lưu ý: Hệ thống chưa tự động gửi thông báo cho phụ huynh.`,
        "success"
      );
      setModalAdd(false);
      resetFormAdd();

      // Refresh data
      const updatedEvents = await getMedicalEvents();
      setEvents(Array.isArray(updatedEvents) ? updatedEvents : Array.isArray(updatedEvents?.items) ? updatedEvents.items : []);
    } catch (error) {
      // More detailed error handling
      let errorMessage = "Lỗi khi thêm sự kiện!";

      if (error.response?.status === 500) {
        if (hasStudentNumber) {
          errorMessage = `Lỗi: Mã học sinh "${formAdd.studentNumber.trim()}" không tồn tại trong hệ thống!`;
        } else {
          errorMessage = "Lỗi server: Không thể tạo sự kiện. Vui lòng kiểm tra dữ liệu đầu vào.";
        }
      } else if (error.response?.status === 400) {
        errorMessage = `Dữ liệu không hợp lệ: ${error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin'}`;
      } else if (error.response?.data?.message) {
        errorMessage = `Lỗi: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }

      showNotification(errorMessage, "error");
    }
  };

  const resetFormAdd = () => {
    setFormAdd({
      eventType: "",
      location: "",
      description: "",
      studentNumber: "",
      medicalEventSupplys: [{ medicalSupplyId: "", quantity: 1 }],
    });
    setSelectedClassId("");
    setStudentsList([]);
    setValidated(false);
  };

  // Fetch class list
  const fetchClassList = async () => {
    try {
      const res = await axiosInstance.get("/Class");
      if (res.data && res.data.success) {
        // Filter out invalid class objects - API returns classId not id
        const validClasses = (res.data.data || []).filter(
          cls => cls && (cls.classId !== undefined && cls.classId !== null || cls.id !== undefined && cls.id !== null) && cls.className
        ).map(cls => ({
          // Normalize to use 'id' field for consistency
          id: cls.classId || cls.id,
          className: cls.className
        }));
        setClassList(validClasses);
      } else {
        setClassList([]);
      }
    } catch (error) {
      setClassList([]);
      showNotification("Lỗi khi tải danh sách lớp!", "error");
    }
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classId) => {
    try {
      const res = await axiosInstance.get(`/Students/${classId}?pageNumber=1&pageSize=100`);
      if (res.data && res.data.success) {
        // Filter out invalid student objects
        const validStudents = (res.data.data.items || []).filter(
          student => student && student.id !== undefined && student.id !== null && student.studentNumber
        );
        setStudentsList(validStudents);
      } else {
        setStudentsList([]);
      }
    } catch (error) {
      setStudentsList([]);
      // Handle 404 specifically - no students in class
      if (error.response?.status === 404) {
        showNotification("Lớp này chưa có học sinh nào!", "info");
      } else {
        showNotification("Lỗi khi tải danh sách học sinh!", "error");
      }
    }
  };

  // Handle class selection
  const handleClassChange = async (classId) => {
    setSelectedClassId(classId);
    setFormAdd(prev => ({ ...prev, studentNumber: "" })); // Reset student selection
    if (classId && classId !== "") {
      // Ensure classId is a number
      const numericClassId = parseInt(classId);
      if (!isNaN(numericClassId)) {
        await fetchStudentsByClass(numericClassId);
      } else {
        setStudentsList([]);
        showNotification("ID lớp không hợp lệ!", "error");
      }
    } else {
      setStudentsList([]);
    }
  };

  const fetchMedicalSupply = async () => {
    try {
      const res = await getMedicalSupply();
      setMedicalSupplies(res || []);
      await fetchClassList(); // Load classes when opening modal
      setModalAdd(true);
    } catch (error) {
      showNotification("Lỗi khi tải danh sách vật tư!", "error");
    }
  };

  const loadMedicalEventDetailModal = async (eventId) => {
    try {
      setDetailLoading(true);
      const res = await getMedicalEventDetail(eventId);

      if (res && res.eventType) {
        setModalEventDetail(res);
        setModalEvent(true);
      } else {
        showNotification("Không tìm thấy thông tin chi tiết sự kiện!", "error");
      }
    } catch (error) {
      let errorMessage = "Lỗi khi tải chi tiết sự kiện!";

      if (error.response?.status === 404) {
        errorMessage = "Sự kiện không tồn tại hoặc đã bị xóa!";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi hệ thống! Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }

      showNotification(errorMessage, "error");
    } finally {
      setDetailLoading(false);
    }
  };

  // Enhanced action buttons
  const renderActionButtons = (event) => (
    <div className="health-events-action-buttons">
      <button
        className="health-events-btn-action view"
        onClick={() => loadMedicalEventDetailModal(event.id)}
        title="Xem chi tiết"
      >
        <FaEye />
      </button>
    </div>
  );

  // Professional table renderer
  const renderTable = (
    data,
    type,
    searchValue,
    setSearch,
    showAll,
    setShowAll
  ) => (
    <div className="medicine-table-container">
      <div className="table-header">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo loại sự kiện, địa điểm, học sinh..."
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <Button
              variant="outline-secondary"
              className="filter-btn"
              onClick={() => setShowFilterModal(true)}
            >
              <FaFilter /> Lọc
            </Button>
            <Button
              variant="outline-success"
              className="export-btn"
              onClick={() => {
                const filename =
                  type === "all"
                    ? "tat-ca-su-kien"
                    : type === "recent"
                      ? "su-kien-gan-day"
                      : type === "today"
                        ? "su-kien-hom-nay"
                        : "su-kien-cap-cuu";
                exportToExcel(data, filename);
              }}
            >
              <FaDownload /> Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="health-events-table-responsive">
        <Table className="health-events-table">
          <thead>
            <tr>
              <th>Loại sự kiện</th>
              <th>Địa điểm</th>
              <th>Ngày</th>
              <th>Học sinh</th>
              <th>Y tá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(showAll ? data : data.slice(0, ROW_LIMIT)).map((event, index) => (
              <tr key={event.id || `event-${index}`} className="table-row">
                <td>
                  <div className="event-type-info">
                    {event.eventType || "N/A"}
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    {event.location || "N/A"}
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    {formatDateTime(event.date) || "N/A"}
                  </div>
                </td>
                <td>
                  <div className="student-info">
                    <strong>{event.studentName || "N/A"}</strong>
                  </div>
                </td>
                <td>
                  <div className="nurse-info">
                    {event.nurseName || "N/A"}
                  </div>
                </td>
                <td>
                  {renderActionButtons(event)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center empty-state">
                  <div className="empty-content">
                    <FaCalendarAlt className="empty-icon" />
                    <h5 className="empty-title">Không có sự kiện nào</h5>
                    <p className="empty-description">
                      {type === "all"
                        ? "Hiện tại chưa có sự kiện y tế nào trong hệ thống"
                        : type === "recent"
                          ? "Không có sự kiện y tế nào trong 7 ngày qua"
                          : type === "today"
                            ? "Hôm nay chưa có sự kiện y tế nào được ghi nhận"
                            : "Không có sự kiện nào trong danh mục này"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {data.length > ROW_LIMIT && (
        <div className="table-footer">
          <Button
            variant="link"
            className="health-events-show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? "Thu gọn"
              : `Xem thêm ${data.length - ROW_LIMIT} sự kiện`}
          </Button>
        </div>
      )}
    </div>
  );

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchMedicalEvents = async () => {
      try {
        setLoading(true);
        const res = await getMedicalEvents(currentPage, pageSize, search);

        // Ensure res and res.items exist, fallback to empty array
        if (res && typeof res === 'object') {
          setEvents(Array.isArray(res.items) ? res.items : Array.isArray(res) ? res : []);
          setCurrentPage(res.currentPage || currentPage);
          setTotalPages(res.totalPages || 1);
          setTotalItems(res.totalItems || 0);
        } else {
          // If res is an array directly
          setEvents(Array.isArray(res) ? res : []);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalItems(Array.isArray(res) ? res.length : 0);
        }

        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        setEvents([]); // Ensure events is always an array even on error
        showNotification("Lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalEvents();
  }, [currentPage, debouncedSearch]);

  //
  return (
    <div className="container-fluid nurse-theme medicine-management">

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

      {/* Page Header */}
      <div className="health-events-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-title">
              <FaHeartbeat className="page-icon" />
              <h1>Quản lý Sự kiện Y tế</h1>
            </div>
            <p className="page-subtitle">
              Theo dõi và quản lý các sự kiện y tế trong trường
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="nurse-events-stats-row">
        <div className="nurse-events-stat-card">
          <div className="nurse-events-stat-icon">
            <img src={cendal} alt="Calendar" />
          </div>
          <div className="nurse-events-stat-label">
            Tổng sự kiện
          </div>
          <div className="nurse-events-stat-value">
            {totalItems}
          </div>
        </div>
        <div className="nurse-events-stat-card">
          <div className="nurse-events-stat-icon">
            <img src={nearly} alt="Nearly" />
          </div>
          <div className="nurse-events-stat-label">
            Gần đây (7 ngày)
          </div>
          <div className="nurse-events-stat-value">
            {totalRecent}
          </div>
        </div>
        <div className="nurse-events-stat-card">
          <div className="nurse-events-stat-icon">
            <img src={Today} alt="Today" />
          </div>
          <div className="nurse-events-stat-label">
            Hôm nay
          </div>
          <div className="nurse-events-stat-value">
            {totalToday}
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <div className="add-event-container">
        <Button
          variant="success"
          size="lg"
          onClick={() => fetchMedicalSupply()}
          className="add-event-btn"
        >
          <FaPlus className="me-2" /> Thêm Sự kiện Y tế
        </Button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="fa-spin loading-icon" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <Tabs
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="medicine-tabs"
            >
              <Tab
                eventKey="all"
                title={
                  <div className="tab-title pending">
                    <FaList className="tab-icon" />
                    <span>Tất cả</span>
                    <Badge bg="primary" className="tab-badge">
                      {totalItems}
                    </Badge>
                  </div>
                }
              >
                <div className="tab-content">
                  {renderTable(
                    allEvents,
                    "all",
                    search,
                    setSearch,
                    allShowAll,
                    setAllShowAll
                  )}
                </div>
              </Tab>

              <Tab
                eventKey="recent"
                title={
                  <div className="tab-title active">
                    <FaHistory className="tab-icon" />
                    <span>Gần đây</span>
                    <Badge bg="info" className="tab-badge">
                      {totalRecent}
                    </Badge>
                  </div>
                }
              >
                <div className="tab-content">
                  {renderTable(
                    recentEvents,
                    "recent",
                    search,
                    setSearch,
                    recentShowAll,
                    setRecentShowAll
                  )}
                </div>
              </Tab>

              <Tab
                eventKey="today"
                title={
                  <div className="tab-title today">
                    <FaCalendarAlt className="tab-icon" />
                    <span>Hôm nay</span>
                    <Badge bg="warning" className="tab-badge">
                      {totalToday}
                    </Badge>
                  </div>
                }
              >
                <div className="tab-content">
                  {renderTable(
                    todayEvents,
                    "today",
                    search,
                    setSearch,
                    todayShowAll,
                    setTodayShowAll
                  )}
                </div>
              </Tab>
            </Tabs>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Health Event Detail Modal - Single Form Design */}
      <Modal
        show={modalEvent}
        onHide={() => {
          setModalEvent(false);
          setNurseNote("");
        }}
        size="xl"
        className="enhanced-health-event-modal"
        centered
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission if needed (e.g., update notes)
            // For now, just close modal
            setModalEvent(false);
            setNurseNote("");
          }}
        >
          <div className="enhanced-modal-header">
            <div className="header-content">
              <div className="modal-icon">
                <FaHeartbeat />
              </div>
              <div className="header-text">
                <h2>Chi tiết Sự kiện Y tế</h2>
                <p>Thông tin đầy đủ về sự kiện và biện pháp đã thực hiện</p>
              </div>
            </div>
            {modalEventDetail && modalEventDetail.eventType && (
              <div className="status-indicator">
                <div className="status-badge-enhanced completed">
                  ✅ Đã hoàn thành
                </div>
              </div>
            )}
          </div>

          <div className="enhanced-modal-body">
            {detailLoading && (
              <div className="loading-state">
                <FaSpinner className="fa-spin loading-spinner" />
                <h4>Đang tải chi tiết sự kiện...</h4>
                <p>Vui lòng chờ trong giây lát</p>
              </div>
            )}

            {!detailLoading &&
              (!modalEventDetail || !modalEventDetail.eventType) && (
                <div className="error-state">
                  <FaExclamationTriangle className="error-icon" />
                  <h4>Không tìm thấy chi tiết sự kiện</h4>
                  <p>Dữ liệu có thể đã bị xóa hoặc không tồn tại</p>
                </div>
              )}

            {!detailLoading &&
              modalEventDetail &&
              modalEventDetail.eventType && (
                <div className="form-content">
                  {/* Section 1: Event Info */}
                  <fieldset className="form-section">
                    <legend>
                      <FaHeartbeat />
                      Thông tin sự kiện
                    </legend>
                    <div className="info-card">
                      <div className="info-item">
                        <label>
                          <FaList />
                          Loại sự kiện
                        </label>
                        <div className="info-value event-type">
                          {modalEventDetail.eventType}
                        </div>
                      </div>
                      <div className="info-item">
                        <label>
                          <FaMapMarkerAlt />
                          Địa điểm
                        </label>
                        <div className="info-value">
                          {modalEventDetail.location}
                        </div>
                      </div>
                      <div className="info-item">
                        <label>
                          <FaCalendarAlt />
                          Thời gian thực hiện
                        </label>
                        <div className="info-value">
                          {formatDateTime(modalEventDetail.date)}
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Section 2: People Involved */}
                  <fieldset className="form-section">
                    <legend>
                      <FaUserGraduate />
                      Thông tin liên quan
                    </legend>
                    <div className="info-card">
                      <div className="info-item">
                        <label>
                          <FaUser />
                          Học sinh
                        </label>
                        <div className="info-value">
                          {modalEventDetail.studentName || (
                            <span className="no-data">
                              Sự kiện chung - Không có học sinh cụ thể
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="info-item">
                        <label>
                          <FaUserNurse />Y tá phụ trách
                        </label>
                        <div className="info-value">
                          {modalEventDetail.nurseName}
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Section 3: Event Description */}
                  <fieldset className="form-section">
                    <legend>
                      <FaClipboardList />
                      Mô tả chi tiết
                    </legend>
                    <div className="description-card">
                      <div className="description-content">
                        <label>
                          <FaNotesMedical />
                          Mô tả sự kiện
                        </label>
                        <div className="description-text">
                          {modalEventDetail.description}
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Section 4: Medical Supplies */}
                  {((modalEventDetail.medicalEventSupplys &&
                    modalEventDetail.medicalEventSupplys.length > 0) ||
                    (modalEventDetail.supplies &&
                      modalEventDetail.supplies.length > 0)) && (
                      <fieldset className="form-section">
                        <legend>
                          <FaMedkit />
                          Vật tư y tế đã sử dụng
                        </legend>
                        <div className="supplies-list">
                          {(
                            modalEventDetail.medicalEventSupplys ||
                            modalEventDetail.supplies ||
                            []
                          ).map((supply, index) => (
                            <div key={index} className="supply-item">
                              <div className="supply-icon">
                                <FaCapsules />
                              </div>
                              <div className="supply-details">
                                <h4>
                                  {supply.medicalSupplyName ||
                                    supply.MedicalSupplyName ||
                                    "N/A"}
                                </h4>
                                <div className="supply-quantity">
                                  <span className="quantity-label">
                                    Số lượng đã sử dụng:
                                  </span>
                                  <span className="quantity-value">
                                    {supply.quantity || supply.Quantity || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    )}
                </div>
              )}
          </div>

          <div className="enhanced-modal-footer">
            <div className="footer-actions">
              <Button
                type="button"
                variant="secondary"
                className="btn-close"
                onClick={() => {
                  setModalEvent(false);
                  setNurseNote("");
                }}
              >
                {/* <FaTimes /> */}
                Đóng
              </Button>

              {/* <div className="action-buttons">
                {nurseNote.trim() && (
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-save-note"
                  >
                    <FaCheckCircle />
                    Lưu ghi chú
                  </Button>
                )}
              </div> */}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Enhanced Add Health Event Modal - Single Form Design */}
      <Modal
        show={modalAdd}
        onHide={() => {
          setModalAdd(false);
          resetFormAdd();
        }}
        size="xl"
        className="enhanced-add-event-modal"
        centered
      >
        <Form
          ref={formRef}
          noValidate
          validated={validated}
          onSubmit={handleSubmitForm}
        >
          <div className="enhanced-modal-header">
            <div className="header-content">
              <div className="modal-icon">
                <FaHeartbeat />
              </div>
              <div className="header-text">
                <h2>Tạo Sự Kiện Y Tế Mới</h2>
                <p>Ghi lại sự kiện y tế và các biện pháp đã thực hiện</p>
              </div>
            </div>
            <div className="status-indicator">
              <div className="status-badge-enhanced new">✨ Sự kiện mới</div>
            </div>
          </div>

          <div className="enhanced-modal-body">
            <div className="form-content">
              {/* Section 1: Basic Event Information */}
              <fieldset className="form-section">
                <legend>
                  <FaHeartbeat />
                  Thông tin cơ bản
                </legend>
                <div className="input-grid">
                  <div className="input-group">
                    <Form.Group controlId="eventType">
                      <Form.Label>
                        <FaList />
                        Loại sự kiện <span className="required">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formAdd.eventType}
                        onChange={(e) =>
                          setFormAdd({ ...formAdd, eventType: e.target.value })
                        }
                        className="form-control-enhanced"
                        required
                      >
                        <option key="empty-event-type" value="">Chọn loại sự kiện...</option>
                        <option key="health_check" value="health_check">Khám sức khỏe</option>
                        <option key="vaccination" value="vaccination">Tiêm phòng</option>
                        <option key="emergency" value="emergency">Cấp cứu</option>
                        <option key="medication" value="medication">Cho thuốc</option>
                        <option key="injury" value="injury">Chấn thương</option>
                        <option key="other" value="other">Khác</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Vui lòng chọn loại sự kiện
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="input-group">
                    <Form.Group controlId="eventLocation">
                      <Form.Label>
                        <FaMapMarkerAlt />
                        Địa điểm <span className="required">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="VD: Phòng y tế, Lớp 10A1, Sân chơi, Hành lang tầng 2..."
                        value={formAdd.location}
                        onChange={(e) =>
                          setFormAdd({ ...formAdd, location: e.target.value })
                        }
                        className="form-control-enhanced"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập địa điểm
                      </Form.Control.Feedback>
                      <div className="form-help">
                        <FaInfoCircle />
                        Nhập địa điểm cụ thể nơi xảy ra sự kiện y tế
                      </div>
                    </Form.Group>
                  </div>

                  <div className="input-group">
                    <Form.Group controlId="classSelect">
                      <Form.Label>
                        <FaUserGraduate />
                        Chọn lớp <span className="required">*</span>
                      </Form.Label>
                      <Form.Select
                        value={selectedClassId}
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="form-control-enhanced"
                        required
                      >
                        <option key="empty-class" value="">Chọn lớp...</option>
                        {classList.map((cls, index) => (
                          <option
                            key={cls.id ? `class-${cls.id}` : `class-fallback-${index}`}
                            value={cls.id || ""}
                          >
                            {cls.className || "Lớp không xác định"}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Vui lòng chọn lớp
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="input-group">
                    <Form.Group controlId="studentSelect">
                      <Form.Label>
                        <FaUser />
                        Chọn học sinh <span className="required">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formAdd.studentNumber}
                        onChange={(e) =>
                          setFormAdd({
                            ...formAdd,
                            studentNumber: e.target.value,
                          })
                        }
                        className="form-control-enhanced"
                        disabled={!selectedClassId}
                        required
                      >
                        <option key="empty-student" value="">
                          {selectedClassId
                            ? (studentsList.length > 0
                              ? "Chọn học sinh..."
                              : "Không có học sinh trong lớp")
                            : "Vui lòng chọn lớp trước"
                          }
                        </option>
                        {studentsList.map((student, index) => (
                          <option
                            key={student.id ? `student-${student.id}` : `student-fallback-${index}`}
                            value={student.studentNumber || ""}
                          >
                            {(student.studentNumber || "N/A")} - {(student.studentName || "Tên không xác định")}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Vui lòng chọn học sinh
                      </Form.Control.Feedback>
                      <div className="form-help">
                        <FaInfoCircle />
                        Chọn lớp trước, sau đó chọn học sinh cụ thể.
                        <br />
                        <strong>Lưu ý:</strong> Sự kiện sẽ được lưu nhưng chưa tự động gửi thông báo cho phụ huynh.
                      </div>
                    </Form.Group>
                  </div>
                </div>
              </fieldset>

              {/* Section 2: Event Description */}
              <fieldset className="form-section">
                <legend>
                  <FaNotesMedical />
                  Mô tả chi tiết sự kiện
                </legend>
                <div className="description-input">
                  <Form.Group controlId="eventDescription">
                    <Form.Label>
                      <FaClipboardList />
                      Mô tả sự kiện <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Mô tả chi tiết về sự kiện: triệu chứng, tình trạng, hành động đã thực hiện, kết quả..."
                      value={formAdd.description}
                      onChange={(e) =>
                        setFormAdd({ ...formAdd, description: e.target.value })
                      }
                      className="form-control-enhanced description-textarea"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng mô tả chi tiết sự kiện
                    </Form.Control.Feedback>
                    <div className="form-help">
                      <FaInfoCircle />
                      Ghi rõ tình trạng của học sinh và các biện pháp đã thực
                      hiện
                    </div>
                  </Form.Group>
                </div>
              </fieldset>

              {/* Section 3: Medical Supplies */}
              <fieldset className="form-section">
                <legend>
                  <FaMedkit />
                  Vật tư y tế sử dụng
                </legend>
                <div className="supplies-container">
                  {formAdd.medicalEventSupplys.map((item, idx) => (
                    <div key={idx} className="supply-card">
                      <div className="supply-header">
                        <div className="supply-number">
                          <FaCapsules />
                          Vật tư #{idx + 1}
                        </div>
                        {formAdd.medicalEventSupplys.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveSupply(idx)}
                            className="remove-btn"
                            title="Xóa vật tư này"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>

                      <div className="supply-inputs">
                        <div className="supply-select">
                          <Form.Label>
                            <FaMedkit />
                            Chọn vật tư
                          </Form.Label>
                          <Form.Select
                            value={item.medicalSupplyId}
                            onChange={(e) =>
                              handleChangeSelect(idx, e.target.value)
                            }
                            className="form-control-enhanced"
                          >
                            <option key="empty-supply" value="">-- Chọn vật tư y tế --</option>
                            {medicalSupplies.map((supply, index) => (
                              <option
                                key={supply.id ? `supply-${supply.id}` : `supply-fallback-${index}`}
                                value={supply.id || ""}
                              >
                                {(supply.name || "Vật tư không xác định")} (Tồn kho: {supply.quantity || 0})
                              </option>
                            ))}
                          </Form.Select>
                        </div>

                        <div className="quantity-input">
                          <Form.Label>
                            <FaList />
                            Số lượng
                          </Form.Label>
                          <div className="quantity-wrapper">
                            <Form.Control
                              type="number"
                              placeholder="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleChangeQuantity(idx, e.target.value)
                              }
                              min="1"
                              max={
                                medicalSupplies.find(
                                  (s) =>
                                    String(s.id) ===
                                    String(item.medicalSupplyId)
                                )?.quantity || 999
                              }
                              className="form-control-enhanced"
                            />
                            {item.medicalSupplyId && (
                              <span className="max-quantity">
                                /{" "}
                                {medicalSupplies.find(
                                  (s) =>
                                    String(s.id) ===
                                    String(item.medicalSupplyId)
                                )?.quantity || 0}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="add-supply-card">
                    <Button
                      variant="outline-primary"
                      onClick={handleAddSupply}
                      className="add-supply-btn"
                    >
                      <FaPlus />
                      Thêm vật tư khác
                    </Button>
                    <p className="add-supply-text">
                      Thêm tất cả vật tư y tế đã sử dụng trong sự kiện này
                    </p>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="enhanced-modal-footer">
            <div className="footer-actions">
              <Button
                type="button"
                variant="secondary"
                className="btn-cancel"
                onClick={() => {
                  setModalAdd(false);
                  resetFormAdd();
                }}
              >
                <FaTimes />
                Hủy bỏ
              </Button>

              <div className="action-buttons">
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="btn-reset"
                  onClick={resetFormAdd}
                >
                  <FaTrash />
                  Làm mới
                </Button>

                <Button type="submit" variant="primary" className="btn-save">
                  <FaCheckCircle />
                  Lưu sự kiện
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Filter Modal */}
      <Modal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        size="md"
        className="filter-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FaFilter className="modal-icon" />
            Bộ lọc nâng cao
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateFrom}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateFrom: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateTo}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateTo: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Loại sự kiện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm theo loại sự kiện"
                value={filterOptions.eventType}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    eventType: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm theo địa điểm"
                value={filterOptions.location}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* Filter Summary */}
            <div className="filter-summary">
              <h6>Tóm tắt bộ lọc</h6>
              <div className="filter-tags">
                {filterOptions.dateFrom && (
                  <Badge bg="primary" className="me-1">
                    Từ: {filterOptions.dateFrom}
                  </Badge>
                )}
                {filterOptions.dateTo && (
                  <Badge bg="primary" className="me-1">
                    Đến: {filterOptions.dateTo}
                  </Badge>
                )}
                {filterOptions.eventType && (
                  <Badge bg="info" className="me-1">
                    Loại: {filterOptions.eventType}
                  </Badge>
                )}
                {filterOptions.location && (
                  <Badge bg="warning" className="me-1">
                    Địa điểm: {filterOptions.location}
                  </Badge>
                )}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="outline-secondary" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowFilterModal(false)}
          >
            Áp dụng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HealthEvents;
