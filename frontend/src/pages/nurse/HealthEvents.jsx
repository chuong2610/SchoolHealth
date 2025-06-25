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

  const allEvents = applyFilters(events).filter(
    (event) =>
      event.eventType?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.studentName?.toLowerCase().includes(searchAll.toLowerCase()) ||
      event.nurseName?.toLowerCase().includes(searchAll.toLowerCase())
  );

  const recentEvents = applyFilters(events).filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate >= lastWeek &&
      (event.eventType?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(searchRecent.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(searchRecent.toLowerCase()))
    );
  });

  const todayEvents = applyFilters(events).filter((event) => {
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
  const totalEvents = events.length;
  const totalRecent = recentEvents.length;
  const totalToday = todayEvents.length;
  const totalEmergency = events.filter(
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

      // Check if studentNumber is provided and not empty
      const hasStudentNumber = formAdd.studentNumber.trim() !== "";

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

      // Only include studentNumber if provided (backend might require existing student)
      if (hasStudentNumber) {
        data.studentNumber = formAdd.studentNumber.trim();
      } else {
        // Try empty string for general events
        data.studentNumber = "";
      }

      const res = await postMedicalEvent(data);
      showNotification("Thêm sự kiện thành công!", "success");
      setModalAdd(false);
      resetFormAdd();

      // Refresh data
      const updatedEvents = await getMedicalEvents();
      setEvents(updatedEvents);
    } catch (error) {
      // More detailed error handling
      let errorMessage = "Lỗi khi thêm sự kiện!";

      if (error.response?.status === 500) {
        if (hasStudentNumber) {
          errorMessage = `❌ Lỗi: Mã học sinh "${formAdd.studentNumber.trim()}" không tồn tại trong hệ thống!`;
        } else {
          errorMessage =
            "❌ Lỗi: Không thể tạo sự kiện chung. Vui lòng thử với mã học sinh hợp lệ.";
        }
      } else if (error.response?.data?.message) {
        errorMessage = `❌ Lỗi: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `❌ Lỗi: ${error.message}`;
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
    setValidated(false);
  };

  const fetchMedicalSupply = async () => {
    try {
      const res = await getMedicalSupply();
      setMedicalSupplies(res || []);
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
      console.error("Error loading medical event detail:", error);
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
    <div
      className="medicine-action-buttons"
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <button
        className="btn-action view"
        onClick={() => loadMedicalEventDetailModal(event.id)}
        title="Xem chi tiết"
        style={{
          background: '#F06292',
          border: '1px solid #F06292',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(240, 98, 146, 0.25)',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#E91E63';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 3px 10px rgba(240, 98, 146, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#F06292';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 6px rgba(240, 98, 146, 0.25)';
        }}
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
              style={{
                backgroundColor: "#F06292",
                border: "1px solid #F06292",
                color: "white",
                width: "100px",
                height: "40px",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
              variant="outline-secondary"
              className="filter-btn"
              onClick={() => setShowFilterModal(true)}
            >
              <FaFilter /> Lọc
            </Button>
            <Button
              style={{
                backgroundColor: "#F06292",
                border: "1px solid #F06292",
                color: "white",
                width: "100px",
                height: "40px",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
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

      <div
        className="table-responsive medicine-table-wrapper"
        style={{ overflowX: "auto", width: "100%", maxWidth: "100%" }}
      >
        <Table
          className="medicine-table"
          style={{
            width: "100%",
            tableLayout: "fixed",
            minWidth: "760px", // 150+120+120+120+100+150 = 760px
          }}
        >
          <thead>
            <tr>
              <th style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Loại sự kiện</th>
              <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Địa điểm</th>
              <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Ngày</th>
              <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Học sinh</th>
              <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Y tá</th>
              <th style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(showAll ? data : data.slice(0, ROW_LIMIT)).map((event, index) => (
              <tr key={event.id || `event-${index}`} className="table-row">
                <td style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                  <div className="medicine-id" style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <FaHeartbeat className="medicine-icon pill-bounce" style={{ marginRight: '0.5rem' }} />
                    {event.eventType || "N/A"}
                  </div>
                </td>
                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                  <div className="location-info" style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <FaMapMarkerAlt className="me-1" />
                    {event.location || "N/A"}
                  </div>
                </td>
                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                  <div className="date-info" style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <FaCalendarAlt className="date-icon" />
                    {formatDateTime(event.date) || "N/A"}
                  </div>
                </td>
                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                  <div className="student-info" style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <FaUser className="me-1" />
                    <strong>{event.studentName || "N/A"}</strong>
                  </div>
                </td>
                <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                  <div className="parent-info" style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <FaUserNurse className="me-1" />
                    {event.nurseName || "N/A"}
                  </div>
                </td>
                <td style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                  {renderActionButtons(event)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center empty-state">
                  <div className="empty-content">
                    <FaCalendarAlt className="empty-icon" />
                    <p>Không có sự kiện nào</p>
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
            className="show-more-btn"
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
        setTotalPages(res.totalPages);
        setTotalItems(res.totalItems);

        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        showNotification("Lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalEvents();
  }, [currentPage, debouncedSearch]);

  //
  return (
    <div
      className="container-fluid nurse-theme medicine-management"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Updated CSS Styles with Pink Theme */}
      <style>
        {`
                    .medicine-management {
                        background: linear-gradient(135deg, #f8f9fc 0%, #fce4ec 100%) !important;
                        min-height: 100vh !important;
                        padding: 0 !important;
                    }
                    
                    .page-header {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
                        color: white !important;
                        padding: 2rem 2rem 3rem 2rem !important;
                        margin: 0rem -1.5rem 2rem -1.5rem !important;
                        border-radius: 0 0 20px 20px !important;
                        position: relative !important;
                        overflow: hidden !important;
                    }
                    
                    .stats-card {
                        background: white !important;
                        border-radius: 16px !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                        border: none !important;
                        overflow: hidden !important;
                        transition: all 0.3s ease !important;
                        position: relative !important;
                    }
                    
                    .stats-card:hover {
                        transform: translateY(-4px) !important;
                        box-shadow: 0 16px 48px rgba(240, 98, 146, 0.15) !important;
                    }
                    
                    /* Enhanced Table Styling */
                    .medicine-table {
                        margin: 0 !important;
                        border: none !important;
                        background: white !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .medicine-table thead th {
                        background: rgba(248, 187, 217, 0.15) !important;
                        color: #1a1a1a !important;
                        font-weight: 600 !important;
                        font-size: 0.85rem !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.5px !important;
                        padding: 1.25rem 1rem !important;
                        border: none !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 10 !important;
                        box-shadow: 0 2px 4px rgba(240, 98, 146, 0.2) !important;
                    }
                    
                    .medicine-table tbody td {
                        padding: 1.2rem 1rem !important;
                        border-bottom: 1px solid #fce4ec !important;
                        vertical-align: middle !important;
                        border-left: none !important;
                        border-right: none !important;
                        background: white !important;
                        transition: all 0.3s ease !important;
                        position: relative !important;
                    }
                    
                    .medicine-table .table-row:nth-child(even) {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 5%) !important;
                    }
                    
                    .medicine-table .table-row:hover {
                        background: linear-gradient(135deg, #f8bbd9 0%, #f06292 10%) !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(240, 98, 146, 0.15) !important;
                        border-radius: 8px !important;
                    }
                    
                    .medicine-table .table-row:hover td {
                        color: #4a1a2a !important;
                        font-weight: 500 !important;
                    }
                    
                    /* Enhanced Table Container */
                    .medicine-table-wrapper {
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                        border: 2px solid #fce4ec !important;
                    }
                    
                    .medicine-table-container {
                        background: white !important;
                        border-radius: 16px !important;
                        padding: 1.5rem !important;
                        margin-bottom: 2rem !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    /* Enhanced Medicine Tabs */
                    .medicine-tabs {
                        background: white !important;
                        border-radius: 16px !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                        overflow: hidden !important;
                        border: none !important;
                    }
                    
                    .medicine-tabs .nav-tabs {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
                        border-bottom: none !important;
                        padding: 1rem 1.5rem 0 1.5rem !important;
                    }
                    
                    /* Enhanced Action Buttons */
                    .btn-action {
                        width: 32px !important;
                        height: 32px !important;
                        padding: 6px !important;
                        margin: 0 2px !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        border-radius: 8px !important;
                        border: 1px solid !important;
                        transition: all 0.3s ease !important;
                        font-size: 14px !important;
                        position: relative !important;
                    }
                    
                    .btn-action.view {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        border: 1px solid #F06292 !important;
                        color: white !important;
                        box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3) !important;
                    }
                    
                    .btn-action.view:hover {
                        background: linear-gradient(135deg, #E91E63, #C2185B) !important;
                        transform: scale(1.1) !important;
                        box-shadow: 0 4px 15px rgba(240, 98, 146, 0.4) !important;
                    }
                    
                    .btn-action svg {
                        font-size: 16px !important;
                        width: 16px !important;
                        height: 16px !important;
                    }
                    
                    /* Enhanced Stats Cards */
                    .stats-card.pending .stats-icon {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.active .stats-icon {
                        background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%) !important;
                        color: #E91E63 !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.today .stats-icon {
                        background: linear-gradient(135deg, #FF4081 0%, #F06292 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.completed .stats-icon {
                        background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    /* Enhanced Tab Navigation */
                    .nurse-theme .nav-tabs .nav-link {
                        border: none !important;
                        border-radius: 12px 12px 0 0 !important;
                        margin-right: 0.5rem !important;
                        padding: 1rem 1.5rem !important;
                        font-weight: 600 !important;
                        color: #666 !important;
                        background: transparent !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .nurse-theme .nav-tabs .nav-link.active {
                        background: white !important;
                        color: #E91E63 !important;
                        border-bottom: 3px solid #F06292 !important;
                        box-shadow: 0 -4px 16px rgba(240, 98, 146, 0.1) !important;
                        border-radius: 12px 12px 0 0 !important;
                    }
                    
                    .nurse-theme .nav-tabs .nav-link:hover {
                        color: #F06292 !important;
                        background: rgba(248, 187, 217, 0.3) !important;
                        border-radius: 12px 12px 0 0 !important;
                    }
                    
                    .nurse-theme .tab-content {
                        padding: 2rem !important;
                        background: white !important;
                    }
                    
                    .nurse-theme .card {
                        border: none !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .nurse-theme .btn {
                        border-radius: 8px !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    /* Enhanced Form Controls */
                    .nurse-theme .form-control {
                        border: 2px solid #fce4ec !important;
                        border-radius: 10px !important;
                        background: #ffffff !important;
                        transition: all 0.3s ease !important;
                        padding: 0.75rem 1rem !important;
                    }
                    
                    .nurse-theme .form-control:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                        background: #fefefe !important;
                    }
                    
                    .nurse-theme .form-select {
                        border: 2px solid #fce4ec !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1rem !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .nurse-theme .form-select:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                    }
                    
                    /* Enhanced Search and Filter */
                    .search-input {
                        border: 2px solid #fce4ec !important;
                        border-radius: 25px !important;
                        padding: 0.75rem 1rem 0.75rem 3rem !important;
                        background: white !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .search-input:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                        background: #fefefe !important;
                    }
                    
                    .search-box {
                        position: relative !important;
                        flex: 1 !important;
                    }
                    
                    .search-icon {
                        position: absolute !important;
                        left: 1rem !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        color: #F06292 !important;
                        z-index: 5 !important;
                    }
                    
                    .filter-btn {
                        border: 2px solid #F06292 !important;
                        color: #F06292 !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1.5rem !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .filter-btn:hover {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        color: white !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 15px rgba(240, 98, 146, 0.3) !important;
                    }
                    
                    .export-btn {
                        border: 2px solid #4CAF50 !important;
                        color: #4CAF50 !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1.5rem !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .export-btn:hover {
                        background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
                        color: white !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3) !important;
                    }
                    
                    /* Enhanced Modal Styling */
                    .medicine-detail-modal .modal-content {
                        border: none !important;
                        border-radius: 20px !important;
                        box-shadow: 0 25px 80px rgba(240, 98, 146, 0.2) !important;
                        overflow: hidden !important;
                    }
                    
                    .modal-header-custom {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
                        color: white !important;
                        padding: 1.5rem 2rem !important;
                        border-bottom: none !important;
                    }
                    
                    .modal-body-custom {
                        background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
                        padding: 2rem !important;
                    }
                    
                    .modal-footer-custom {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
                        border-top: none !important;
                        padding: 1.5rem 2rem !important;
                    }
                    
                    .detail-content {
                        background: white !important;
                        border-radius: 12px !important;
                        padding: 1.5rem !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .detail-section {
                        margin-bottom: 1.5rem !important;
                        padding: 1rem !important;
                        background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
                        border-radius: 10px !important;
                        border: 1px solid #f8bbd9 !important;
                    }
                    
                    .detail-section h6 {
                        color: #F06292 !important;
                        font-weight: 700 !important;
                        margin-bottom: 1rem !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 0.5rem !important;
                    }
                    
                    .detail-row {
                        display: flex !important;
                        justify-content: space-between !important;
                        padding: 0.5rem 0 !important;
                        border-bottom: 1px solid #fce4ec !important;
                    }
                    
                    .detail-row .label {
                        font-weight: 600 !important;
                        color: #E91E63 !important;
                        min-width: 120px !important;
                    }
                    
                    .detail-row .value {
                        color: #4a1a2a !important;
                        font-weight: 500 !important;
                    }
                    
                    /* Enhanced Icons and Badges */
                    .medicine-id .medicine-icon {
                        color: #F06292 !important;
                        animation: pulse 2s infinite !important;
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    
                    .date-icon {
                        color: #F06292 !important;
                    }
                    
                    .tab-badge {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        padding: 0.25rem 0.75rem !important;
                        font-weight: 600 !important;
                    }
                    
                    .show-more-btn {
                        color: #F06292 !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        padding: 0.5rem 1rem !important;
                        border-radius: 8px !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .show-more-btn:hover {
                        color: white !important;
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        text-decoration: none !important;
                        transform: translateY(-2px) !important;
                    }
                    
                    .loading-icon {
                        color: #F06292 !important;
                        font-size: 2rem !important;
                    }
                    
                    .empty-icon {
                        color: #F8BBD9 !important;
                        font-size: 3rem !important;
                    }
                    
                    .empty-content {
                        text-align: center !important;
                        padding: 2rem !important;
                        color: #999 !important;
                    }
                    
                    /* Force responsive design */
                    .nurse-theme .container-fluid {
                        padding-left: 15px !important;
                        padding-right: 15px !important;
                    }
                    
                    @media (max-width: 768px) {
                        .nurse-theme .medicine-table thead th {
                            background: rgba(248, 187, 217, 0.15) !important;
                            color: #1a1a1a !important;
                            font-size: 0.75rem !important;
                            padding: 0.75rem 0.5rem !important;
                        }
                        
                        .nurse-theme .medicine-table tbody td {
                            padding: 0.75rem 0.5rem !important;
                            font-size: 0.85rem !important;
                        }
                        
                        .nurse-theme .btn-action {
                            width: 28px !important;
                            height: 28px !important;
                            font-size: 12px !important;
                        }
                        
                        .nurse-theme .btn-action svg {
                            font-size: 14px !important;
                        }
                    }
                `}
      </style>

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
      <div
        style={{
          backgroundColor: "#F06292",
          padding: "20px 0",
          borderRadius: "10px",
          marginBottom: "25px",
          height: "180px",
        }}
      >
        <div className="header-content">
          <div className="header-left">
            <div
              className="page-title"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "rgb(255, 255, 255)",
                lineHeight: "1.4",
                textAlign: "center",
              }}
            >
              <FaHeartbeat className="page-icon" />
              <h1>Quản lý Sự kiện Y tế</h1>
            </div>
            <p
              className="page-subtitle"
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "rgb(255, 255, 255)",
                lineHeight: "1.4",
                textAlign: "center",
              }}
            >
              Theo dõi và quản lý các sự kiện y tế trong trường
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        className="nurse-events-stats-row"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "32px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="nurse-events-stat-card"
          style={{
            minWidth: 180,
            flex: 1,
            maxWidth: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(240, 98, 146, 0.08)",
            padding: 24,
          }}
        >
          <div className="nurse-events-stat-icon">
            <img
              src={cendal}
              alt="Calendar"
              style={{ width: 55, height: 55 }}
            />
          </div>
          <div
            className="nurse-events-stat-label"
            style={{ fontWeight: 600, marginTop: 8 }}
          >
            Tổng sự kiện
          </div>
          <div
            className="nurse-events-stat-value"
            style={{ fontSize: 32, color: "#43a047", fontWeight: 700 }}
          >
            {totalItems}
          </div>
        </div>
        <div
          className="nurse-events-stat-card"
          style={{
            minWidth: 180,
            flex: 1,
            maxWidth: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(240, 98, 146, 0.08)",
            padding: 24,
          }}
        >
          <div className="nurse-events-stat-icon">
            <img src={nearly} alt="Nearly" style={{ width: 55, height: 55 }} />
          </div>
          <div
            className="nurse-events-stat-label"
            style={{ fontWeight: 600, marginTop: 8 }}
          >
            Gần đây (7 ngày)
          </div>
          <div
            className="nurse-events-stat-value"
            style={{ fontSize: 32, color: "#ffa000", fontWeight: 700 }}
          >
            {totalRecent}
          </div>
        </div>
        <div
          className="nurse-events-stat-card"
          style={{
            minWidth: 180,
            flex: 1,
            maxWidth: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(240, 98, 146, 0.08)",
            padding: 24,
          }}
        >
          <div className="nurse-events-stat-icon">
            <img src={Today} alt="Today" style={{ width: 55, height: 55 }} />
          </div>
          <div
            className="nurse-events-stat-label"
            style={{ fontWeight: 600, marginTop: 8 }}
          >
            Hôm nay
          </div>
          <div
            className="nurse-events-stat-value"
            style={{ fontSize: 32, color: "#039be5", fontWeight: 700 }}
          >
            {totalToday}
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <div className="mb-4 text-end">
        <Button
          variant="success"
          size="lg"
          onClick={() => fetchMedicalSupply()}
          style={{
            background: "linear-gradient(135deg, #F06292, #E91E63)",
            border: "none",
            borderRadius: "25px",
            padding: "12px 30px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(240, 98, 146, 0.3)",
          }}
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
                        <option value="">Chọn loại sự kiện...</option>
                        <option value="health_check">Khám sức khỏe</option>
                        <option value="vaccination">Tiêm phòng</option>
                        <option value="emergency">Cấp cứu</option>
                        <option value="medication">Cho thuốc</option>
                        <option value="injury">Chấn thương</option>
                        <option value="other">Khác</option>
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

                  <div className="input-group full-width">
                    <Form.Group controlId="studentNumber">
                      <Form.Label>
                        <FaUser />
                        Mã học sinh liên quan
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="VD: HS001, ST2024001... (để trống cho sự kiện chung)"
                        value={formAdd.studentNumber}
                        onChange={(e) =>
                          setFormAdd({
                            ...formAdd,
                            studentNumber: e.target.value,
                          })
                        }
                        className="form-control-enhanced"
                      />
                      <div className="form-help">
                        <FaInfoCircle />
                        Chỉ nhập mã học sinh đã tồn tại trong hệ thống. Để trống
                        để tạo sự kiện chung.
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
                            <option value="">-- Chọn vật tư y tế --</option>
                            {medicalSupplies.map((supply) => (
                              <option key={supply.id} value={supply.id}>
                                {supply.name} (Tồn kho: {supply.quantity})
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
