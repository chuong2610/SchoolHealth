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
  getHealthEventStatistics,
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
  FaUserFriends,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import axiosInstance from "../../api/axiosInstance";
// Import CSS cho HealthEvents
import "../../styles/nurse/health-events/index.css";
import { use } from "react";
// CSS được import tự động từ main.jsx

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
  const pageSize = 5;

  // Statistics
  const [healthEventStatistics, setHealthEventStatistics] = useState({
    totalCount: 0,
    last7DaysCount: 0,
    todayCount: 0,
  });

  const fetchHealthEventStatistics = async () => {
    try {
      const res = await getHealthEventStatistics();
      if (res) {
        setHealthEventStatistics({
          totalCount: res.totalCount,
          last7DaysCount: res.last7DaysCount,
          todayCount: res.todayCount,
        });
      } else {
        console.log("Không có dữ liệu thống kê");
        setHealthEventStatistics({
          totalCount: 0,
          last7DaysCount: 0,
          todayCount: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching health event statistics:", error);
      setHealthEventStatistics({
        totalCount: 0,
        last7DaysCount: 0,
        todayCount: 0,
      });
    }
  };

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
        medicalEventSupplys:
          validSupplies.length > 0
            ? validSupplies.map((supply) => ({
              medicalSupplyId: parseInt(supply.medicalSupplyId),
              quantity: parseInt(supply.quantity),
            }))
            : [
              {
                medicalSupplyId: 0,
                quantity: 0,
              },
            ],
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
    <div className="btn-group">
      <button
        className="action-btn view"
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
    <div className="table-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo loại sự kiện, địa điểm, học sinh..."
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button
            className="filter-btn"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter /> Lọc
          </button>
          <button
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
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <Table className="table">
          <thead>
            <tr>
              <th
                style={{ width: "150px", minWidth: "150px", maxWidth: "150px" }}
              >
                Loại sự kiện
              </th>
              <th
                style={{ width: "120px", minWidth: "120px", maxWidth: "120px" }}
              >
                Địa điểm
              </th>
              <th
                style={{ width: "120px", minWidth: "120px", maxWidth: "120px" }}
              >
                Ngày
              </th>
              <th
                style={{ width: "150px", minWidth: "150px", maxWidth: "150px" }}
              >
                Học sinh
              </th>
              <th
                style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
              >
                Y tá
              </th>
              <th
                style={{ width: "150px", minWidth: "150px", maxWidth: "150px" }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {(showAll ? data : data.slice(0, ROW_LIMIT)).map((event, index) => (
              <tr key={event.id || `event-${index}`} className="table-row">
                <td
                  style={{
                    width: "150px",
                    minWidth: "150px",
                    maxWidth: "150px",
                  }}
                >
                  <div className={`event-type-badge ${event.eventType || 'other'}`}>
                    <FaHeartbeat />
                    {event.eventType || "N/A"}
                  </div>
                </td>
                <td
                  style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                  }}
                >
                  <div className="location-info">

                    {event.location || "N/A"}
                  </div>
                </td>
                <td
                  style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                  }}
                >
                  <div className="date-info">

                    {formatDateTime(event.date) || "N/A"}
                  </div>
                </td>
                <td
                  style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                  }}
                >
                  <div className="student-info">

                    <strong>{event.studentName || "N/A"}</strong>
                  </div>
                </td>
                <td
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                >
                  <div className="nurse-info">

                    {event.nurseName || "N/A"}
                  </div>
                </td>
                <td
                  style={{
                    width: "150px",
                    minWidth: "150px",
                    maxWidth: "150px",
                  }}
                >
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

        setEvents(Array.isArray(res.items) ? res.items : []);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems);

        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        setEvents([]); // Ensure events is always an array even on error
        showNotification("Lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalEvents();
    fetchHealthEventStatistics();
  }, [activeTab, currentPage, debouncedSearch]);

  //
  return (
    <div className="container-fluid nurse-theme health-events-management">

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

      {/* Page Header with Coral Theme */}
      <div className="page-header">
        <div className="header-content">
          <div className="page-title">
            <h1>Quản lý Sự kiện Y tế</h1>
          </div>
          <p className="page-subtitle">
            Theo dõi và quản lý các sự kiện y tế trong trường
          </p>
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
          <div className="nurse-events-stat-value" style={{ color: "#43a047" }}>
            {healthEventStatistics.totalCount}
          </div>
        </div>
        <div className="nurse-events-stat-card">
          <div className="nurse-events-stat-icon">
            <img src={nearly} alt="Nearly" />
          </div>
          <div className="nurse-events-stat-label">
            Gần đây (7 ngày)
          </div>
          <div className="nurse-events-stat-value" style={{ color: "#ffa000" }}>
            {healthEventStatistics.last7DaysCount}
          </div>
        </div>
        <div className="nurse-events-stat-card">
          <div className="nurse-events-stat-icon">
            <img src={Today} alt="Today" />
          </div>
          <div className="nurse-events-stat-label">
            Hôm nay
          </div>
          <div className="nurse-events-stat-value" style={{ color: "#039be5" }}>
            {healthEventStatistics.todayCount}
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
              onSelect={() => {
                setActiveTab();
                setCurrentPage(1);
              }}
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

              {/* <Tab
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
              </Tab> */}
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
      {modalEvent && (
        <Modal show={modalEvent} onHide={() => {
          setModalEvent(false);
          setNurseNote("");
        }} centered size="md" className="simple-event-detail-modal">
          <Modal.Body>
            <div className="simple-event-detail">
              {/* Card 1: Thông tin sự kiện */}
              <div className="simple-card">
                <div className="simple-card-title"><FaHeartbeat style={{ marginRight: 6 }} />Thông tin sự kiện</div>
                <div className="info-row">
                  <span className="info-label">Loại sự kiện:</span>
                  <span className="info-value">{modalEventDetail?.eventType}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Thời gian:</span>
                  <span className="info-value">{formatDateTime(modalEventDetail?.date)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa điểm:</span>
                  <span className="info-value">{modalEventDetail?.location}</span>
                </div>
              </div>
              {/* Card 2: Người liên quan */}
              <div className="simple-card">
                <div className="simple-card-title"><FaUserFriends style={{ marginRight: 6 }} />Người liên quan</div>
                <div className="person-row-simple">
                  <img src={modalEventDetail?.studentAvatar || '/default-avatar.png'} className="avatar-simple" alt="student" />
                  <div className="person-info">
                    <span className="person-label">Học sinh:</span>
                    <span className="person-name">{modalEventDetail?.studentName}</span>
                  </div>
                </div>
                <div className="person-row-simple">
                  <img src={modalEventDetail?.nurseAvatar || '/default-avatar.png'} className="avatar-simple" alt="nurse" />
                  <div className="person-info">
                    <span className="person-label">Y tá:</span>
                    <span className="person-name">{modalEventDetail?.nurseName}</span>
                  </div>
                </div>
              </div>
              {/* Card 3: Mô tả chi tiết */}
              <div className="simple-card">
                <div className="simple-card-title"><FaClipboardList style={{ marginRight: 6 }} />Mô tả chi tiết</div>
                <div className="description-simple">
                  {modalEventDetail?.description}
                </div>
              </div>
              {/* Card 4: Vật tư y tế */}
              <div className="simple-card">
                <div className="simple-card-title"><FaMedkit style={{ marginRight: 6 }} />Vật tư y tế sử dụng</div>
                {(modalEventDetail?.supplies || []).map((s, idx) => (
                  <div className="supply-row-simple" key={idx}>
                    <span className="supply-name">{s.name}</span>
                    <span className="supply-qty-simple">({s.quantity} lần)</span>
                  </div>
                ))}
                {(modalEventDetail?.supplies || []).length === 0 && (
                  <div className="no-supplies-simple">Không có vật tư y tế</div>
                )}
              </div>
              {/* Button */}
              <div className="simple-event-actions">
                <button className="btn-back-simple" onClick={() => {
                  setModalEvent(false);
                  setNurseNote("");
                }}>
                  <FaTimes /> Đóng
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Enhanced Add Health Event Modal - Single Form Design */}
      <Modal
        show={modalAdd}
        onHide={() => {
          setModalAdd(false);
          resetFormAdd();
        }}
        size="md"
        className="simple-add-event-modal"
        centered
      >
        <Form
          ref={formRef}
          noValidate
          validated={validated}
          onSubmit={handleSubmitForm}
        >
          <div className="simple-modal-header">
            <h2><FaHeartbeat style={{ marginRight: 8 }} />Tạo Sự Kiện Y Tế</h2>
          </div>
          <div className="simple-modal-body">
            {/* Thông tin cơ bản */}
            <div className="simple-card">
              <div className="simple-card-title"><FaHeartbeat style={{ marginRight: 6 }} />Thông tin sự kiện</div>
              <Form.Group className="mb-3" controlId="eventType">
                <Form.Label>Loại sự kiện <span className="required">*</span></Form.Label>
                <Form.Select
                  value={formAdd.eventType}
                  onChange={e => setFormAdd({ ...formAdd, eventType: e.target.value })}
                  required
                >
                  <option value="">Chọn loại sự kiện...</option>
                  <option value="health_check">Khám sức khỏe</option>
                  <option value="vaccination">Tiêm phòng</option>
                  <option value="emergency">Cấp cứu</option>
                  <option value="medication">Cho thuốc</option>
                  <option value="injury">Chấn thương</option>
                  <option value="other">Khác</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Vui lòng chọn loại sự kiện</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="eventLocation">
                <Form.Label>Địa điểm <span className="required">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VD: Phòng y tế, Lớp 10A1, ..."
                  value={formAdd.location}
                  onChange={e => setFormAdd({ ...formAdd, location: e.target.value })}
                  required
                />
                <Form.Control.Feedback type="invalid">Vui lòng nhập địa điểm</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="classSelect">
                <Form.Label>Chọn lớp <span className="required">*</span></Form.Label>
                <Form.Select
                  value={selectedClassId}
                  onChange={e => handleClassChange(e.target.value)}
                  required
                >
                  <option value="">Chọn lớp...</option>
                  {classList.map((cls, idx) => (
                    <option key={cls.id || idx} value={cls.id || ""}>{cls.className || "Lớp không xác định"}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Vui lòng chọn lớp</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="studentSelect">
                <Form.Label>Chọn học sinh <span className="required">*</span></Form.Label>
                <Form.Select
                  value={formAdd.studentNumber}
                  onChange={e => setFormAdd({ ...formAdd, studentNumber: e.target.value })}
                  disabled={!selectedClassId}
                  required
                >
                  <option value="">{selectedClassId ? (studentsList.length > 0 ? "Chọn học sinh..." : "Không có học sinh trong lớp") : "Vui lòng chọn lớp trước"}</option>
                  {studentsList.map((student, idx) => (
                    <option key={student.id || idx} value={student.studentNumber || ""}>{(student.studentNumber || "N/A") + " - " + (student.studentName || "Tên không xác định")}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Vui lòng chọn học sinh</Form.Control.Feedback>
              </Form.Group>
            </div>
            {/* Mô tả chi tiết */}
            <div className="simple-card">
              <div className="simple-card-title"><FaNotesMedical style={{ marginRight: 6 }} />Mô tả chi tiết</div>
              <Form.Group controlId="eventDescription">
                <Form.Label>Mô tả sự kiện <span className="required">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Mô tả chi tiết về sự kiện, triệu chứng, tình trạng, hành động đã thực hiện..."
                  value={formAdd.description}
                  onChange={e => setFormAdd({ ...formAdd, description: e.target.value })}
                  required
                />
                <Form.Control.Feedback type="invalid">Vui lòng mô tả chi tiết sự kiện</Form.Control.Feedback>
              </Form.Group>
            </div>
            {/* Vật tư y tế */}
            <div className="simple-card">
              <div className="simple-card-title"><FaMedkit style={{ marginRight: 6 }} />Vật tư y tế sử dụng</div>
              {formAdd.medicalEventSupplys.map((item, idx) => (
                <div key={idx} className="supply-row-simple">
                  <Form.Group className="mb-2" style={{ flex: 1 }}>
                    <Form.Label>Tên vật tư</Form.Label>
                    <Form.Select
                      value={item.medicalSupplyId}
                      onChange={e => handleChangeSelect(idx, e.target.value)}
                    >
                      <option value="">Chọn vật tư...</option>
                      {medicalSupplies.map((supply, i) => (
                        <option key={supply.id || i} value={supply.id || ""}>{supply.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2" style={{ width: 120 }}>
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleChangeQuantity(idx, e.target.value)}
                    />
                  </Form.Group>
                  {formAdd.medicalEventSupplys.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveSupply(idx)}
                      className="remove-btn-simple"
                      title="Xóa vật tư này"
                      style={{ height: 38, marginTop: 24 }}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <Button variant="outline-primary" onClick={handleAddSupply} className="add-supply-btn-simple">
                  <FaPlus /> Thêm vật tư
                </Button>
              </div>
            </div>
          </div>
          <div className="simple-modal-footer">
            <Button
              type="button"
              variant="secondary"
              className="btn-cancel-simple"
              onClick={() => {
                setModalAdd(false);
                resetFormAdd();
              }}
            >
              <FaTimes /> Hủy bỏ
            </Button>
            <Button type="button" variant="outline-secondary" className="btn-reset-simple" onClick={resetFormAdd}>
              <FaTrash /> Làm mới
            </Button>
            <Button type="submit" variant="primary" className="btn-save-simple">
              <FaCheckCircle /> Lưu sự kiện
            </Button>
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
