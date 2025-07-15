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
  // Tabs,
  // Tab,
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
import ConfirmModal from "../../components/common/ConfirmModal"; // Thêm dòng này
// Import CSS cho ReceiveMedicine

import { getMedicineStatistics } from "../../api/nurse/ReceiveMedicineApi";
import styles from "./ReceiveMedicine.module.css";
// CSS được import tự động từ main.jsx
import { toast } from "react-toastify";

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
  const pageSize = 10;
  const [ReceiveMedicineStatistics, setReceiveMedicineStatistics] = useState({
    totalPending: 0,
    totalActive: 0,
    totalCompleted: 0,
    totalToday: 0,
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // "pending" hoặc "active"
    req: null,
    note: "",
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
            status: "pending", // Add status for pending
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
            status: "active", // Add status for active
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
            status: "completed", // Add status for completed
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
      toast.success("Xác nhận thành công")
      fetchMedicineStatistics();
    } catch (error) {
      showNotification(error.message || "Có lỗi xảy ra khi xác nhận!", "error");
    }
  };

  // Từ chối đơn thuốc
  const handleReject = async (req) => {
    try {
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

  // Add local search input state for each tab
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null);

  // Keep searchInput in sync with search when tab changes
  useEffect(() => {
    setSearchInput(search);
  }, [activeTab]);

  // Render Action Buttons
  const renderActionButtons = (req, type) => (
    <div>
      <button
        className={styles.actionBtn}
        type="button"
        onClick={() => setModalDetail({ type, data: req })}
        title="Xem chi tiết"
      >
        <FaEye />
      </button>
      {type === "pending" && (
        <button
          className={styles.actionBtn}
          type="button"
          onClick={() =>
            setConfirmModal({ show: true, action: "pending", req })
          }
          title="Xác nhận nhận thuốc"
        >
          <FaCheckCircle />
        </button>
      )}
      {type === "active" && (
        <button
          className={styles.actionBtn}
          type="button"
          onClick={() => setConfirmModal({ show: true, action: "active", req })}
          title="Hoàn thành sử dụng thuốc"
        >
          <FaCheckCircle />
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
    <div className={styles.tableContainer}>
      {/* Search and Filter Section */}
      <div className={styles.searchAndFilter}>
        <div className={styles.searchInput}>
          <input
            type="text"
            ref={searchInputRef}
            placeholder="Tìm kiếm theo mã đơn, học sinh, thuốc..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
              }
            }}
          />
          <button
            className={styles.searchBtn}
            type="button"
            onClick={() => setSearch(searchInput)}
            tabIndex={-1}
          >
            Tìm kiếm
          </button>
        </div>
        <div className={styles.actionButtons}>
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Loại thuốc</th>
              <th>Liều lượng</th>
              <th>Ngày</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((req, index) => (
              <tr key={req.id || `req-${index}`} className={styles.tableRow}>
                <td>{req.student || "Không có"}</td>
                <td>
                  <strong>{req.medicine || "Không có"}</strong>
                </td>
                <td>{req.dosage || "Không có"}</td>
                <td>{req.date || "Không có"}</td>
                <td>{renderActionButtons(req, type)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.noDataRow}>
                  <div className={styles.noDataContent}>
                    <FaCapsules />
                    <h5>Không có đơn thuốc nào</h5>
                    <p>
                      {type === "pending"
                        ? "Hiện tại không có đơn thuốc nào chờ xác nhận"
                        : type === "active"
                        ? "Không có học sinh nào đang sử dụng thuốc"
                        : "Chưa có đơn thuốc nào được hoàn thành"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabList = [
    { key: "pending", icon: <FaExclamationTriangle />, label: "Chờ xác nhận" },
    { key: "active", icon: <FaClock />, label: "Đang sử dụng" },
    { key: "completed", icon: <FaCheckCircle />, label: "Đã hoàn thành" },
  ];

  return (
    <div className={styles.receiveMedicineRoot}>
      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type === "error" ? "danger" : notification.type}
          dismissible
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Page Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>
            <FaStethoscope />
          </span>
          <div>
            <h2 className={styles.headerTitle}>Quản lý Thuốc Y tế</h2>
          </div>
        </div>
        <div>{/* Illustration */}</div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard + " " + styles.statCardPink}>
          <div>
            <img src={waiting} alt="Waiting" className={styles.statIcon} />
          </div>
          <div>
            <div className={styles.statLabel}>Yêu cầu chờ duyệt</div>
            <div className={styles.statValue}>
              {ReceiveMedicineStatistics.totalPending}
            </div>
          </div>
        </div>
        <div className={styles.statCard + " " + styles.statCardYellow}>
          <div>
            <img src={using} alt="Using" className={styles.statIcon} />
          </div>
          <div>
            <div className={styles.statLabel}>Đang sử dụng</div>
            <div className={styles.statValue}>
              {ReceiveMedicineStatistics.totalActive}
            </div>
          </div>
        </div>
        <div className={styles.statCard + " " + styles.statCardBlue}>
          <div>
            <img src={done} alt="Done" className={styles.statIcon} />
          </div>
          <div>
            <div className={styles.statLabel}>Đã hoàn thành</div>
            <div className={styles.statValue}>
              {ReceiveMedicineStatistics.totalCompleted}
            </div>
          </div>
        </div>
        <div className={styles.statCard + " " + styles.statCardOrange}>
          <div>
            <img
              src={CalendarClockIcon}
              alt="Calendar Clock"
              className={styles.statIcon}
            />
          </div>
          <div>
            <div className={styles.statLabel}>Yêu cầu hôm nay</div>
            <div className={styles.statValue}>
              {ReceiveMedicineStatistics.totalToday}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className={styles.tabs}>
        <div className={styles.tabNav}>
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={
                activeTab === tab.key
                  ? `${styles.tabNavItem} ${styles.tabNavItemActive}`
                  : styles.tabNavItem
              }
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
                scrollPosition.current = window.scrollY;
              }}
            >
              {tab.icon} <span style={{ marginLeft: 6 }}>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          {loading ? (
            <div className={styles.loadingIndicator}>
              <FaSpinner />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeTab === "pending" &&
                renderTable(
                  pendingRequests,
                  "pending",
                  search,
                  setSearch,
                  pendingShowAll,
                  setPendingShowAll
                )}
              {activeTab === "active" &&
                renderTable(
                  activeRequests,
                  "active",
                  search,
                  setSearch,
                  activeShowAll,
                  setActiveShowAll
                )}
              {activeTab === "completed" &&
                renderTable(
                  completedRequests,
                  "completed",
                  search,
                  setSearch,
                  completedShowAll,
                  setCompletedShowAll
                )}
            </>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal Detail */}
      {modalDetail !== null && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            // Only close if click is directly on the overlay, not inside the modal
            if (e.target === e.currentTarget) {
              setModalDetail(null);
              setNurseNote("");
            }
          }}
        >
          <div className={styles.customModal}>
            <form
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
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderLeft}>
                  <span className={styles.modalHeaderIcon}>
                    <FaPills />
                  </span>
                  <span className={styles.modalHeaderTitle}>
                    Chi tiết Đơn Thuốc
                  </span>
                </div>
                {/* Đã bỏ closeBtn ở đây */}
              </div>
              <div className={styles.modalContent}>
                {detailLoading ? (
                  <div className={styles.loadingIndicator}>
                    <FaSpinner /> Đang tải...
                  </div>
                ) : !detailData ? (
                  <div className={styles.noDataIndicator}>
                    <FaExclamationTriangle /> Không tìm thấy chi tiết đơn thuốc
                  </div>
                ) : (
                  <>
                    {/* Section: Thông tin đơn thuốc */}
                    <div className={styles.modalSection}>
                      <div className={styles.modalSectionTitle}>
                        <FaClipboardList /> Thông tin đơn thuốc
                      </div>
                      <div className={styles.modalSectionRow}>
                        <span className={styles.modalSectionLabel}>
                          Ngày tạo:
                        </span>
                        <span className={styles.modalSectionValue}>
                          {new Date(detailData.createdDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className={styles.modalSectionRow}>
                        <span className={styles.modalSectionLabel}>
                          Số ngày sử dụng:
                        </span>
                        <span className={styles.modalSectionValue}>
                          {detailData.days || "Không xác định"} ngày
                        </span>
                      </div>
                    </div>
                    {/* Section: Thông tin học sinh */}
                    <div className={styles.modalSection}>
                      <div className={styles.modalSectionTitle}>
                        <FaUserGraduate /> Thông tin học sinh
                      </div>
                      <div className={styles.modalSectionRow}>
                        <span className={styles.modalSectionLabel}>
                          Lớp học:
                        </span>
                        <span className={styles.modalSectionValue}>
                          {detailData.studentClass}
                        </span>
                      </div>
                      <div className={styles.modalSectionRow}>
                        <span className={styles.modalSectionLabel}>
                          Phụ huynh:
                        </span>
                        <span className={styles.modalSectionValue}>
                          {detailData.parentName}
                        </span>
                      </div>
                    </div>
                    {/* Section: Thông tin thuốc */}
                    <div className={styles.modalSection}>
                      <div className={styles.modalSectionTitle}>
                        <FaCapsules /> Thông tin thuốc
                      </div>
                      <div className={styles.medicationList}>
                        {detailData.medications &&
                        detailData.medications.length > 0 ? (
                          detailData.medications.map((medication, index) => (
                            <div key={index} className={styles.medicationItem}>
                              <div>
                                <b>{medication.medicationName}</b>
                              </div>
                              <div>Liều lượng: {medication.dosage}</div>
                              {medication.note && (
                                <div>Ghi chú: "{medication.note}"</div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div>Không có thông tin thuốc</div>
                        )}
                      </div>
                    </div>
                    {/* Section: Ghi chú y tá */}
                    {modalDetail?.type === "pending" && (
                      <div className={styles.modalSection}>
                        <div className={styles.modalSectionTitle}>
                          <FaUserNurse /> Ghi chú của y tá
                        </div>
                        <label htmlFor="nurseNote">
                          <b>Ghi chú thêm (không bắt buộc)</b>
                        </label>
                        <textarea
                          id="nurseNote"
                          rows={3}
                          placeholder="Nhập ghi chú về việc xác nhận đơn thuốc..."
                          value={nurseNote}
                          onChange={(e) => setNurseNote(e.target.value)}
                          className={styles.textarea}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    setModalDetail(null);
                    setNurseNote("");
                  }}
                >
                  <FaTimes /> Đóng
                </button>
                {/* Bỏ nút từ chối */}
                {modalDetail?.type === "pending" && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() =>
                      setConfirmModal({
                        show: true,
                        action: "pending",
                        req: modalDetail.data,
                        note: nurseNote,
                      })
                    }
                  >
                    <FaCheckCircle /> Nhận thuốc
                  </button>
                )}
                {modalDetail?.type === "active" && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() =>
                      setConfirmModal({
                        show: true,
                        action: "active",
                        req: modalDetail.data,
                        note: nurseNote,
                      })
                    }
                  >
                    <FaCheckCircle /> Đã sử dụng
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFilter />
            Bộ lọc nâng cao
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className={styles.filterOptions}>
              <div className={styles.filterGroup}>
                <Form.Group>
                  <Form.Label>
                    <FaCalendarAlt />
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
              <div className={styles.filterGroup}>
                <Form.Group>
                  <Form.Label>
                    <FaCalendarAlt />
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

            <Form.Group>
              <Form.Label>
                <FaHospital />
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

            <Form.Group>
              <Form.Label>
                <FaCapsules />
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

            <div className={styles.currentFilters}>
              <h6>Điều kiện lọc hiện tại:</h6>
              <div className={styles.filterBadges}>
                {filterOptions.dateRange.start && (
                  <Badge bg="primary">
                    Từ: {filterOptions.dateRange.start}
                  </Badge>
                )}
                {filterOptions.dateRange.end && (
                  <Badge bg="primary">Đến: {filterOptions.dateRange.end}</Badge>
                )}
                {filterOptions.className && (
                  <Badge bg="info">Lớp: {filterOptions.className}</Badge>
                )}
                {filterOptions.medicineType && (
                  <Badge bg="success">
                    Thuốc: {filterOptions.medicineType}
                  </Badge>
                )}
                {!filterOptions.dateRange.start &&
                  !filterOptions.dateRange.end &&
                  !filterOptions.className &&
                  !filterOptions.medicineType && (
                    <span>Chưa có điều kiện lọc nào</span>
                  )}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={() =>
          setConfirmModal({ show: false, action: null, req: null, note: "" })
        }
        onConfirm={async () => {
          await handleConfirm(
            confirmModal.req,
            confirmModal.action,
            confirmModal.note || ""
          );
          setConfirmModal({ show: false, action: null, req: null, note: "" });
          setModalDetail(null); // Đóng modal chi tiết nếu muốn
          setNurseNote("");
        }}
        title={
          confirmModal.action === "pending"
            ? "Xác nhận nhận thuốc"
            : "Xác nhận hoàn thành sử dụng thuốc"
        }
        message={
          confirmModal.action === "pending"
            ? "Bạn có chắc chắn muốn xác nhận đã nhận thuốc cho học sinh này?"
            : "Bạn có chắc chắn muốn xác nhận đã hoàn thành việc cho học sinh uống thuốc?"
        }
        confirmText="Xác nhận"
        confirmVariant="success"
      />
    </div>
  );
};

export default ReceiveMedicine;
