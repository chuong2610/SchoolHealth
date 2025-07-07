import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import {
  Modal,
  Button,
  Form,
  Table,
  Badge,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import CalendarClockIcon from "../../assets/calendar-clock-time-svgrepo-com.svg";
import done from "../../assets/deal-done-partnership-agreement-svgrepo-com.svg";
import using from "../../assets/clock-watch-svgrepo-com.svg";
import waiting from "../../assets/wait-hourglass-svgrepo-com.svg";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaClock,
  FaCapsules,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartBar,
  FaCalendarAlt,
  FaUserMd,
  FaHospital,
  FaBell,
  FaExclamationTriangle,
  FaCheckDouble,
  FaSpinner,
  FaPills,
  FaStethoscope,
  FaClipboardList,
  FaHashtag,
  FaUser,
  FaGraduationCap,
  FaUserFriends,
  FaStickyNote,
  FaTimes,
  FaUserGraduate,
  FaUserNurse,
  FaHistory,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
// Import CSS cho ReceiveMedicine
import "../../styles/nurse/receive-medicine/index.css";
import { getMedicineStatistics } from "../../api/nurse/ReceiveMedicineApi";
// CSS được import tự động từ main.jsx

const ReceiveMedicine = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [searchPending, setSearchPending] = useState("");
  const [searchActive, setSearchActive] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [nurseNote, setNurseNote] = useState("");
  const [pendingShowAll, setPendingShowAll] = useState(false);
  const [activeShowAll, setActiveShowAll] = useState(false);
  const [completedShowAll, setCompletedShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const scrollPosition = useRef(0);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    dateRange: { start: "", end: "" },
    className: "",
    status: "",
    medicineType: "",
  });
  const [animateStats, setAnimateStats] = useState(false);
  const [visibleRows, setVisibleRows] = useState({
    pending: true,
    active: true,
    completed: true,
  });
  const ROW_LIMIT = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 5;
  const [ReceiveMedicineStatistics, setReceiveMedicineStatistics] = useState({
    totalPending: 0,
    totalActive: 0,
    totalCompleted: 0,
    totalToday: 0,
  });

  const fetchMedicineStatistics = async () => {
    if (!user?.id) return;

    try {
      const res = await getMedicineStatistics(user?.id);
      if (res) {
        setReceiveMedicineStatistics({
          totalPending: res.pendingMedication || 0,
          totalActive: res.activeMedication || 0,
          totalCompleted: res.completedMedication || 0,
          totalToday: res.medicationInToday || 0,
        });
      } else {
        setReceiveMedicineStatistics({
          totalPending: 0,
          totalActive: 0,
          totalCompleted: 0,
          totalToday: 0,
        });
      }
    } catch (error) {
      console.log(error);
      setReceiveMedicineStatistics({
        totalPending: 0,
        totalActive: 0,
        totalCompleted: 0,
        totalToday: 0,
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    // setLoading(true);
    // fetchActive(pageNumber);
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Fetch danh sách đơn thuốc chờ xác nhận
  const fetchPending = async () => {
    try {
      const res = await axiosInstance.get(
        `/Medication/pending?pageNumber=${currentPage}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
      );
      const data = res.data;
      setPendingRequests(
        (data.data.items || []).map((item) => {
          const med =
            item.medications && item.medications[0] ? item.medications[0] : {};
          return {
            id: item.id || item.medicationId || "",
            student: item.studentName || "",
            studentClassName: item.studentClassName || "",
            parent: item.parentName || "",
            medicine: med.medicationName || "",
            dosage: med.dosage || "",
            date: item.createdDate ? item.createdDate.split("T")[0] : "",
            note: med.note || "",
            days: item.days || "",
          };
        })
      );
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      showNotification("Failed to load pending medication requests!", "error");
    }
  };

  // Fetch danh sách đơn thuốc đang sử dụng
  const fetchActive = async () => {
    if (!nurseId) return;
    try {
      const res = await axiosInstance.get(
        `/Medication/nurse/${nurseId}/Active?pageNumber=${currentPage}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
      );
      const data = res.data;
      setActiveRequests(
        (data.data.items || []).map((item) => {
          const med =
            item.medications && item.medications[0] ? item.medications[0] : {};
          return {
            id: item.id || "",
            student: item.studentName || "",
            studentClassName: item.studentClassName || "",
            medicine: med.medicationName || "",
            dosage: med.dosage || "",
            date: item.createdDate ? item.createdDate.split("T")[0] : "",
            note: med.note || "",
          };
        })
      );
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      showNotification("Failed to load active medication requests!", "error");
    }
  };

  // Fetch danh sách đơn thuốc đã hoàn thiện
  const fetchCompleted = async () => {
    if (!nurseId) return;
    try {
      const res = await axiosInstance.get(
        `/Medication/nurse/${nurseId}/Completed?pageNumber=${currentPage}&pageSize=${pageSize}` +
        `${search ? `&search=${search}` : ""}`
      );
      const data = res.data;
      setCompletedRequests(
        (data.data.items || []).map((item) => {
          const med =
            item.medications && item.medications[0] ? item.medications[0] : {};
          return {
            id: item.id || "",
            student: item.studentName || "",
            studentClassName: item.studentClassName || "",
            medicine: med.medicationName || "",
            dosage: med.dosage || "",
            date: item.createdDate ? item.createdDate.split("T")[0] : "",
            note: med.note || "",
          };
        })
      );

      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      showNotification(
        "Failed to load completed medication requests!",
        "error"
      );
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // cập nhật sau 500ms nếu không gõ nữa
    }, 500);

    return () => {
      clearTimeout(handler); // clear timeout nếu user vẫn đang gõ
    };
  }, [search]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "pending") {
          await fetchPending();
        }
        if (activeTab === "active") {
          await fetchActive();
        }
        if (activeTab === "completed") {
          await fetchCompleted();
        }
      } catch (error) {
        showNotification("Có lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    fetchMedicineStatistics();
    window.scrollTo({ top: scrollPosition.current });
  }, [nurseId, activeTab, currentPage, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Export to Excel function
  const exportToExcel = (data, filename) => {
    try {
      // Create CSV content
      const headers = [

        "Lớp",
        "Học sinh",
        "Loại thuốc",
        "Liều lượng",
        "Ngày",
        "Trạng thái",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          [
            // row.id,
            row.studentClassName,
            row.student,
            row.parent || "N/A",
            row.medicine,
            row.dosage,
            row.date,
            activeTab === "pending"
              ? "Chờ xác nhận"
              : activeTab === "active"
                ? "Đang sử dụng"
                : "Đã hoàn thành",
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Đã xuất file Excel thành công!", "success");
    } catch (error) {
      showNotification("Có lỗi khi xuất file Excel!", "error");
    }
  };

  // Apply filters
  const applyFilters = (data) => {
    return data.filter((item) => {
      const matchesDate =
        !filterOptions.dateRange.start ||
        !filterOptions.dateRange.end ||
        (item.date >= filterOptions.dateRange.start &&
          item.date <= filterOptions.dateRange.end);
      const matchesClass =
        !filterOptions.className ||
        item.studentClassName
          .toLowerCase()
          .includes(filterOptions.className.toLowerCase());
      const matchesMedicine =
        !filterOptions.medicineType ||
        item.medicine
          .toLowerCase()
          .includes(filterOptions.medicineType.toLowerCase());

      return matchesDate && matchesClass && matchesMedicine;
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilterOptions({
      dateRange: { start: "", end: "" },
      className: "",
      status: "",
      medicineType: "",
    });
    setShowFilterModal(false);
    showNotification("Đã xóa bộ lọc!", "info");
  };

  // Xác nhận đơn thuốc
  const handleConfirm = async (req, type, note = "") => {
    if (!nurseId) return;
    let nextStatus = "";
    const now = new Date().toISOString();
    let body = {
      medicationId: req.id,
      nurseId: nurseId,
      status: nextStatus,
      nurseNote: note, // Thêm ghi chú của y tá
    };
    if (type === "pending") {
      nextStatus = "Active";
      body = { ...body, status: nextStatus, receivedDate: now };
    }
    if (type === "active") {
      nextStatus = "Completed";
      body = { ...body, status: nextStatus, completedDate: now };
    }
    try {
      const response = await axiosInstance.patch("/Medication", body);

      if (type === "pending") {
        await fetchPending();
      }
      if (type === "active") {
        await fetchActive();
      }
      if (type === "completed") {
        await fetchCompleted();
      }

      showNotification(
        type === "pending"
          ? "Đã xác nhận nhận thuốc thành công!"
          : "Đã hoàn thành việc cho học sinh uống thuốc!",
        "success"
      );
      fetchMedicineStatistics();
    } catch (error) {
      showNotification(error.message || "Có lỗi xảy ra khi xác nhận!", "error");
    }
  };

  // Từ chối đơn thuốc
  const handleReject = async (req) => {
    try {
      // TODO: Add API call to reject medication request
      // const response = await fetch(`http://localhost:5182/api/Medication/${req.id}/reject`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      // });

      // For now, just remove from local state
      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
      showNotification("Đã từ chối đơn thuốc!", "warning");
    } catch (error) {
      showNotification("Có lỗi khi từ chối đơn thuốc!", "error");
    }
  };

  // Lọc tìm kiếm và áp dụng filters
  const filteredPending = applyFilters(
    pendingRequests.filter(
      (r) =>
        r.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        (r.studentClassName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (r.student || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.parent || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.medicine || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.dosage || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.date || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredActive = applyFilters(
    activeRequests.filter(
      (r) =>
        r.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        (r.studentClassName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (r.student || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.medicine || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.dosage || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.date || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredCompleted = applyFilters(
    completedRequests.filter(
      (r) =>
        r.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        (r.studentClassName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (r.student || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.medicine || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.dosage || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.date || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  // Hàm lấy chi tiết đơn thuốc từ API
  const fetchMedicationDetail = async (id) => {
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await axiosInstance.get(`/Medication/${id}`);
      setDetailData(res.data.data);
    } catch (error) {
      setDetailData(null);
      showNotification("Failed to load medication details!", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  // Khi mở modal chi tiết, fetch chi tiết đơn thuốc
  useEffect(() => {
    if (modalDetail && modalDetail.data && modalDetail.data.id) {
      fetchMedicationDetail(modalDetail.data.id);
    }
  }, [modalDetail]);

  // Statistics
  const totalPending = pendingRequests.length;
  const totalActive = activeRequests.length;
  const totalCompleted = completedRequests.length;
  const totalToday = [
    ...pendingRequests,
    ...activeRequests,
    ...completedRequests,
  ].filter((req) => req.date === new Date().toISOString().split("T")[0]).length;

  // Render Action Buttons
  const renderActionButtons = (req, type) => (
    <div className="btn-group">
      <button
        className="action-btn view"
        onClick={() => setModalDetail({ type, data: req })}
        title="Xem chi tiết"
      >
        <FaEye />
      </button>
      {type === "pending" && (
        <>
          <button
            className="action-btn approve"
            onClick={() => {
              handleConfirm(req, "pending", "");
            }}
            title="Xác nhận nhận thuốc"
          >
            <FaCheckCircle />
          </button>
          <button
            className="action-btn reject"
            onClick={() => handleReject(req)}
            title="Từ chối"
          >
            <FaTimesCircle />
          </button>
        </>
      )}
      {type === "active" && (
        <button
          className="action-btn complete"
          onClick={() => handleConfirm(req, "active", "")}
          title="Hoàn thành sử dụng thuốc"
        >
          <FaCheckDouble />
        </button>
      )}
    </div>
  );

  // Render Table
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
            placeholder="Tìm kiếm theo mã đơn, học sinh, thuốc..."
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          {/* <button
            className="filter-btn"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter /> Lọc
          </button> */}
          {/* <button
            className="export-btn"
            onClick={() => {
              const filename =
                type === "pending"
                  ? "don-thuoc-cho-xac-nhan"
                  : type === "active"
                    ? "don-thuoc-dang-su-dung"
                    : "don-thuoc-hoan-thanh";
              exportToExcel(data, filename);
            }}
          >
            <FaDownload /> Xuất Excel
          </button> */}
        </div>
      </div>

      <div className="table-responsive">
        <Table className="table">
          <thead>
            <tr>
              {/* <th className="medicine-id-header">Mã đơn</th> */}
              <th className="student-info-header">Học sinh</th>
              <th className="medicine-info-header">Loại thuốc</th>
              <th className="dosage-header">Liều lượng</th>
              <th className="date-info-header">Ngày</th>
              <th className="action-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((req, index) => (
              <tr key={req.id || `req-${index}`} className="table-row">
                {/* <td className="medicine-id">#{req.id || "Không có"}</td> */}
                <td className="student-info">{req.student || "Không có"}</td>
                <td className="medicine-info"><strong>{req.medicine || "Không có"}</strong></td>
                <td><span className="dosage-badge">{req.dosage || "Không có"}</span></td>
                <td className="date-info">{req.date || "Không có"}</td>
                <td>{renderActionButtons(req, type)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center empty-state">
                  <div className="empty-content">
                    <FaCapsules className="empty-icon" />
                    <h5 className="empty-title">Không có đơn thuốc nào</h5>
                    <p className="empty-description">
                      {type === "pending"
                        ? "Hiện tại không có đơn thuốc nào chờ xác nhận"
                        : type === "active"
                          ? "Không có học sinh nào đang sử dụng thuốc"
                          : "Chưa có đơn thuốc nào được hoàn thành"
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
            className="medicine-show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : `Xem thêm ${data.length - ROW_LIMIT} đơn`}
          </Button>
        </div>
      )}
    </div>
  );

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

      {/* Page Header with Coral Theme - MATCH DASHBOARD STRUCTURE */}
      <div className="nurse-header-banner">
        <div className="nurse-header-content" style={{ padding: '36px 20px' }}>
          <div className="nurse-header-left">
            <div className="nurse-avatar">
              <span><FaStethoscope /></span>
            </div>
            <div className="nurse-header-text">
              <h2 style={{ color: '#fff', marginBottom: 0 }}>
                Quản lý Thuốc Y tế
              </h2>
            </div>
          </div>
          <div className="nurse-header-right">
            {/* You can use the same illustration as dashboard or a medicine SVG */}
          </div>
        </div>
      </div>

      {/* Statistics Cards - MATCH DASHBOARD STRUCTURE */}
      <div className="nurse-stats-section">
        <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
          <div className="col-xs-12 col-sm-6 col-lg-3 p-0">
            <div className="nurse-medicine-stat-card">
              <div className="nurse-stat-content">
                <div className="nurse-medicine-stat-icon" style={{ background: 'linear-gradient(135deg, #FFB300, #FFA000)' }}>
                  <img src={waiting} alt="Waiting" />
                </div>
                <div className="nurse-medicine-stat-info">
                  <div className="nurse-medicine-stat-label">Yêu cầu chờ duyệt</div>
                  <div className="nurse-medicine-stat-value">{ReceiveMedicineStatistics.totalPending}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-3">
            <div className="nurse-medicine-stat-card">
              <div className="nurse-stat-content">
                <div className="nurse-medicine-stat-icon" style={{ background: 'linear-gradient(135deg, #81C784, #66BB6A)' }}>
                  <img src={using} alt="Using" />
                </div>
                <div className="nurse-medicine-stat-info">
                  <div className="nurse-medicine-stat-label">Đang sử dụng thuốc</div>
                  <div className="nurse-medicine-stat-value">{ReceiveMedicineStatistics.totalActive}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-3">
            <div className="nurse-medicine-stat-card">
              <div className="nurse-stat-content">
                <div className="nurse-medicine-stat-icon" style={{ background: 'linear-gradient(135deg, #0088ff, #cdcdd8)' }}>
                  <img src={done} alt="Done" />
                </div>
                <div className="nurse-medicine-stat-info">
                  <div className="nurse-medicine-stat-label">Đã hoàn thành</div>
                  <div className="nurse-medicine-stat-value">{ReceiveMedicineStatistics.totalCompleted}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-3 p-0">
            <div className="nurse-medicine-stat-card">
              <div className="nurse-stat-content">
                <div className="nurse-medicine-stat-icon" style={{ background: 'linear-gradient(135deg, #FF8A65, #FF7043)' }}>
                  <img src={CalendarClockIcon} alt="Calendar Clock" />
                </div>
                <div className="nurse-medicine-stat-info">
                  <div className="nurse-medicine-stat-label">Yêu cầu hôm nay</div>
                  <div className="nurse-medicine-stat-value">{ReceiveMedicineStatistics.totalToday}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              onSelect={(key) => {
                setActiveTab(key);
                setCurrentPage(1);
                // Giữ nguyên vị trí scroll
                scrollPosition.current = window.scrollY;
              }}
              className="nurse-medicine-tabs"
            >
              <Tab
                eventKey="pending"
                title={
                  <div className="tab-title pending">
                    <FaExclamationTriangle className="tab-icon" />
                    <span>Chờ xác nhận</span>
                    {/* <Badge bg="warning" className="tab-badge">
                      {totalPending}
                    </Badge> */}
                  </div>
                }
              >
                <div className="tab-content">
                  {/* <div className="tab-content-header">
                    <div className="content-icon pending">
                      <FaExclamationTriangle />
                    </div>
                    <div className="content-info">
                      <h3>Đơn thuốc chờ xác nhận</h3>
                      <p>Danh sách các đơn thuốc từ phụ huynh cần được y tá xác nhận nhận thuốc</p>
                    </div>
                  </div> */}
                  {renderTable(
                    // filteredPending,
                    pendingRequests,
                    "pending",
                    search,
                    setSearch,
                    pendingShowAll,
                    setPendingShowAll
                  )}
                </div>
              </Tab>

              <Tab
                eventKey="active"
                title={
                  <div className="tab-title active">
                    <FaClock className="tab-icon" />
                    <span>Đang sử dụng</span>
                    {/* <Badge bg="info" className="tab-badge">
                      {totalActive}
                    </Badge> */}
                  </div>
                }
              >
                <div className="tab-content">
                  {/* <div className="tab-content-header">
                    <div className="content-icon active">
                      <FaClock />
                    </div>
                    <div className="content-info">
                      <h3>Thuốc đang sử dụng</h3>
                      <p>Danh sách học sinh hiện đang sử dụng thuốc theo đơn đã được xác nhận</p>
                    </div>
                  </div> */}
                  {renderTable(
                    // filteredActive,
                    activeRequests,
                    "active",
                    search,
                    setSearch,
                    activeShowAll,
                    setActiveShowAll
                  )}
                </div>
              </Tab>

              <Tab
                eventKey="completed"
                title={
                  <div className="tab-title completed">
                    <FaCheckCircle className="tab-icon" />
                    <span>Đã hoàn thành</span>
                    {/* <Badge bg="success" className="tab-badge">
                      {totalCompleted}
                    </Badge> */}
                  </div>
                }
              >
                <div className="tab-content">
                  {/* <div className="tab-content-header">
                    <div className="content-icon completed">
                      <FaCheckCircle />
                    </div>
                    <div className="content-info">
                      <h3>Đã hoàn thành sử dụng</h3>
                      <p>Danh sách học sinh đã hoàn thành việc sử dụng thuốc theo đơn</p>
                    </div>
                  </div> */}
                  {renderTable(
                    // filteredCompleted,
                    completedRequests,
                    "completed",
                    search,
                    setSearch,
                    completedShowAll,
                    setCompletedShowAll
                  )}
                </div>
              </Tab>
            </Tabs>
            {console.log("Currentpage", currentPage)}
            {console.log("Totalpages", totalPages)}

            {totalPages > 1 && (
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Enhanced Detail Modal - Single Form Design */}
      <Modal
        show={modalDetail !== null}
        onHide={() => {
          setModalDetail(null);
          setNurseNote("");
        }}
        size="md"
        className="simple-prescription-modal"
        centered
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (modalDetail?.type === "pending") {
              handleConfirm(modalDetail.data, "pending", nurseNote);
            } else if (modalDetail?.type === "active") {
              handleConfirm(modalDetail.data, "active", nurseNote);
            }
            setModalDetail(null);
            setNurseNote("");
          }}
        >
          <div className="simple-modal-header">
            <h2><FaPills style={{ marginRight: 8 }} />Chi tiết Đơn Thuốc</h2>
            {detailData && (
              <div className="status-badge-simple">
                {detailData.status === "Pending" ? "⏳ Chờ xác nhận" :
                  detailData.status === "Active" ? "🔄 Đang sử dụng" : "✅ Đã hoàn thành"}
              </div>
            )}
          </div>
          <div className="simple-modal-body">
            {detailLoading && (
              <div className="loading-simple">
                <FaSpinner className="fa-spin" /> Đang tải...
              </div>
            )}
            {!detailLoading && !detailData && (
              <div className="error-simple">
                <FaExclamationTriangle /> Không tìm thấy chi tiết đơn thuốc
              </div>
            )}
            {!detailLoading && detailData && (
              <>
                {/* Card 1: Thông tin đơn thuốc */}
                <div className="simple-card">
                  <div className="simple-card-title"><FaClipboardList style={{ marginRight: 6 }} />Thông tin đơn thuốc</div>
                  <div className="info-row">
                    {/* <span className="info-label">Mã đơn:</span> */}
                    {/* <span className="info-value">#{detailData.id}</span> */}
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ngày tạo:</span>
                    <span className="info-value">{new Date(detailData.createdDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Số ngày sử dụng:</span>
                    <span className="info-value">{detailData.days || "Không xác định"} ngày</span>
                  </div>
                </div>
                {/* Card 2: Thông tin học sinh */}
                <div className="simple-card">
                  <div className="simple-card-title"><FaUserGraduate style={{ marginRight: 6 }} />Thông tin học sinh</div>
                  <div className="info-row">
                    <span className="info-label">Họ và tên:</span>
                    <span className="info-value">{detailData.studentName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Lớp học:</span>
                    <span className="info-value">{detailData.studentClass}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phụ huynh:</span>
                    <span className="info-value">{detailData.parentName}</span>
                  </div>
                </div>
                {/* Card 3: Thông tin thuốc */}
                <div className="simple-card">
                  <div className="simple-card-title"><FaCapsules style={{ marginRight: 6 }} />Thông tin thuốc</div>
                  {detailData.medications && detailData.medications.length > 0 ? (
                    detailData.medications.map((medication, index) => (
                      <div key={index} className="medication-simple">
                        <div className="med-name">{medication.medicationName}</div>
                        <div className="med-dosage">Liều lượng: {medication.dosage}</div>
                        {medication.note && (
                          <div className="med-note">Ghi chú: "{medication.note}"</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-medication-simple">Không có thông tin thuốc</div>
                  )}
                </div>
                {/* Card 4: Ghi chú y tá (chỉ hiện khi pending) */}
                {modalDetail?.type === "pending" && (
                  <div className="simple-card">
                    <div className="simple-card-title"><FaUserNurse style={{ marginRight: 6 }} />Ghi chú của y tá</div>
                    <Form.Group controlId="nurseNote">
                      <Form.Label>Ghi chú thêm (không bắt buộc)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Nhập ghi chú về việc xác nhận đơn thuốc..."
                        value={nurseNote}
                        onChange={(e) => setNurseNote(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="simple-modal-footer">
            <Button
              type="button"
              variant="secondary"
              className="btn-close-simple"
              onClick={() => {
                setModalDetail(null);
                setNurseNote("");
              }}
            >
              <FaTimes /> Đóng
            </Button>
            {modalDetail?.type === "pending" && (
              <>
                <Button
                  type="button"
                  variant="danger"
                  className="btn-reject-simple"
                  onClick={() => {
                    handleReject(modalDetail.data);
                    setModalDetail(null);
                    setNurseNote("");
                  }}
                >
                  <FaTimesCircle /> Từ chối
                </Button>
                <Button type="submit" variant="success" className="btn-confirm-simple">
                  <FaCheckCircle /> Xác nhận nhận thuốc
                </Button>
              </>
            )}
            {modalDetail?.type === "active" && (
              <Button type="submit" variant="primary" className="btn-complete-simple">
                <FaCheckDouble /> Hoàn thành sử dụng
              </Button>
            )}
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
            <FaFilter style={{ color: "#F06292", fontSize: "1.5rem" }} />
            Bộ lọc nâng cao
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Từ ngày
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateRange.start}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Đến ngày
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateRange.end}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaHospital className="me-2" />
                Lớp học
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên lớp (vd: 6A1, 7B2...)"
                value={filterOptions.className}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaCapsules className="me-2" />
                Loại thuốc
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên thuốc"
                value={filterOptions.medicineType}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    medicineType: e.target.value,
                  }))
                }
              />
            </Form.Group>

            <div className="filter-summary">
              <h6>Điều kiện lọc hiện tại:</h6>
              <div className="filter-tags">
                {filterOptions.dateRange.start && (
                  <Badge bg="primary" className="me-2 mb-2">
                    Từ: {filterOptions.dateRange.start}
                  </Badge>
                )}
                {filterOptions.dateRange.end && (
                  <Badge bg="primary" className="me-2 mb-2">
                    Đến: {filterOptions.dateRange.end}
                  </Badge>
                )}
                {filterOptions.className && (
                  <Badge bg="info" className="me-2 mb-2">
                    Lớp: {filterOptions.className}
                  </Badge>
                )}
                {filterOptions.medicineType && (
                  <Badge bg="success" className="me-2 mb-2">
                    Thuốc: {filterOptions.medicineType}
                  </Badge>
                )}
                {!filterOptions.dateRange.start &&
                  !filterOptions.dateRange.end &&
                  !filterOptions.className &&
                  !filterOptions.medicineType && (
                    <span className="text-muted">
                      Chưa có điều kiện lọc nào
                    </span>
                  )}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="outline-secondary" onClick={clearFilters}>
            <FaTimesCircle /> Xóa lọc
          </Button>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowFilterModal(false);
              showNotification("Đã áp dụng bộ lọc!", "success");
            }}
          >
            <FaCheckCircle /> Áp dụng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceiveMedicine;
