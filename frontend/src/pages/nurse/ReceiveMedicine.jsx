import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Modal, Button, Form, Table, Badge, Alert, Tabs, Tab } from "react-bootstrap";
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
  FaUserGraduate
} from 'react-icons/fa';
// CSS được import tự động từ main.jsx

// Add pink modal header override styles
const pinkModalStyles = `
  .modal-header-custom,
  .nurse-theme .modal-header-custom,
  .nurse-theme .add-event-modal .modal-header-custom,
  .nurse-theme .add-event-modal.medicine-detail-modal .modal-header-custom,
  .nurse-theme .container-fluid .add-event-modal.medicine-detail-modal .modal-header-custom,
  .medicine-detail-modal .modal-header-custom {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
    border-bottom: none !important;
    padding: 1.5rem 2rem !important;
    border-radius: 16px 16px 0 0 !important;
  }
  
  .page-header {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
  }
  
  .filter-btn:hover {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    border-color: #F06292 !important;
    color: white !important;
  }
  
  .show-more-btn:hover {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    border-color: #F06292 !important;
    color: white !important;
  }
  
  .detail-section {
    border-left: 4px solid #F06292 !important;
  }
  
  .modal-loading .fa-spin,
  .loading-icon {
    color: #F06292 !important;
  }
  
  .search-input:focus {
    border-color: #F06292 !important;
    box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
  }
  
  .filter-modal .form-control:focus,
  .form-control-enhanced:focus {
    border-color: #F06292 !important;
    box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
  }
  
  .nurse-theme .add-event-modal.medicine-detail-modal .step.active .step-icon,
  .step.active .step-icon {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
  }
  
  .section-icon {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
  }
  
  .supply-number {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
  }
  
  .step.active span {
    color: #F06292 !important;
  }
  
  .btn-action:focus,
  .btn:focus {
    outline: 2px solid #F06292 !important;
    box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.2) !important;
  }
  
  .modal .modal-header,
  .modal-header,
  [class*="modal"] [class*="header"],
  [class*="prescription"] [class*="modal"] [class*="header"] {
    background: linear-gradient(135deg, #F06292, #E91E63) !important;
    color: white !important;
  }
`;

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
  const [pendingShowAll, setPendingShowAll] = useState(false);
  const [activeShowAll, setActiveShowAll] = useState(false);
  const [completedShowAll, setCompletedShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    dateRange: { start: "", end: "" },
    className: "",
    status: "",
    medicineType: ""
  });
  const [animateStats, setAnimateStats] = useState(true); // Keep stats animation
  const [visibleRows, setVisibleRows] = useState({
    pending: true,
    active: true,
    completed: true
  }); // Disable row animations
  const ROW_LIMIT = 5;
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const pageSize = 3; // Default page size for API requests

  // Fetch danh sách đơn thuốc chờ xác nhận
  const fetchPending = async () => {
    try {
      const res = await axiosInstance.get(`/Medication/pending?pageNumber=${currentPage}&pageSize=${pageSize}` + `${searchPending ? `&search=${searchPending}` : ""}`);
      const data = res.data;
      setPendingRequests((data.data || []).map((item) => {
        const med = item.medications && item.medications[0] ? item.medications[0] : {};
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
      }));
    } catch (error) {
      showNotification("Failed to load pending medication requests!", "error");
    }
  };

  // Fetch danh sách đơn thuốc đang sử dụng
  const fetchActive = async () => {
    if (!nurseId) return;
    try {
      const res = await axiosInstance.get(`/Medication/nurse/${nurseId}/Active`);
      const data = res.data;
      setActiveRequests((data.data || []).map((item) => {
        const med = item.medications && item.medications[0] ? item.medications[0] : {};
        return {
          id: item.id || "",
          student: item.studentName || "",
          studentClassName: item.studentClassName || "",
          medicine: med.medicationName || "",
          dosage: med.dosage || "",
          date: item.createdDate ? item.createdDate.split("T")[0] : "",
          note: med.note || "",
        };
      }));
    } catch (error) {
      showNotification("Failed to load active medication requests!", "error");
    }
  };

  // Fetch danh sách đơn thuốc đã hoàn thiện
  const fetchCompleted = async () => {
    if (!nurseId) return;
    try {
      const res = await axiosInstance.get(`/Medication/nurse/${nurseId}/Completed`);
      const data = res.data;
      setCompletedRequests((data.data || []).map((item) => {
        const med = item.medications && item.medications[0] ? item.medications[0] : {};
        return {
          id: item.id || "",
          student: item.studentName || "",
          studentClassName: item.studentClassName || "",
          medicine: med.medicationName || "",
          dosage: med.dosage || "",
          date: item.createdDate ? item.createdDate.split("T")[0] : "",
          note: med.note || "",
        };
      }));
    } catch (error) {
      showNotification("Failed to load completed medication requests!", "error");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPending(), fetchActive(), fetchCompleted()]);
      } catch (error) {
        showNotification("Có lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [nurseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Export to Excel function
  const exportToExcel = (data, filename) => {
    try {
      // Create CSV content
      const headers = ["Mã đơn", "Lớp", "Học sinh", "Phụ huynh", "Loại thuốc", "Liều lượng", "Ngày", "Trạng thái"];
      const csvContent = [
        headers.join(","),
        ...data.map(row => [
          row.id,
          row.studentClassName,
          row.student,
          row.parent || "N/A",
          row.medicine,
          row.dosage,
          row.date,
          activeTab === "pending" ? "Chờ xác nhận" : activeTab === "active" ? "Đang sử dụng" : "Đã hoàn thành"
        ].join(","))
      ].join("\n");

      // Create and download file
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
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
    return data.filter(item => {
      const matchesDate = !filterOptions.dateRange.start || !filterOptions.dateRange.end ||
        (item.date >= filterOptions.dateRange.start && item.date <= filterOptions.dateRange.end);
      const matchesClass = !filterOptions.className ||
        item.studentClassName.toLowerCase().includes(filterOptions.className.toLowerCase());
      const matchesMedicine = !filterOptions.medicineType ||
        item.medicine.toLowerCase().includes(filterOptions.medicineType.toLowerCase());

      return matchesDate && matchesClass && matchesMedicine;
    });
  };

  // Clear filters
  const clearFilters = () => {
    setFilterOptions({
      dateRange: { start: "", end: "" },
      className: "",
      status: "",
      medicineType: ""
    });
    setShowFilterModal(false);
    showNotification("Đã xóa bộ lọc!", "info");
  };

  // Xác nhận đơn thuốc
  const handleConfirm = async (req, type) => {
    if (!nurseId) return;
    let nextStatus = "";
    const now = new Date().toISOString();
    let body = {
      medicationId: req.id,
      nurseId: nurseId,
      status: nextStatus,
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

      await fetchPending();
      await fetchActive();
      await fetchCompleted();

      showNotification(
        type === "pending"
          ? "Successfully confirmed medication receipt!"
          : "Successfully completed medication administration!",
        "success"
      );
    } catch (error) {
      showNotification(error.message || "An error occurred during confirmation!", "error");
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
  const filteredPending = applyFilters(pendingRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.parent || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchPending.toLowerCase())
  ));

  const filteredActive = applyFilters(activeRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchActive.toLowerCase())
  ));

  const filteredCompleted = applyFilters(completedRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchCompleted.toLowerCase())
  ));

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
  const totalToday = [...pendingRequests, ...activeRequests, ...completedRequests]
    .filter(req => req.date === new Date().toISOString().split('T')[0]).length;

  // Render Action Buttons
  const renderActionButtons = (req, type) => (
    <div className="medicine-action-buttons" style={{
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      <button
        className="btn-action view"
        onClick={() => setModalDetail({ type, data: req })}
        title="Xem chi tiết"
        style={{
          background: 'linear-gradient(135deg, #F06292, #E91E63)',
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
          e.target.style.background = 'linear-gradient(135deg, #E91E63, #C2185B)';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 3px 10px rgba(240, 98, 146, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #F06292, #E91E63)';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 6px rgba(240, 98, 146, 0.25)';
        }}
      >
        <FaEye />
      </button>
      {type === "pending" && (
        <>
          <button
            className="btn-action confirm"
            onClick={() => handleConfirm(req, "pending")}
            title="Xác nhận nhận thuốc"
            style={{
              background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
              border: '1px solid #4CAF50',
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
              boxShadow: '0 2px 6px rgba(76, 175, 80, 0.25)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 3px 10px rgba(76, 175, 80, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.25)';
            }}
          >
            <FaCheckCircle />
          </button>
          <button
            className="btn-action reject"
            onClick={() => handleReject(req)}
            title="Từ chối"
            style={{
              background: 'linear-gradient(135deg, #FF5722, #D32F2F)',
              border: '1px solid #FF5722',
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
              boxShadow: '0 2px 6px rgba(255, 87, 34, 0.25)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 3px 10px rgba(255, 87, 34, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 6px rgba(255, 87, 34, 0.25)';
            }}
          >
            <FaTimesCircle />
          </button>
        </>
      )}
      {type === "active" && (
        <button
          className="btn-action complete"
          onClick={() => handleConfirm(req, "active")}
          title="Hoàn thành cho thuốc"
          style={{
            background: 'linear-gradient(135deg, #FF9800, #F57C00)',
            border: '1px solid #FF9800',
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
            boxShadow: '0 2px 6px rgba(255, 152, 0, 0.25)',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 3px 10px rgba(255, 152, 0, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 6px rgba(255, 152, 0, 0.25)';
          }}
        >
          <FaCheckDouble />
        </button>
      )}
    </div>
  );

  // Render Table
  const renderTable = (data, type, searchValue, setSearch, showAll, setShowAll) => (
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
              onChange={e => setSearch(e.target.value)}
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
                const filename = type === "pending" ? "don-thuoc-cho-xac-nhan" :
                  type === "active" ? "don-thuoc-dang-su-dung" : "don-thuoc-hoan-thanh";
                exportToExcel(data, filename);
              }}
            >
              <FaDownload /> Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="table-responsive medicine-table-wrapper" style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
        <Table className="medicine-table" style={{ width: '100%', tableLayout: 'fixed', minWidth: type === "pending" ? '920px' : '800px' }}>
          <thead>
            <tr>
              <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Mã đơn</th>
              <th style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>Lớp</th>
              <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Học sinh</th>
              {type === "pending" && <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Phụ huynh</th>}
              <th style={{ width: type === "pending" ? '150px' : '180px', minWidth: type === "pending" ? '150px' : '180px', maxWidth: type === "pending" ? '150px' : '180px' }}>Loại thuốc</th>
              <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Liều lượng</th>
              <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Ngày</th>
              <th style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(showAll ? data : data.slice(0, ROW_LIMIT)).map((req, index) => (
              <tr key={req.id || `req-${index}`}
                className="table-row"
                style={{}}>
                <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                  <div className="medicine-id">
                    <FaPills className="medicine-icon pill-bounce" />
                    #{req.id || 'N/A'}
                  </div>
                </td>
                <td style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
                  <Badge bg="secondary" className="class-badge">
                    {req.studentClassName || 'N/A'}
                  </Badge>
                </td>
                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                  <div className="student-info">
                    <strong>{req.student || 'N/A'}</strong>
                  </div>
                </td>
                {type === "pending" && (
                  <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                    <div className="parent-info">
                      {req.parent || 'N/A'}
                    </div>
                  </td>
                )}
                <td style={{ width: type === "pending" ? '150px' : '180px', minWidth: type === "pending" ? '150px' : '180px', maxWidth: type === "pending" ? '150px' : '180px' }}>
                  <div className="medicine-info">
                    <strong>{req.medicine || 'N/A'}</strong>
                  </div>
                </td>
                <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                  <Badge bg="info" className="dosage-badge">
                    {req.dosage || 'N/A'}
                  </Badge>
                </td>
                <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                  <div className="date-info">
                    <FaCalendarAlt className="date-icon" />
                    {req.date || 'N/A'}
                  </div>
                </td>
                <td style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>{renderActionButtons(req, type)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={type === "pending" ? 8 : 7} className="text-center empty-state">
                  <div className="empty-content">
                    <FaCapsules className="empty-icon" />
                    <p>Không có đơn thuốc nào</p>
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
            {showAll ? 'Thu gọn' : `Xem thêm ${data.length - ROW_LIMIT} đơn`}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="container-fluid nurse-theme medicine-management"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh"
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
            padding: 2rem !important;
            margin: -1.5rem -1.5rem 2rem -1.5rem !important;
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
            background: linear-gradient(135deg, #F06292 0%, #E91E63 50%, #C2185B 100%) !important;
            color: white !important;
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
          
          /* Enhanced Stats Card Icons */
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
          
          .stats-card.completed .stats-icon {
            background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
            color: white !important;
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
          
          .medicine-tabs .nav-link.active {
            background: white !important;
            color: #E91E63 !important;
            border-bottom: 3px solid #F06292 !important;
            box-shadow: 0 -4px 16px rgba(240, 98, 146, 0.1) !important;
            border-radius: 12px 12px 0 0 !important;
          }
          
          .medicine-tabs .nav-link:hover {
            color: #F06292 !important;
            background: rgba(248, 187, 217, 0.3) !important;
            border-radius: 12px 12px 0 0 !important;
          }
          
          /* Medicine Action Buttons - Higher Specificity Override */
          .medicine-action-buttons {
            display: flex !important;
            gap: 6px !important;
            align-items: center !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          
          .medicine-action-buttons .btn-action.btn.btn-sm {
            width: 30px !important;
            height: 30px !important;
            padding: 0 !important;
            margin: 0 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 8px !important;
            border: 1px solid !important;
            transition: all 0.2s ease !important;
            font-size: 12px !important;
            position: relative !important;
            min-width: 30px !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
          }
          
          .medicine-action-buttons .btn-action.btn.btn-sm svg {
            width: 12px !important;
            height: 12px !important;
          }
          
          .medicine-action-buttons .btn-action.view.btn.btn-info {
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            border-color: #F06292 !important;
            color: white !important;
            box-shadow: 0 2px 6px rgba(240, 98, 146, 0.25) !important;
          }
          
          .medicine-action-buttons .btn-action.view.btn.btn-info:hover {
            background: linear-gradient(135deg, #E91E63, #C2185B) !important;
            border-color: #E91E63 !important;
            transform: scale(1.05) !important;
            box-shadow: 0 3px 10px rgba(240, 98, 146, 0.35) !important;
            color: white !important;
          }
          
          .medicine-action-buttons .btn-action.confirm.btn.btn-success {
            background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
            border-color: #4CAF50 !important;
            color: white !important;
            box-shadow: 0 2px 6px rgba(76, 175, 80, 0.25) !important;
          }
          
          .medicine-action-buttons .btn-action.confirm.btn.btn-success:hover {
            background: linear-gradient(135deg, #388E3C, #2E7D32) !important;
            border-color: #388E3C !important;
            transform: scale(1.05) !important;
            box-shadow: 0 3px 10px rgba(76, 175, 80, 0.35) !important;
            color: white !important;
          }
          
          .medicine-action-buttons .btn-action.reject.btn.btn-danger {
            background: linear-gradient(135deg, #FF5722, #D32F2F) !important;
            border-color: #FF5722 !important;
            color: white !important;
            box-shadow: 0 2px 6px rgba(255, 87, 34, 0.25) !important;
          }
          
          .medicine-action-buttons .btn-action.reject.btn.btn-danger:hover {
            background: linear-gradient(135deg, #D32F2F, #B71C1C) !important;
            border-color: #D32F2F !important;
            transform: scale(1.05) !important;
            box-shadow: 0 3px 10px rgba(255, 87, 34, 0.35) !important;
            color: white !important;
          }
          
          .medicine-action-buttons .btn-action.complete.btn.btn-success {
            background: linear-gradient(135deg, #FF9800, #F57C00) !important;
            border-color: #FF9800 !important;
            color: white !important;
            box-shadow: 0 2px 6px rgba(255, 152, 0, 0.25) !important;
          }
          
          .medicine-action-buttons .btn-action.complete.btn.btn-success:hover {
            background: linear-gradient(135deg, #F57C00, #E65100) !important;
            border-color: #F57C00 !important;
            transform: scale(1.05) !important;
            box-shadow: 0 3px 10px rgba(255, 152, 0, 0.35) !important;
            color: white !important;
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
          
          .btn-action.confirm {
            background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
            border: 1px solid #4CAF50 !important;
            color: white !important;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
          }
          
          .btn-action.confirm:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4) !important;
          }
          
          .btn-action.reject {
            background: linear-gradient(135deg, #FF5722, #D32F2F) !important;
            border: 1px solid #FF5722 !important;
            color: white !important;
            box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3) !important;
          }
          
          .btn-action.reject:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4) !important;
          }
          
          .btn-action.complete {
            background: linear-gradient(135deg, #FF9800, #F57C00) !important;
            border: 1px solid #FF9800 !important;
            color: white !important;
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3) !important;
          }
          
          .btn-action.complete:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4) !important;
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
          .professional-prescription-modal .modal-content {
            border: none !important;
            border-radius: 20px !important;
            box-shadow: 0 25px 80px rgba(240, 98, 146, 0.2) !important;
            overflow: hidden !important;
            background: white !important;
          }
          
          .prescription-header {
            background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
            color: white !important;
            padding: 2rem !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .prescription-header::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
            pointer-events: none !important;
          }
          
          .prescription-title {
            position: relative !important;
            z-index: 2 !important;
            display: flex !important;
            align-items: center !important;
            gap: 1rem !important;
            margin: 0 !important;
          }
          
          .prescription-icon {
            width: 60px !important;
            height: 60px !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 15px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.8rem !important;
            animation: pulse 2s infinite !important;
          }
          
          .prescription-status {
            position: absolute !important;
            top: 1.5rem !important;
            right: 1.5rem !important;
            z-index: 3 !important;
          }
          
          .status-badge-large {
            padding: 0.8rem 1.8rem !important;
            border-radius: 25px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
            animation: fadeInDown 0.5s ease-out !important;
          }
          
          .prescription-body {
            padding: 0 !important;
            background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
          }
          
          .prescription-content {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0 !important;
            min-height: 500px !important;
          }
          
          .prescription-left {
            background: white !important;
            padding: 2.5rem !important;
            border-right: 3px solid #f8bbd9 !important;
            position: relative !important;
          }
          
          .prescription-left::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            width: 1px !important;
            height: 100% !important;
            background: linear-gradient(to bottom, transparent, #F06292, transparent) !important;
          }
          
          .prescription-right {
            background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
            padding: 2.5rem !important;
          }
          
          .info-section {
            margin-bottom: 2.5rem !important;
            animation: fadeInUp 0.6s ease-out !important;
          }
          
          .info-section:nth-child(1) { animation-delay: 0.1s !important; }
          .info-section:nth-child(2) { animation-delay: 0.2s !important; }
          .info-section:nth-child(3) { animation-delay: 0.3s !important; }
          
          .section-title {
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            margin-bottom: 1.5rem !important;
            font-size: 1.2rem !important;
            font-weight: 700 !important;
            color: #333 !important;
            padding-bottom: 0.75rem !important;
            border-bottom: 2px solid #f8bbd9 !important;
          }
          
          .section-title::after {
            content: '' !important;
            position: absolute !important;
            bottom: -2px !important;
            left: 0 !important;
            width: 50px !important;
            height: 2px !important;
            background: linear-gradient(90deg, #F06292, #E91E63) !important;
          }
          
          .section-icon {
            width: 40px !important;
            height: 40px !important;
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            color: white !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.1rem !important;
            box-shadow: 0 4px 12px rgba(240, 98, 146, 0.3) !important;
            animation: pulse 2s infinite !important;
          }
          
          .info-grid {
            display: grid !important;
            gap: 1.2rem !important;
          }
          
          .info-item-enhanced {
            background: white !important;
            border: 2px solid #fce4ec !important;
            border-radius: 15px !important;
            padding: 1.5rem !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
            transform: translateY(0) !important;
          }
          
          .info-item-enhanced::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 5px !important;
            height: 100% !important;
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
          }
          
          .info-item-enhanced:hover {
            border-color: #F06292 !important;
            transform: translateY(-3px) translateX(3px) !important;
            box-shadow: 0 12px 30px rgba(240, 98, 146, 0.2) !important;
          }
          
          .info-item-enhanced:hover::before {
            opacity: 1 !important;
          }
          
          .info-label-enhanced {
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            color: #F06292 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.8px !important;
            margin-bottom: 0.8rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.6rem !important;
          }
          
          .info-label-enhanced svg {
            font-size: 1rem !important;
            color: #E91E63 !important;
          }
          
          .info-value-enhanced {
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            color: #2d3748 !important;
            line-height: 1.5 !important;
          }
          
          .medication-card {
            background: linear-gradient(135deg, #ffffff 0%, #fce4ec 100%) !important;
            border: 2px solid #f8bbd9 !important;
            border-radius: 20px !important;
            padding: 2rem !important;
            margin-bottom: 1.5rem !important;
            position: relative !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            animation: slideInRight 0.5s ease-out !important;
          }
          
          .medication-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 15px 40px rgba(240, 98, 146, 0.25) !important;
          }
          
          .medication-card::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 5px !important;
            background: linear-gradient(90deg, #F06292, #E91E63, #C2185B, #F06292) !important;
            background-size: 200% 100% !important;
            animation: gradientFlow 3s ease-in-out infinite !important;
          }
          
          .medication-header {
            display: flex !important;
            align-items: center !important;
            gap: 1.2rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .medication-icon {
            width: 50px !important;
            height: 50px !important;
            background: linear-gradient(135deg, #F06292, #E91E63) !important;
            color: white !important;
            border-radius: 15px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.4rem !important;
            box-shadow: 0 6px 20px rgba(240, 98, 146, 0.4) !important;
            animation: bounce 2s infinite !important;
          }
          
          .medication-name {
            font-size: 1.4rem !important;
            font-weight: 700 !important;
            color: #2d3748 !important;
            margin: 0 !important;
          }
          
          .dosage-highlight {
            background: linear-gradient(135deg, #e6f7ff, #f0f5ff) !important;
            border: 3px solid #F06292 !important;
            border-radius: 15px !important;
            padding: 1rem 1.5rem !important;
            font-weight: 700 !important;
            color: #C2185B !important;
            text-align: center !important;
            font-size: 1.2rem !important;
            margin: 1rem 0 !important;
            box-shadow: 0 4px 15px rgba(240, 98, 146, 0.2) !important;
            position: relative !important;
          }
          
          .dosage-highlight::before {
            content: '💊' !important;
            position: absolute !important;
            left: 1rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 1.5rem !important;
          }
          
          .notes-section {
            background: linear-gradient(135deg, #fef7e6, #fdecd1) !important;
            border: 2px solid #F59E0B !important;
            border-radius: 15px !important;
            padding: 1.5rem !important;
            margin-top: 1.5rem !important;
            position: relative !important;
          }
          
          .notes-section::before {
            content: '📝' !important;
            position: absolute !important;
            top: -10px !important;
            left: 15px !important;
            background: #F59E0B !important;
            color: white !important;
            width: 25px !important;
            height: 25px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 0.8rem !important;
          }
          
          .notes-title {
            display: flex !important;
            align-items: center !important;
            gap: 0.8rem !important;
            font-weight: 700 !important;
            color: #92400e !important;
            margin-bottom: 0.8rem !important;
            font-size: 1.1rem !important;
          }
          
          .notes-content {
            color: #78350f !important;
            line-height: 1.6 !important;
            font-style: italic !important;
            font-size: 1rem !important;
            background: rgba(255, 255, 255, 0.7) !important;
            padding: 1rem !important;
            border-radius: 8px !important;
          }
          
          .prescription-footer {
            background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
            padding: 2rem !important;
            border-top: 3px solid #F06292 !important;
            position: relative !important;
          }
          
          .prescription-footer::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 60px !important;
            height: 3px !important;
            background: linear-gradient(90deg, transparent, #F06292, transparent) !important;
          }
          
          .footer-actions {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 1.5rem !important;
          }
          
          .action-btn-enhanced {
            padding: 1rem 2.5rem !important;
            border-radius: 25px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.8rem !important;
            transition: all 0.3s ease !important;
            border: none !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .action-btn-enhanced::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
            transform: translate(-50%, -50%) !important;
          }
          
          .action-btn-enhanced:hover::before {
            width: 300px !important;
            height: 300px !important;
          }
          
          .btn-close-enhanced {
            background: linear-gradient(135deg, #6c757d, #495057) !important;
            color: white !important;
          }
          
          .btn-close-enhanced:hover {
            background: linear-gradient(135deg, #495057, #343a40) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3) !important;
          }
          
          .btn-confirm-enhanced {
            background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
            color: white !important;
          }
          
          .btn-confirm-enhanced:hover {
            background: linear-gradient(135deg, #388E3C, #2E7D32) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
          }
          
          .btn-reject-enhanced {
            background: linear-gradient(135deg, #F44336, #D32F2F) !important;
            color: white !important;
          }
          
          .btn-reject-enhanced:hover {
            background: linear-gradient(135deg, #D32F2F, #C62828) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4) !important;
          }
          
          .btn-complete-enhanced {
            background: linear-gradient(135deg, #FF9800, #F57C00) !important;
            color: white !important;
          }
          
          .btn-complete-enhanced:hover {
            background: linear-gradient(135deg, #F57C00, #EF6C00) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4) !important;
          }
          
          .loading-enhanced {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4rem !important;
            text-align: center !important;
          }
          
          .loading-icon-enhanced {
            font-size: 3.5rem !important;
            color: #F06292 !important;
            margin-bottom: 1.5rem !important;
            animation: spin 1s linear infinite !important;
          }
          
          .error-enhanced {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4rem !important;
            text-align: center !important;
            color: #F44336 !important;
          }
          
          .error-icon-enhanced {
            font-size: 3.5rem !important;
            margin-bottom: 1.5rem !important;
            animation: shake 0.5s ease-in-out !important;
          }
          
          /* Enhanced Animations */
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-5px); }
            60% { transform: translateY(-3px); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          /* Mobile Responsive */
          @media (max-width: 768px) {
            .professional-prescription-modal .modal-dialog {
              max-width: 95% !important;
              margin: 1rem !important;
            }
            
            .prescription-content {
              grid-template-columns: 1fr !important;
            }
            
            .prescription-left {
              border-right: none !important;
              border-bottom: 3px solid #fce4ec !important;
            }
            
            .prescription-header {
              padding: 1.5rem !important;
            }
            
            .prescription-left,
            .prescription-right {
              padding: 1.5rem !important;
            }
            
            .footer-actions {
              flex-direction: column !important;
              gap: 1rem !important;
            }
            
            .action-btn-enhanced {
              width: 100% !important;
              justify-content: center !important;
            }
            
            .prescription-status {
              position: static !important;
              margin-top: 1rem !important;
              text-align: center !important;
            }
            
            .prescription-title {
              flex-direction: column !important;
              text-align: center !important;
              gap: 1rem !important;
            }
          }
          
          /* Enhanced Form Elements */
          .form-control {
            border: 2px solid #fce4ec !important;
            border-radius: 10px !important;
            padding: 0.75rem 1rem !important;
            transition: all 0.3s ease !important;
          }
          
          .form-control:focus {
            border-color: #F06292 !important;
            box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
            background: #fefefe !important;
          }
          
          .form-select {
            border: 2px solid #fce4ec !important;
            border-radius: 10px !important;
            padding: 0.75rem 1rem !important;
            transition: all 0.3s ease !important;
          }
          
          .form-select:focus {
            border-color: #F06292 !important;
            box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
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
          
          .class-badge {
            background: linear-gradient(135deg, #F8BBD9, #F06292) !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 0.25rem 0.75rem !important;
            font-weight: 600 !important;
          }
          
          .dosage-badge {
            background: linear-gradient(135deg, #E1F5FE, #B3E5FC) !important;
            color: #0277BD !important;
            border-radius: 8px !important;
            padding: 0.25rem 0.75rem !important;
            font-weight: 600 !important;
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
          
          .notification-alert {
            border-radius: 12px !important;
            border: none !important;
            box-shadow: 0 4px 16px rgba(240, 98, 146, 0.15) !important;
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
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-title">
              <FaStethoscope className="page-icon" />
              <h1>Quản lý Thuốc Y tế</h1>
            </div>
            <p className="page-subtitle">
              Theo dõi và xử lý các đơn thuốc từ phụ huynh
            </p>
          </div>
          <div className="header-right">
            <div className="quick-stats">
              <div className="stat-item pending">
                <FaBell className="stat-icon" />
                <span className="stat-value">{totalPending}</span>
                <span className="stat-label">Chờ xử lý</span>
              </div>
              <div className="stat-item active">
                <FaClock className="stat-icon" />
                <span className="stat-value">{totalActive}</span>
                <span className="stat-label">Đang sử dụng</span>
              </div>
              <div className="stat-item completed">
                <FaCheckCircle className="stat-icon" />
                <span className="stat-value">{totalCompleted}</span>
                <span className="stat-label">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard">
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className={`stats-card pending ${animateStats ? 'animate-in' : ''}`}
              style={{ animationDelay: '0.1s' }}>
              <div className="card-body">
                <div className="stats-content">
                  <div className="stats-icon pulse-animation">
                    <FaExclamationTriangle />
                  </div>
                  <div className="stats-info">
                    <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalPending}</div>
                    <div className="stats-label">Chờ xác nhận</div>
                  </div>
                </div>
                <div className="stats-footer">
                  <FaBell className="footer-icon bounce-subtle" />
                  <span>Cần xử lý ngay</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className={`stats-card active ${animateStats ? 'animate-in' : ''}`}
              style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaSpinner className="fa-spin" />
                  </div>
                  <div className="stats-info">
                    <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalActive}</div>
                    <div className="stats-label">Đang sử dụng</div>
                  </div>
                </div>
                <div className="stats-footer">
                  <FaClock className="footer-icon tick-animation" />
                  <span>Theo dõi tiến độ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className={`stats-card completed ${animateStats ? 'animate-in' : ''}`}
              style={{ animationDelay: '0.3s' }}>
              <div className="card-body">
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaCheckDouble className="check-animation" />
                  </div>
                  <div className="stats-info">
                    <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalCompleted}</div>
                    <div className="stats-label">Đã hoàn thành</div>
                  </div>
                </div>
                <div className="stats-footer">
                  <FaCheckCircle className="footer-icon" />
                  <span>Thành công</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className={`stats-card today ${animateStats ? 'animate-in' : ''}`}
              style={{ animationDelay: '0.4s' }}>
              <div className="card-body">
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaCalendarAlt className="calendar-flip" />
                  </div>
                  <div className="stats-info">
                    <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalToday}</div>
                    <div className="stats-label">Hôm nay</div>
                  </div>
                </div>
                <div className="stats-footer">
                  <FaChartBar className="footer-icon chart-grow" />
                  <span>Hoạt động trong ngày</span>
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
          <Tabs
            activeKey={activeTab}
            onSelect={setActiveTab}
            className="medicine-tabs"
          >
            <Tab
              eventKey="pending"
              title={
                <div className="tab-title pending">
                  <FaExclamationTriangle className="tab-icon" />
                  <span>Chờ xác nhận</span>
                  <Badge bg="warning" className="tab-badge">{totalPending}</Badge>
                </div>
              }
            >
              <div className="tab-content">
                {renderTable(
                  filteredPending,
                  "pending",
                  searchPending,
                  setSearchPending,
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
                  <Badge bg="info" className="tab-badge">{totalActive}</Badge>
                </div>
              }
            >
              <div className="tab-content">
                {renderTable(
                  filteredActive,
                  "active",
                  searchActive,
                  setSearchActive,
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
                  <Badge bg="success" className="tab-badge">{totalCompleted}</Badge>
                </div>
              }
            >
              <div className="tab-content">
                {renderTable(
                  filteredCompleted,
                  "completed",
                  searchCompleted,
                  setSearchCompleted,
                  completedShowAll,
                  setCompletedShowAll
                )}
              </div>
            </Tab>
          </Tabs>
        )}
      </div>

      {/* Professional Medicine Detail Modal */}
      <Modal
        show={modalDetail !== null}
        onHide={() => setModalDetail(null)}
        size="xl"
        className="medicine-detail-modal professional-prescription-modal"
      >
        <style>
          {`
            .professional-prescription-modal .modal-dialog {
              max-width: 95% !important;
              margin: 2rem auto !important;
            }
            
            .professional-prescription-modal .modal-content {
              border: none !important;
              border-radius: 20px !important;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
              overflow: hidden !important;
            }
            
            .prescription-header {
              background: linear-gradient(135deg, #F06292 0%, #E91E63 100%) !important;
              color: white !important;
              padding: 2rem !important;
              position: relative !important;
              overflow: hidden !important;
            }
            
            .prescription-header::before {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
              pointer-events: none !important;
            }
            
            .prescription-title {
              position: relative !important;
              z-index: 2 !important;
              display: flex !important;
              align-items: center !important;
              gap: 1rem !important;
              margin: 0 !important;
            }
            
            .prescription-icon {
              width: 50px !important;
              height: 50px !important;
              background: rgba(255, 255, 255, 0.2) !important;
              border-radius: 15px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 1.5rem !important;
            }
            
            .prescription-status {
              position: absolute !important;
              top: 1rem !important;
              right: 1rem !important;
              z-index: 3 !important;
            }
            
            .status-badge-large {
              padding: 0.75rem 1.5rem !important;
              border-radius: 25px !important;
              font-weight: 700 !important;
              font-size: 0.9rem !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              border: 2px solid rgba(255, 255, 255, 0.3) !important;
              backdrop-filter: blur(10px) !important;
            }
            
            .prescription-body {
              padding: 0 !important;
              background: #f8f9fc !important;
            }
            
            .prescription-content {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 0 !important;
              min-height: 500px !important;
            }
            
            .prescription-left {
              background: white !important;
              padding: 2rem !important;
              border-right: 3px solid #f8bbd9 !important;
            }
            
            .prescription-right {
              background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
              padding: 2rem !important;
            }
            
            .info-section {
              margin-bottom: 2rem !important;
            }
            
            .section-title {
              display: flex !important;
              align-items: center !important;
              gap: 0.75rem !important;
              margin-bottom: 1.5rem !important;
              font-size: 1.2rem !important;
              font-weight: 700 !important;
              color: #333 !important;
              padding-bottom: 0.75rem !important;
              border-bottom: 2px solid #f8bbd9 !important;
            }
            
            .section-icon {
              width: 35px !important;
              height: 35px !important;
              background: linear-gradient(135deg, #F06292, #E91E63) !important;
              color: white !important;
              border-radius: 10px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 1rem !important;
            }
            
            .info-grid {
              display: grid !important;
              gap: 1rem !important;
            }
            
            .info-item-enhanced {
              background: white !important;
              border: 2px solid #fce4ec !important;
              border-radius: 12px !important;
              padding: 1rem !important;
              transition: all 0.3s ease !important;
              position: relative !important;
              overflow: hidden !important;
            }
            
            .info-item-enhanced:hover {
              border-color: #F06292 !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 15px rgba(240, 98, 146, 0.15) !important;
            }
            
            .info-item-enhanced::before {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 4px !important;
              height: 100% !important;
              background: linear-gradient(135deg, #F06292, #E91E63) !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease !important;
            }
            
            .info-item-enhanced:hover::before {
              opacity: 1 !important;
            }
            
            .info-label-enhanced {
              font-size: 0.85rem !important;
              font-weight: 600 !important;
              color: #F06292 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
              margin-bottom: 0.5rem !important;
              display: flex !important;
              align-items: center !important;
              gap: 0.5rem !important;
            }
            
            .info-value-enhanced {
              font-size: 1rem !important;
              font-weight: 500 !important;
              color: #2d3748 !important;
              line-height: 1.4 !important;
            }
            
            .medication-card {
              background: linear-gradient(135deg, #ffffff 0%, #fce4ec 100%) !important;
              border: 2px solid #f8bbd9 !important;
              border-radius: 16px !important;
              padding: 1.5rem !important;
              margin-bottom: 1rem !important;
              position: relative !important;
              overflow: hidden !important;
            }
            
            .medication-card::before {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              height: 4px !important;
              background: linear-gradient(90deg, #F06292, #E91E63, #C2185B) !important;
            }
            
            .medication-header {
              display: flex !important;
              align-items: center !important;
              gap: 1rem !important;
              margin-bottom: 1rem !important;
            }
            
            .medication-icon {
              width: 45px !important;
              height: 45px !important;
              background: linear-gradient(135deg, #F06292, #E91E63) !important;
              color: white !important;
              border-radius: 12px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 1.2rem !important;
            }
            
            .medication-name {
              font-size: 1.3rem !important;
              font-weight: 700 !important;
              color: #2d3748 !important;
              margin: 0 !important;
            }
            
            .dosage-highlight {
              background: linear-gradient(135deg, #fce4ec, #f8bbd9) !important;
              border: 2px solid #F06292 !important;
              border-radius: 10px !important;
              padding: 0.75rem 1rem !important;
              font-weight: 600 !important;
              color: #C2185B !important;
              text-align: center !important;
              font-size: 1.1rem !important;
            }
            
            .notes-section {
              background: linear-gradient(135deg, #fff3e0, #ffe0b2) !important;
              border: 2px solid #ff9800 !important;
              border-radius: 12px !important;
              padding: 1rem !important;
              margin-top: 1rem !important;
            }
            
            .notes-title {
              display: flex !important;
              align-items: center !important;
              gap: 0.5rem !important;
              font-weight: 700 !important;
              color: #f57c00 !important;
              margin-bottom: 0.5rem !important;
            }
            
            .notes-content {
              color: #e65100 !important;
              line-height: 1.5 !important;
              font-style: italic !important;
            }
            
            .prescription-footer {
              background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
              padding: 1.5rem 2rem !important;
              border-top: 3px solid #f8bbd9 !important;
            }
            
            .footer-actions {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              gap: 1rem !important;
            }
            
            .action-btn-enhanced {
              padding: 0.65rem 1.5rem !important;
              border-radius: 20px !important;
              font-weight: 600 !important;
              font-size: 0.9rem !important;
              display: flex !important;
              align-items: center !important;
              gap: 0.4rem !important;
              transition: all 0.3s ease !important;
              border: none !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
            }
            
            .action-btn-enhanced svg {
              font-size: 0.9rem !important;
            }
            
            .btn-close-enhanced {
              background: linear-gradient(135deg, #6c757d, #495057) !important;
              color: white !important;
            }
            
            .btn-close-enhanced:hover {
              background: linear-gradient(135deg, #495057, #343a40) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2) !important;
            }
            
            .btn-confirm-enhanced {
              background: linear-gradient(135deg, #28a745, #20c997) !important;
              color: white !important;
            }
            
            .btn-confirm-enhanced:hover {
              background: linear-gradient(135deg, #20c997, #17a2b8) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2) !important;
            }
            
            .btn-reject-enhanced {
              background: linear-gradient(135deg, #dc3545, #c82333) !important;
              color: white !important;
            }
            
            .btn-reject-enhanced:hover {
              background: linear-gradient(135deg, #c82333, #a71e2a) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2) !important;
            }
            
            .btn-complete-enhanced {
              background: linear-gradient(135deg, #17a2b8, #138496) !important;
              color: white !important;
            }
            
            .btn-complete-enhanced:hover {
              background: linear-gradient(135deg, #138496, #0f6674) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 15px rgba(23, 162, 184, 0.2) !important;
            }
            
            .loading-enhanced {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 3rem !important;
              text-align: center !important;
            }
            
            .loading-icon-enhanced {
              font-size: 3rem !important;
              color: #F06292 !important;
              margin-bottom: 1rem !important;
            }
            
            .error-enhanced {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 3rem !important;
              text-align: center !important;
              color: #dc3545 !important;
            }
            
            .error-icon-enhanced {
              font-size: 3rem !important;
              margin-bottom: 1rem !important;
            }
            
            @media (max-width: 768px) {
              .professional-prescription-modal .modal-dialog {
                max-width: 95% !important;
                margin: 1rem !important;
              }
              
              .prescription-content {
                grid-template-columns: 1fr !important;
              }
              
              .prescription-left {
                border-right: none !important;
                border-bottom: 3px solid #f8bbd9 !important;
              }
              
              .prescription-header {
                padding: 1.5rem !important;
              }
              
              .prescription-left,
              .prescription-right {
                padding: 1.5rem !important;
              }
              
              .footer-actions {
                flex-direction: column !important;
                gap: 0.75rem !important;
              }
              
              .action-btn-enhanced {
                width: 100% !important;
                justify-content: center !important;
              }
            }
          `}
        </style>

        <div className="prescription-header">
          <div className="prescription-title">
            <div className="prescription-icon">
              <FaPills />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: '700' }}>Chi tiết Đơn Thuốc</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                Thông tin đầy đủ về đơn thuốc và hướng dẫn sử dụng
              </p>
            </div>
          </div>

          {detailData && (
            <div className="prescription-status">
              <div className={`status-badge-large ${detailData.status === "Pending" ? "bg-warning" :
                detailData.status === "Active" ? "bg-info" : "bg-success"
                }`}>
                {detailData.status === "Pending" ? "⏳ Chờ xác nhận" :
                  detailData.status === "Active" ? "🔄 Đang sử dụng" : "✅ Đã hoàn thành"}
              </div>
            </div>
          )}
        </div>

        <div className="prescription-body">
          {detailLoading && (
            <div className="loading-enhanced">
              <FaSpinner className="fa-spin loading-icon-enhanced" />
              <h5>Đang tải chi tiết đơn thuốc...</h5>
              <p style={{ color: '#666', margin: 0 }}>Vui lòng chờ trong giây lát</p>
            </div>
          )}

          {!detailLoading && !detailData && (
            <div className="error-enhanced">
              <FaExclamationTriangle className="error-icon-enhanced" />
              <h5>Không tìm thấy chi tiết đơn thuốc</h5>
              <p style={{ margin: 0 }}>Dữ liệu có thể đã bị xóa hoặc không tồn tại</p>
            </div>
          )}

          {!detailLoading && detailData && (
            <div className="prescription-content">
              {/* Left Column - Basic Info */}
              <div className="prescription-left">
                <div className="info-section">
                  <div className="section-title">
                    <div className="section-icon">
                      <FaClipboardList />
                    </div>
                    Thông tin đơn thuốc
                  </div>
                  <div className="info-grid">
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaHashtag />
                        Mã đơn thuốc
                      </div>
                      <div className="info-value-enhanced">#{detailData.id}</div>
                    </div>
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaCalendarAlt />
                        Ngày tạo đơn
                      </div>
                      <div className="info-value-enhanced">
                        {new Date(detailData.createdDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaClock />
                        Thời gian sử dụng
                      </div>
                      <div className="info-value-enhanced">{detailData.days} ngày</div>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <div className="section-title">
                    <div className="section-icon">
                      <FaUserGraduate />
                    </div>
                    Thông tin học sinh
                  </div>
                  <div className="info-grid">
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaUser />
                        Họ và tên
                      </div>
                      <div className="info-value-enhanced">{detailData.studentName}</div>
                    </div>
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaGraduationCap />
                        Lớp học
                      </div>
                      <div className="info-value-enhanced">{detailData.studentClassName}</div>
                    </div>
                    <div className="info-item-enhanced">
                      <div className="info-label-enhanced">
                        <FaUserFriends />
                        Phụ huynh
                      </div>
                      <div className="info-value-enhanced">{detailData.parentName}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Medication Details */}
              <div className="prescription-right">
                <div className="info-section">
                  <div className="section-title">
                    <div className="section-icon">
                      <FaCapsules />
                    </div>
                    Thông tin thuốc
                  </div>

                  {detailData.medications && detailData.medications.length > 0 ? (
                    detailData.medications.map((medication, index) => (
                      <div key={index} className="medication-card">
                        <div className="medication-header">
                          <div className="medication-icon">
                            <FaPills />
                          </div>
                          <h4 className="medication-name">{medication.medicationName}</h4>
                        </div>

                        <div className="dosage-highlight">
                          <strong>Liều dùng: {medication.dosage}</strong>
                        </div>

                        {medication.note && (
                          <div className="notes-section">
                            <div className="notes-title">
                              <FaStickyNote />
                              Ghi chú quan trọng:
                            </div>
                            <div className="notes-content">
                              "{medication.note}"
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="info-item-enhanced">
                      <div className="info-value-enhanced" style={{ textAlign: 'center', color: '#666' }}>
                        Không có thông tin thuốc
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="prescription-footer">
          <div className="footer-actions">
            <Button
              className="action-btn-enhanced btn-close-enhanced"
              onClick={() => setModalDetail(null)}
            >
              <FaTimes />
              Đóng
            </Button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {modalDetail?.type === "pending" && (
                <>
                  <Button
                    className="action-btn-enhanced btn-reject-enhanced"
                    onClick={() => {
                      handleReject(modalDetail.data);
                      setModalDetail(null);
                    }}
                  >
                    <FaTimesCircle />
                    Từ chối
                  </Button>
                  <Button
                    className="action-btn-enhanced btn-confirm-enhanced"
                    onClick={() => {
                      handleConfirm(modalDetail.data, "pending");
                      setModalDetail(null);
                    }}
                  >
                    <FaCheckCircle />
                    Xác nhận
                  </Button>
                </>
              )}
              {modalDetail?.type === "active" && (
                <Button
                  className="action-btn-enhanced btn-complete-enhanced"
                  onClick={() => {
                    handleConfirm(modalDetail.data, "active");
                    setModalDetail(null);
                  }}
                >
                  <FaCheckDouble />
                  Hoàn thành
                </Button>
              )}
            </div>
          </div>
        </div>
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
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-2" />Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateRange.start}
                    onChange={(e) => setFilterOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-2" />Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateRange.end}
                    onChange={(e) => setFilterOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label><FaHospital className="me-2" />Lớp học</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên lớp (vd: 6A1, 7B2...)"
                value={filterOptions.className}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  className: e.target.value
                }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FaCapsules className="me-2" />Loại thuốc</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên thuốc"
                value={filterOptions.medicineType}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  medicineType: e.target.value
                }))}
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
                {!filterOptions.dateRange.start && !filterOptions.dateRange.end &&
                  !filterOptions.className && !filterOptions.medicineType && (
                    <span className="text-muted">Chưa có điều kiện lọc nào</span>
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
