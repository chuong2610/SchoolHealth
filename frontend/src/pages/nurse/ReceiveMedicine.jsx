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
        "Mã đơn",
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
            row.id,
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
    <div className="medicine-action-buttons">
      <button
        className="medicine-btn-action view"
        onClick={() => setModalDetail({ type, data: req })}
        title="Xem chi tiết"
        style={{
          background: "#F06292",
          border: "1px solid #F06292",
          color: "white",
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 6px rgba(240, 98, 146, 0.25)",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#E91E63";
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 3px 10px rgba(240, 98, 146, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#F06292";
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 6px rgba(240, 98, 146, 0.25)";
        }}
      >
        <FaEye />
      </button>
      {type === "pending" && (
        <>
          <button
            className="btn-action confirm"
            onClick={() => {
              handleConfirm(req, "pending", "");
            }}
            title="Xác nhận nhận thuốc"
            style={{
              background: "#81C784",
              border: "1px solid #81C784",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(129, 199, 132, 0.25)",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#66BB6A";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 3px 10px rgba(129, 199, 132, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#81C784";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 2px 6px rgba(129, 199, 132, 0.25)";
            }}
          >
            <FaCheckCircle />
          </button>
          <button
            className="medicine-btn-action reject"
            onClick={() => handleReject(req)}
            title="Từ chối"
            style={{
              background: "#E57373",
              border: "1px solid #E57373",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(229, 115, 115, 0.25)",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#EF5350";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 3px 10px rgba(229, 115, 115, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#E57373";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 2px 6px rgba(229, 115, 115, 0.25)";
            }}
          >
            <FaTimesCircle />
          </button>
        </>
      )}
      {type === "active" && (
        <button
          className="medicine-btn-action complete"
          onClick={() => handleConfirm(req, "active", "")}
          title="Hoàn thành sử dụng thuốc"
          style={{
            background: "#81C784",
            border: "1px solid #81C784",
            color: "white",
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(129, 199, 132, 0.25)",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#66BB6A";
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 3px 10px rgba(129, 199, 132, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#81C784";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 6px rgba(129, 199, 132, 0.25)";
          }}
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
    <div className="medicine-table-container">
      <div className="table-header">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo mã đơn, học sinh, thuốc..."
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <Button
              style={{
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
            {/* <Button
              style={{
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
                  type === "pending"
                    ? "don-thuoc-cho-xac-nhan"
                    : type === "active"
                    ? "don-thuoc-dang-su-dung"
                    : "don-thuoc-hoan-thanh";
                exportToExcel(data, filename);
              }}
            >
              <FaDownload /> Xuất Excel
            </Button> */}
          </div>
        </div>
      </div>

      <div className="medicine-table-responsive">
        <Table className="medicine-table">
          <thead>
            <tr>
              <th
                style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
              >
                Mã đơn
              </th>
              {/* <th style={{ width: "80px", minWidth: "80px", maxWidth: "80px" }}>
                Lớp
              </th> */}
              <th
                style={{ width: "120px", minWidth: "120px", maxWidth: "120px" }}
              >
                Học sinh
              </th>
              {/* {type === "pending" && <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Phụ huynh</th>} */}
              <th
                style={{
                  width: type === "pending" ? "150px" : "180px",
                  minWidth: type === "pending" ? "150px" : "180px",
                  maxWidth: type === "pending" ? "150px" : "180px",
                }}
              >
                Loại thuốc
              </th>
              <th
                style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
              >
                Liều lượng
              </th>
              <th
                style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
              >
                Ngày
              </th>
              <th
                style={{ width: "150px", minWidth: "150px", maxWidth: "150px" }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((req, index) => (
              <tr
                key={req.id || `req-${index}`}
                className="table-row"
                style={{}}
              >
                <td
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                >
                  <div
                    className="medicine-id"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#111827",
                      lineHeight: "1.4",
                    }}
                  >
                    #{req.id || "N/A"}
                  </div>
                </td>
                {/* <td
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    maxWidth: "80px",
                    fontSize: "1.9rem",
                    fontWeight: "700",
                    color: "#111827",
                    lineHeight: "4.4",
                  }}
                >
                  <Badge bg="" className="class-badge">
                  {req.studentName || "N/A"}
                  </Badge> 
                </td> */}
                <td
                  style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#111827",
                    lineHeight: "1.4",
                  }}
                >
                  <div className="student-info">{req.student || "N/A"}</div>
                </td>
                {/* {type === "pending" && (
                  <td style={{
                    width: '120px', minWidth: '120px', maxWidth: '120px', fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4',
                  }}>
                    <div className="parent-info">
                      {req.parent || 'N/A'}
                    </div>
                  </td>
                )} */}
                <td
                  style={{
                    width: type === "pending" ? "150px" : "180px",
                    minWidth: type === "pending" ? "150px" : "180px",
                    maxWidth: type === "pending" ? "150px" : "180px",
                  }}
                >
                  <div className="medicine-info">
                    <strong>{req.medicine || "N/A"}</strong>
                  </div>
                </td>
                <td>
                  <Badge bg="info" className="dosage-badge">
                    {req.dosage || "N/A"}
                  </Badge>
                </td>
                <td
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#111827",
                    lineHeight: "1.4",
                  }}
                >
                  <div className="date-info">
                    <FaCalendarAlt className="date-icon" />
                    {req.date || "N/A"}
                  </div>
                </td>
                <td>
                  {renderActionButtons(req, type)}
                </td>
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

      {/* Page Header */}
      <div
        className="page-header"
        style={{
          backgroundColor: "#F06292",
          padding: "20px 0",
          borderRadius: "10px",
          marginBottom: "20px",
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
              <FaStethoscope className="page-icon" />
              <h1>Quản lý Thuốc Y tế</h1>
            </div>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "rgb(255, 255, 255)",
                lineHeight: "1.4",
                textAlign: "center",
              }}
            >
              Theo dõi và xử lý các đơn thuốc từ phụ huynh
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="nurse-medicine-stats">
        <div className="nurse-medicine-stat-card">
          <div className="nurse-medicine-stat-icon">
            <img
              src={waiting}
              alt="Waiting"
              className="tab-icon"
              style={{ width: "55px", height: "55px" }}
            />
          </div>
          <div className="nurse-medicine-stat-label">Yêu cầu chờ duyệt</div>
          <div className="nurse-medicine-stat-value">
            {ReceiveMedicineStatistics.totalPending}
          </div>
        </div>

        <div className="nurse-medicine-stat-card">
          <div className="nurse-medicine-stat-icon">
            <img
              src={using}
              alt="Using"
              className="tab-icon"
              style={{ width: "55px", height: "55px" }}
            />
          </div>
          <div className="nurse-medicine-stat-label">Đang sử dụng thuốc</div>
          <div className="nurse-medicine-stat-value">
            {ReceiveMedicineStatistics.totalActive}
          </div>
        </div>

        <div className="nurse-medicine-stat-card">
          <div className="nurse-medicine-stat-icon">
            <img
              src={done}
              alt="Done"
              className="tab-icon"
              style={{ width: "55px", height: "55px" }}
            />
          </div>
          <div className="nurse-medicine-stat-label">Đã hoàn thành</div>
          <div className="nurse-medicine-stat-value">
            {ReceiveMedicineStatistics.totalCompleted}
          </div>
        </div>

        <div className="nurse-medicine-stat-card">
          <div className="nurse-medicine-stat-icon">
            <img
              src={CalendarClockIcon}
              alt="Calendar Clock"
              style={{ width: "55px", height: "55px" }}
            />
          </div>
          <div className="nurse-medicine-stat-label">Yêu cầu hôm nay</div>
          <div className="nurse-medicine-stat-value">
            {ReceiveMedicineStatistics.totalToday}
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
              className="nurse-medicine-tabs nurse-theme"
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
                  <div className="tab-content-header">
                    <div className="content-icon pending">
                      <FaExclamationTriangle />
                    </div>
                    <div className="content-info">
                      <h3>Đơn thuốc chờ xác nhận</h3>
                      <p>Danh sách các đơn thuốc từ phụ huynh cần được y tá xác nhận nhận thuốc</p>
                    </div>
                  </div>
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
                  <div className="tab-content-header">
                    <div className="content-icon active">
                      <FaClock />
                    </div>
                    <div className="content-info">
                      <h3>Thuốc đang sử dụng</h3>
                      <p>Danh sách học sinh hiện đang sử dụng thuốc theo đơn đã được xác nhận</p>
                    </div>
                  </div>
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
                  <div className="tab-content-header">
                    <div className="content-icon completed">
                      <FaCheckCircle />
                    </div>
                    <div className="content-info">
                      <h3>Đã hoàn thành sử dụng</h3>
                      <p>Danh sách học sinh đã hoàn thành việc sử dụng thuốc theo đơn</p>
                    </div>
                  </div>
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
        size="xl"
        className="enhanced-prescription-modal"
        centered
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission based on action type
            if (modalDetail?.type === "pending") {
              handleConfirm(modalDetail.data, "pending", nurseNote);
            } else if (modalDetail?.type === "active") {
              handleConfirm(modalDetail.data, "active", nurseNote);
            }
            setModalDetail(null);
            setNurseNote("");
          }}
        >
          <div className="enhanced-modal-header">
            <div className="header-content">
              <div className="modal-icon">
                <FaPills />
              </div>
              <div className="header-text">
                <h2>Chi tiết Đơn Thuốc</h2>
                <p>Xem và xử lý thông tin đơn thuốc từ phụ huynh</p>
              </div>
            </div>
            {detailData && (
              <div className="status-indicator">
                <div
                  className={`status-badge-enhanced ${
                    detailData.status === "Pending"
                      ? "pending"
                      : detailData.status === "Active"
                      ? "active"
                      : "completed"
                  }`}
                >
                  {detailData.status === "Pending"
                    ? "⏳ Chờ xác nhận"
                    : detailData.status === "Active"
                    ? "🔄 Đang sử dụng"
                    : "✅ Đã hoàn thành"}
                </div>
              </div>
            )}
          </div>

          <div className="enhanced-modal-body">
            {detailLoading && (
              <div className="loading-state">
                <FaSpinner className="fa-spin loading-spinner" />
                <h4>Đang tải chi tiết đơn thuốc...</h4>
                <p>Vui lòng chờ trong giây lát</p>
              </div>
            )}

            {!detailLoading && !detailData && (
              <div className="error-state">
                <FaExclamationTriangle className="error-icon" />
                <h4>Không tìm thấy chi tiết đơn thuốc</h4>
                <p>Dữ liệu có thể đã bị xóa hoặc không tồn tại</p>
              </div>
            )}

            {!detailLoading && detailData && (
              <div className="form-content">
                {/* Section 1: Prescription Info */}
                <fieldset className="form-section">
                  <legend>
                    <FaClipboardList />
                    Thông tin đơn thuốc
                  </legend>
                  <div className="info-card">
                    <div className="info-item">
                      <label>
                        <FaHashtag />
                        Mã đơn thuốc
                      </label>
                      <div className="info-value prescription-id">
                        #{detailData.id}
                      </div>
                    </div>
                    <div className="info-item">
                      <label>
                        <FaCalendarAlt />
                        Ngày tạo đơn
                      </label>
                      <div className="info-value">
                        {new Date(detailData.createdDate).toLocaleDateString(
                          "vi-VN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="info-item">
                      <label>
                        <FaClock />
                        Số ngày sử dụng
                      </label>
                      <div className="info-value">
                        {detailData.days || "Không xác định"} ngày
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Section 2: Student Info */}
                <fieldset className="form-section">
                  <legend>
                    <FaUserGraduate />
                    Thông tin học sinh
                  </legend>
                  <div className="info-card">
                    <div className="info-item">
                      <label>
                        <FaUser />
                        Họ và tên
                      </label>
                      <div className="info-value">{detailData.studentName}</div>
                    </div>
                    <div className="info-item">
                      <label>
                        <FaGraduationCap />
                        Lớp học
                      </label>
                      <div className="info-value">
                        {detailData.studentClass}
                      </div>
                    </div>
                    <div className="info-item">
                      <label>
                        <FaUserFriends />
                        Phụ huynh
                      </label>
                      <div className="info-value">{detailData.parentName}</div>
                    </div>
                  </div>
                </fieldset>

                {/* Section 3: Medication Info */}
                <fieldset className="form-section">
                  <legend>
                    <FaCapsules />
                    Thông tin thuốc
                  </legend>
                  <div className="medications-list">
                    {detailData.medications &&
                    detailData.medications.length > 0 ? (
                      detailData.medications.map((medication, index) => (
                        <div key={index} className="medication-item">
                          <div className="medication-header">
                            <div className="med-icon">
                              <FaPills />
                            </div>
                            <div className="med-details">
                              <h4>{medication.medicationName}</h4>
                              <div className="dosage-info">
                                <span className="dosage-label">
                                  Liều lượng:
                                </span>
                                <span className="dosage-value">
                                  {medication.dosage}
                                </span>
                              </div>
                            </div>
                          </div>
                          {medication.note && (
                            <div className="medication-note">
                              <FaStickyNote />
                              <div>
                                <strong>Ghi chú từ phụ huynh:</strong>
                                <p>"{medication.note}"</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-medication">
                        <FaExclamationTriangle />
                        <p>Không có thông tin thuốc</p>
                      </div>
                    )}
                  </div>
                </fieldset>

                {/* Section 4: Nurse Actions/Notes */}
                {modalDetail?.type === "pending" && (
                  <fieldset className="form-section">
                    <legend>
                      <FaUserNurse />
                      Ghi chú của y tá
                    </legend>
                    <div className="nurse-section">
                      <Form.Group controlId="nurseNote">
                        <Form.Label>
                          <FaStickyNote />
                          Ghi chú thêm (không bắt buộc)
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Nhập ghi chú về việc xác nhận đơn thuốc..."
                          value={nurseNote}
                          onChange={(e) => setNurseNote(e.target.value)}
                          className="form-control-enhanced"
                        />
                        <div className="form-help">
                          <FaStethoscope />
                          Ghi chú sẽ được lưu vào hồ sơ theo dõi thuốc của học
                          sinh
                        </div>
                      </Form.Group>
                    </div>
                  </fieldset>
                )}

                {/* Section 5: Action History */}
                {(detailData.receivedDate || detailData.completedDate) && (
                  <fieldset className="form-section">
                    <legend>
                      <FaHistory />
                      Lịch sử xử lý
                    </legend>
                    <div className="history-timeline">
                      <div className="timeline-item">
                        <div className="timeline-icon created">
                          <FaCalendarAlt />
                        </div>
                        <div className="timeline-content">
                          <h6>Tạo đơn thuốc</h6>
                          <p>
                            {new Date(detailData.createdDate).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      {detailData.receivedDate && (
                        <div className="timeline-item">
                          <div className="timeline-icon received">
                            <FaCheckCircle />
                          </div>
                          <div className="timeline-content">
                            <h6>Đã xác nhận nhận thuốc</h6>
                            <p>
                              {new Date(detailData.receivedDate).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {detailData.completedDate && (
                        <div className="timeline-item">
                          <div className="timeline-icon completed">
                            <FaCheckDouble />
                          </div>
                          <div className="timeline-content">
                            <h6>Đã hoàn thành sử dụng</h6>
                            <p>
                              {new Date(
                                detailData.completedDate
                              ).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      )}
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
                  setModalDetail(null);
                  setNurseNote("");
                }}
              >
                <FaTimes />
                Đóng
              </Button>

              <div className="action-buttons">
                {modalDetail?.type === "pending" && (
                  <>
                    <Button
                      type="button"
                      variant="danger"
                      className="btn-reject"
                      onClick={() => {
                        handleReject(modalDetail.data);
                        setModalDetail(null);
                        setNurseNote("");
                      }}
                    >
                      <FaTimesCircle />
                      Từ chối
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      className="btn-confirm"
                    >
                      <FaCheckCircle />
                      Xác nhận nhận thuốc
                    </Button>
                  </>
                )}
                {modalDetail?.type === "active" && (
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-complete"
                  >
                    <FaCheckDouble />
                    Hoàn thành sử dụng
                  </Button>
                )}
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
