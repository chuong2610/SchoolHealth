import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Modal,
  Nav,
  Tab,
  Form,
  Alert,
} from "react-bootstrap";
import { Bar } from "@ant-design/charts";
import {
  FaEye,
  FaUser,
  FaRulerVertical,
  FaWeight,
  FaCalendarAlt,
  FaUserMd,
  FaSyringe,
  FaBuilding,
  FaCheckCircle,
  FaExclamationCircle,
  FaPills,
  FaChevronLeft,
  FaChevronRight,
  FaStethoscope,
  FaHistory,
  FaChartBar,
  FaSearch,
  FaTimes,
  FaClipboardList,
  FaComments,
  FaInfoCircle,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import { getHealthHistoryStatistics } from "../../api/parent/HealthHistoryApi";
import { useDebounce } from "use-debounce";
import { formatDateTime, formatDDMMYYYY } from "../../utils/dateFormatter";
import { toast } from "react-toastify";
import styles from "./HealthHistory.module.css";
import ConfirmModal from "../../components/common/ConfirmModal"; // Thêm dòng này

// Styles được import từ main.jsx

const HealthHistory = () => {
  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("checkup");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const parentId = user?.id ? Number(user.id) : undefined;
  const navigate = useNavigate();

  // State cho modal chi tiết
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  // State cho hiển thị biểu đồ
  const [showChart, setShowChart] = useState(false);

  // State cho modal chi tiết gửi thuốc
  const [showMedicationDetail, setShowMedicationDetail] = useState(false);
  const [medicationDetail, setMedicationDetail] = useState(null);
  const [loadingMedicationDetail, setLoadingMedicationDetail] = useState(false);

  // State search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500); // 500ms delay

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const [statistics, setStatistics] = useState({
    totalHealthChecks: 0,
    totalVaccinations: 0,
    totalMedicationsSent: 0,
  });

  // State xác nhận tiêm chủng
  const [confirmLoading, setConfirmLoading] = useState(false);

  // State cho modal xác nhận
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // "vaccination" hoặc "other"
  });

  // Hàm xử lý liên hệ với y tá
  const handleContactNurse = (nurseName, nurseId) => {
    navigate("/parent/chat", {
      state: {
        nurseName: nurseName,
        nurseId: nurseId,
        autoStartChat: true,
      },
    });
  };

  // Fetch healthHistory statistics
  const fetchHealthHistoryStats = async () => {
    try {
      const res = await getHealthHistoryStatistics(parentId);
      if (res) {
        setStatistics({
          totalHealthChecks: res.totalHealthChecks || 0,
          totalVaccinations: res.totalVaccinations || 0,
          totalMedicationsSent: res.totalMedicationsSent || 0,
        });
      }
    } catch (error) {
      setStatistics({
        totalHealthChecks: 0,
        totalVaccinations: 0,
        totalMedicationsSent: 0,
      });
    }
  };
  // useEffect: Fetch dữ liệu khi đổi tab
  useEffect(() => {
    if (!parentId) return;
    setLoading(true);
    setError("");
    let baseUrl = "";
    if (activeTab === "checkup" || activeTab === "chart") {
      baseUrl = `/HealthCheck/parent/${parentId}`;
    } else if (activeTab === "vaccination") {
      baseUrl = `/Vaccination/parent/${parentId}`;
    } else if (activeTab === "medication") {
      baseUrl = `/Medication/parent/${parentId}`;
    } else if (activeTab === "event") {
      baseUrl = `/MedicalEvent/parent/${parentId}`;
    } else if (activeTab === "other") {
      baseUrl = `/OtherCheck/parent/${parentId}`;
    }

    if (!baseUrl) return;

    const url =
      `${baseUrl}?pageNumber=${currentPage}&pageSize=${pageSize}` +
      `${debouncedSearch ? `&search=${debouncedSearch}` : ""}`;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);

        const responseData = response.data.data;

        // Handle both paginated responses (object with 'items') and direct array responses
        const items = Array.isArray(responseData)
          ? responseData
          : responseData?.items;
        const total = responseData?.totalPages ?? 1;

        if (Array.isArray(items)) {
          setData(items);
          setTotalPages(total);
        } else {
          console.error(
            "Data from API is not in a recognized format:",
            responseData
          );
          setData([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError("Failed to load data!");
        setData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, activeTab, currentPage, debouncedSearch]);

  // Hàm lấy chi tiết
  const handleShowDetail = async (id, type = "checkup") => {
    setShowModal(true);
    setLoadingDetail(true);
    setErrorDetail("");
    setDetail(null);

    let url = "";
    if (type === "checkup") url = `/HealthCheck/${id}`;
    else if (type === "vaccination") url = `/Vaccination/${id}`;
    else if (type === "medicine") url = `/Medication/${id}`;
    else if (type === "other") url = `/OtherCheck/${id}`;
    else if (type === "event") url = `/MedicalEvent/${id}`;

    try {
      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setDetail(res.data.data);
      } else {
        setErrorDetail("Could not get details");
      }
    } catch (err) {
      setErrorDetail("Error fetching details");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Hàm lấy chi tiết gửi thuốc
  const handleShowMedicationDetail = async (id) => {
    setShowMedicationDetail(true);
    setLoadingMedicationDetail(true);
    setMedicationDetail(null);
    try {
      const res = await axiosInstance.get(`/Medication/${id}`);
      setMedicationDetail(res.data.data);
    } catch (e) {
      setMedicationDetail(null);
    } finally {
      setLoadingMedicationDetail(false);
    }
  };

  // Hàm xác nhận tiêm chủng bình thường
  const handleConfirmVaccination = async (vaccinationId) => {
    if (!vaccinationId) return;
    setConfirmLoading(true);
    try {
      await axiosInstance.patch(`/Vaccination/submit-result/${vaccinationId}`);
      // Gọi lại API lấy chi tiết để cập nhật trạng thái mới
      const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
      if (res.data.success) {
        setDetail(res.data.data);
        toast.success("Xác nhận thành công!");
      }
    } catch (e) {
      toast.error("Xác nhận thất bại. Vui lòng thử lại!");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm xác nhận không có dấu hiệu
  const handleConfirmNoSymptom = async (vaccinationId) => {
    if (!vaccinationId) return;
    setConfirmLoading(true);
    try {
      await axiosInstance.patch(`/Vaccination/submit-result/${vaccinationId}`, {
        noSymptom: true,
      });
      const res = await axiosInstance.get(`/Vaccination/${vaccinationId}`);
      if (res.data.success) {
        setDetail(res.data.data);
        toast.success("Xác nhận không có dấu hiệu thành công!");
      }
    } catch (e) {
      toast.error("Xác nhận thất bại. Vui lòng thử lại!");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm xác nhận cho kiểm tra khác (other)
  const handleConfirmOtherCheck = async (otherCheckId) => {
    if (!otherCheckId) return;
    setConfirmLoading(true);
    try {
      await axiosInstance.patch(`/OtherCheck/submit-result/${otherCheckId}`);
      const res = await axiosInstance.get(`/OtherCheck/${otherCheckId}`);
      if (res.data.success) {
        setDetail(res.data.data);
        toast.success("Xác nhận không có dấu hiệu bất thường thành công!");
      }
    } catch (e) {
      toast.error("Xác nhận thất bại. Vui lòng thử lại!");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm xác định class cho badge
  function getStatusClass(status) {
    if (!status) return "badge-status";
    const s = status.toLowerCase();
    if (s === "completed" || s === "đã hoàn thành")
      return "badge-status completed";
    if (s === "active" || s === "đang sử dụng") return styles.badgeConfirmed;
    if (s === "pending" || s === "chờ xác nhận") return styles.badgePending;
    if (s === "rejected" || s === "đã từ chối") return styles.badgeRejected;
    return "badge-status";
  }

  function getStatusConclusion(conclusion) {
    if (!conclusion) return "conclusionStatus";
    const c = conclusion;
    if (c === "Healthy" || c === "khỏe mạnh") return styles.conclusionHealthy;
    if (c === "Sick" || c === "bệnh") return styles.conclusionSick;
    return "conclusionStatus";
  }

  function getStatusVaccine(result) {
    if (!result) return "badge-status";
    const r = result.toLowerCase();
    if (r === "successful" || r === "đã tiêm") return "badge-status successful";
    if (r === "pending" || r === "chờ tiêm") return "badge-status pending";
    if (r === "rejected" || r === "đã từ chối") return "badge-status rejected";
    return "badge-status";
  }

  // Filter và phân trang
  const filteredData = data.filter((item) => {
    try {
      if (!searchTerm) return true;
      if (!item) return false; // Guard against null/undefined items

      const searchLower = searchTerm.toLowerCase();

      // Common fields check
      if (
        (item.studentName || "").toLowerCase().includes(searchLower) ||
        (item.nurseName || "").toLowerCase().includes(searchLower)
      ) {
        return true;
      }

      // Tab-specific fields check
      if (activeTab === "checkup" || activeTab === "chart") {
        return (item.conclusion || "").toLowerCase().includes(searchLower);
      } else if (activeTab === "vaccination") {
        return (
          (item.vaccineName || "").toLowerCase().includes(searchLower) ||
          (item.location || "").toLowerCase().includes(searchLower)
        );
      } else if (activeTab === "medication") {
        const statusMatch = (item.status || "")
          .toLowerCase()
          .includes(searchLower);
        const medicationMatch = item.medications?.some((med) =>
          (med?.medicationName || "").toLowerCase().includes(searchLower)
        );
        return statusMatch || medicationMatch;
      } else if (activeTab === "other") {
        return (
          (item.name || "").toLowerCase().includes(searchLower) ||
          (item.conclusion || "").toLowerCase().includes(searchLower) ||
          (item.location || "").toLowerCase().includes(searchLower)
        );
      }

      return false;
    } catch (e) {
      return false; // Exclude item that causes an error from the results
    }
  });

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm xác nhận hành động (tiêm chủng, kiểm tra khác)
  const handleConfirmAction = async () => {
    if (!detail?.id) return;
    if (confirmModal.action === "vaccination") {
      await handleConfirmVaccination(detail.id);
    } else if (confirmModal.action === "other") {
      await handleConfirmOtherCheck(detail.id);
    }
    setConfirmModal({ show: false, action: null });
  };

  return (
    <div className={styles.healthHistoryContainer}>
      {/* Page Header */}
      {/* <div className="parent-page-header parent-animate-fade-in">
        <div className="parent-page-header-bg"></div>
        <div className="parent-page-header-content">
          <h1 className="parent-page-title">
            <FaHistory />
            Lịch sử sức khỏe
          </h1>
          <p className="parent-page-subtitle">
            Theo dõi toàn bộ lịch sử chăm sóc sức khỏe của học sinh
          </p>
        </div>
      </div> */}
      <div className={styles.header}>
        <Container>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>
              <FaClipboardList className={styles.headerIcon} />
              Lịch sử y tế
            </h1>
          </div>
        </Container>
      </div>
      <div>
        <Container>
          {/* Statistics Cards */}
          {/* <Row className="mb-4 parent-animate-slide-in">
            <Col md={4} className="mb-3">
              <div className="parent-stat-card">
                <div className="parent-stat-icon">
                  <FaStethoscope />
                </div>
                <div className="parent-stat-value">
                  {statistics.totalMedicationsSent}
                </div>
                <div className="parent-stat-label">Lượt khám</div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="parent-stat-card">
                <div
                  className="parent-stat-icon"
                  style={{ background: "#8b5cf6" }}
                >
                  <FaSyringe />
                </div>
                <div className="parent-stat-value">
                  {statistics.totalVaccinations}
                </div>
                <div className="parent-stat-label">Lượt tiêm</div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="parent-stat-card">
                <div
                  className="parent-stat-icon"
                  style={{ background: "#2563eb" }}
                >
                  <FaPills />
                </div>
                <div className="parent-stat-value">
                  {statistics.totalHealthChecks}
                </div>
                <div className="parent-stat-label">Lượt gửi thuốc</div>
              </div>
            </Col>
          </Row> */}

          {/* Main Content */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "checkup" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("checkup");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaStethoscope />
                </span>
                Khám sức khỏe
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "vaccination" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("vaccination");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaSyringe />
                </span>
                Tiêm chủng
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "chart" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("chart");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaChartBar />
                </span>
                Theo dõi
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "medication" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("medication");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaPills />
                </span>
                Gửi thuốc
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "event" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("event");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaPills />
                </span>
                Sự kiện
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "other" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab("other");
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span className={styles.tabIcon}>
                  <FaClipboardList />
                </span>
                Khác
              </button>
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
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <button
                  className={styles.clearBtn}
                  type="button"
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  <FaTimes /> Xóa bộ lọc
                </button>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <Spinner animation="border" className={styles.loadingSpinner} />
                <div className={styles.loadingText}>Đang tải dữ liệu...</div>
                <p>Vui lòng chờ trong giây lát</p>
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <FaExclamationCircle className={styles.emptyIcon} />
                <div className={styles.emptyMessage}>{error}</div>
              </div>
            ) : (
              <>
                {/* Chart Section for Chart Tab */}
                {activeTab === "chart" && (
                  <div className={styles.tableContainer}>
                    <div className={styles.chartHeader}>
                      <div className={styles.chartTitle}>
                        <FaChartBar className={styles.chartIcon} />
                        Biểu đồ phát triển chiều cao
                      </div>
                      <button
                        className={styles.chartBtn}
                        onClick={() => setShowChart(!showChart)}
                        type="button"
                      >
                        {showChart ? "Ẩn biểu đồ" : "Hiển thị biểu đồ"}
                      </button>
                    </div>
                    {showChart && (
                      <div>
                        {data.length > 0 ? (
                          <Bar
                            data={data.map((item) => ({
                              ...item,
                              date: new Date(item.date).toLocaleDateString(
                                "vi-VN"
                              ),
                              height: Number(item.height),
                            }))}
                            xField="date"
                            yField="height"
                            seriesField="studentName"
                            colorField="studentName"
                            xAxis={{ title: { text: "Ngày đo" } }}
                            yAxis={{ title: { text: "Chiều cao (cm)" } }}
                            height={320}
                            legend={{ position: "top" }}
                            barStyle={{
                              stroke: "#2563eb",
                              lineWidth: 1,
                              radius: [4, 4, 0, 0],
                            }}
                          />
                        ) : (
                          <div className={styles.emptyState}>
                            <FaChartBar className={styles.emptyIcon} />
                            <div className={styles.emptyMessage}>
                              Không có dữ liệu để hiển thị biểu đồ
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Data Table */}
                {data.length === 0 ? (
                  <div className={styles.emptyState}>
                    <FaClipboardList className={styles.emptyIcon} />
                    <div className={styles.emptyMessage}>
                      {searchTerm
                        ? "Không tìm thấy dữ liệu phù hợp với từ khóa tìm kiếm"
                        : "Chưa có dữ liệu cho tab này"}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            {activeTab === "checkup" && (
                              <>
                                <th>Ngày khám</th>
                                <th>Học sinh</th>
                                <th>Chiều cao</th>
                                <th>Cân nặng</th>

                                <th>BMI</th>
                                <th>Kết luận</th>
                                <th>Bác sĩ</th>
                                <th>Thao tác</th>
                              </>
                            )}

                            {activeTab === "vaccination" && (
                              <>
                                <th>Ngày tiêm</th>
                                <th>Học sinh</th>
                                <th>Vắc-xin</th>
                                <th>Địa điểm</th>
                                <th>Bác sĩ</th>
                                <th>Thao tác</th>
                              </>
                            )}

                            {activeTab === "chart" && (
                              <>
                                <th>Học sinh</th>
                                <th>Ngày đo</th>
                                <th>Chiều cao (cm)</th>
                              </>
                            )}

                            {activeTab === "medication" && (
                              <>
                                <th>Mã đơn</th>
                                <th>Học sinh</th>
                                <th>Thuốc</th>
                                <th>Ngày gửi</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                              </>
                            )}

                            {activeTab === "event" && (
                              <>
                                {/* <th className="text-center">
                                    <FaPills className="me-2" />
                                    STT
                                  </th> */}
                                <th>Học sinh</th>
                                <th>Sự kiện</th>
                                <th>Thời gian</th>
                                <th>Địa điểm</th>
                                <th>Y tá</th>
                                <th>Thao tác</th>
                              </>
                            )}

                            {activeTab === "other" && (
                              <>
                                <th>Học sinh</th>
                                <th>Tên kiểm tra</th>
                                <th>Ngày kiểm tra</th>
                                <th>Địa điểm</th>
                                <th>Kết luận</th>
                                <th>Y tá</th>
                                <th>Thao tác</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={item.id || index}>
                              {activeTab === "checkup" && (
                                <>
                                  <td>
                                    {new Date(item.date).toLocaleDateString(
                                      "vi-VN"
                                    )}
                                  </td>
                                  <td>{item.studentName}</td>
                                  <td>{item.height} cm</td>
                                  <td>{item.weight} kg</td>
                                  <td>{item.bmi}</td>
                                  <td>
                                    <span
                                    // className={styles.conclusionStatus + ' ' + getStatusConclusion(item.conclusion)}
                                    >
                                      {/* {item.conclusion === "Healthy"
                                        ? "Khỏe mạnh"
                                        : item.conclusion === "Sick"
                                          ? "Cần chú ý"
                                          : "Bệnh"} */}
                                      {item.conclusion}
                                    </span>
                                  </td>
                                  <td>{item.nurseName}</td>
                                  <td>
                                    <button
                                      className={styles.detailBtn}
                                      onClick={() =>
                                        handleShowDetail(item.id, "checkup")
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <FaInfoCircle
                                        style={{ marginBottom: 2 }}
                                      />{" "}
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </>
                              )}

                              {activeTab === "vaccination" && (
                                <>
                                  <td>
                                    {item.date
                                      ? new Date(item.date).toLocaleDateString(
                                          "vi-VN"
                                        )
                                      : "-"}
                                  </td>
                                  <td>{item.studentName}</td>
                                  <td>{item.vaccineName}</td>
                                  <td>{item.location}</td>
                                  <td>{item.nurseName}</td>
                                  <td>
                                    <button
                                      className={styles.detailBtn}
                                      onClick={() =>
                                        handleShowDetail(item.id, "vaccination")
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <FaInfoCircle
                                        style={{ marginBottom: 2 }}
                                      />
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </>
                              )}

                              {activeTab === "chart" && (
                                <>
                                  <td>{item.studentName}</td>
                                  <td>
                                    {item.date
                                      ? new Date(item.date).toLocaleDateString(
                                          "vi-VN"
                                        )
                                      : ""}
                                  </td>
                                  <td>{item.height}</td>
                                </>
                              )}

                              {activeTab === "medication" && (
                                <>
                                  <td>{item.id}</td>
                                  <td>{item.studentName}</td>
                                  <td>
                                    {item.medications?.map((med, idx) => (
                                      <div key={idx}>
                                        <strong>{med.medicationName}</strong> -{" "}
                                        {med.dosage}
                                      </div>
                                    ))}
                                  </td>
                                  <td>
                                    {item.createdDate
                                      ? new Date(
                                          item.createdDate
                                        ).toLocaleDateString("vi-VN")
                                      : "-"}
                                  </td>
                                  <td>
                                    <span
                                      className={getStatusClass(item.status)}
                                    >
                                      {item.status === "Active"
                                        ? "Đang sử dụng"
                                        : item.status === "Pending"
                                        ? "Chờ xác nhận"
                                        : item.status === "Completed"
                                        ? "Đã hoàn thành"
                                        : item.status}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className={styles.detailBtn}
                                      onClick={() =>
                                        handleShowMedicationDetail(item.id)
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <FaInfoCircle
                                        style={{ marginBottom: 2 }}
                                      />
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </>
                              )}
                              {/* Thêm sự kiện y tế của học sinh tại trường học */}
                              {activeTab === "event" && (
                                <>
                                  {/* <td className="text-center">{index + 1}</td> */}
                                  <td>{item.studentName}</td>
                                  <td>{item.eventType}</td>
                                  <td>{formatDateTime(item.date)}</td>
                                  <td>{item.location}</td>
                                  <td>{item.nurseName}</td>
                                  <td>
                                    <button
                                      className={styles.detailBtn}
                                      onClick={() =>
                                        handleShowDetail(item.id, "event")
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <FaInfoCircle
                                        style={{ marginBottom: 2 }}
                                      />
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </>
                              )}

                              {/* Thêm kiểm tra khác */}
                              {activeTab === "other" && (
                                <>
                                  <td>{item.studentName}</td>
                                  <td>{item.name}</td>
                                  <td>
                                    {item.date
                                      ? new Date(item.date).toLocaleDateString(
                                          "vi-VN"
                                        )
                                      : "-"}
                                  </td>
                                  <td>{item.location}</td>
                                  <td>
                                    <Badge
                                      className={
                                        styles.statusBadge +
                                        " " +
                                        getStatusConclusion(item.conclusion)
                                      }
                                    >
                                      {item.conclusion === "Healthy"
                                        ? "Khỏe mạnh"
                                        : item.conclusion === "Sick"
                                        ? "Bệnh"
                                        : item.conclusion || "Chưa có kết luận"}
                                    </Badge>
                                  </td>
                                  <td>{item.nurseName}</td>
                                  <td>
                                    <button
                                      className={styles.detailBtn}
                                      onClick={() =>
                                        handleShowDetail(item.id, "other")
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <FaInfoCircle
                                        style={{ marginBottom: 2 }}
                                      />
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div>
                        <PaginationBar
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </Container>
      </div>
      {/* Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className={styles.modal}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaStethoscope className={styles.modalTitleIcon} />
            {activeTab === "checkup"
              ? "Chi tiết khám sức khỏe"
              : activeTab === "vaccination"
              ? "Chi tiết tiêm chủng"
              : activeTab === "other"
              ? "Chi tiết kiểm tra khác"
              : "Chi tiết sự kiện"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetail ? (
            <div>
              <div></div>
              <h5>Đang tải chi tiết...</h5>
            </div>
          ) : errorDetail ? (
            <div>
              <FaExclamationCircle />
              {errorDetail}
            </div>
          ) : detail ? (
            <div>
              {activeTab === "checkup" && (
                <div>
                  <Row>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCalendarAlt /> Ngày khám:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaUserMd /> Bác sĩ:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.nurseName}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaBuilding /> Địa điểm:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaRulerVertical /> Chiều cao:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.height ? detail.height + " cm" : "N/A"}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaWeight /> Cân nặng:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.weight ? detail.weight + " kg" : "N/A"}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>BMI:</div>
                        <div className={styles.modalValue}>
                          {detail.bmi || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCheckCircle /> Kết luận:
                        </div>
                        <div className={styles.modalValue}>
                          <span className={getStatusClass(detail.conclusion)}>
                            {detail.conclusion === "Healthy"
                              ? "Khỏe mạnh"
                              : detail.conclusion === "Sick"
                              ? "Bệnh"
                              : detail.conclusion || "Chưa có kết luận"}
                          </span>
                        </div>
                      </div>
                      {detail.description && (
                        <div className={styles.modalSection}>
                          <div className={styles.modalLabel}>Ghi chú:</div>
                          <div className={styles.modalValue}>
                            {detail.description}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
              {activeTab === "vaccination" && (
                <div>
                  <Row>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCalendarAlt /> Ngày tiêm:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaUser /> Học sinh:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.studentName}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaBuilding /> Địa điểm:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaSyringe /> Vắc-xin:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.vaccineName}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCheckCircle /> Kết quả:
                        </div>
                        <div className={styles.modalValue}>
                          <span className={getStatusClass(detail.result)}>
                            {detail.result === "Successful"
                              ? "Đã tiêm"
                              : detail.result === "Pending"
                              ? "Chờ tiêm"
                              : detail.result === "Rejected"
                              ? "Đã từ chối"
                              : detail.result}
                          </span>
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaUserMd /> Y tá/Bác sĩ:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.nurseName}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
              {activeTab === "other" && (
                <div>
                  <Row>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCalendarAlt /> Ngày kiểm tra:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaClipboardList /> Tên kiểm tra:
                        </div>
                        <div className={styles.modalValue}>{detail.name}</div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaBuilding /> Địa điểm:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaUserMd /> Y tá:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.nurseName}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaCheckCircle /> Kết luận:
                        </div>
                        <div className={styles.modalValue}>
                          <span className={getStatusClass(detail.conclusion)}>
                            {detail.conclusion === "Healthy"
                              ? "Khỏe mạnh"
                              : detail.conclusion === "Sick"
                              ? "Bệnh"
                              : detail.conclusion || "Chưa có kết luận"}
                          </span>
                        </div>
                      </div>
                      {/* Danh sách kiểm tra */}
                      {detail.checkList && detail.checkList.length > 0 && (
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
                            {detail.checkList.map((item, idx) => (
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
                                {typeof item === "object" && item.value && (
                                  <span
                                    style={{
                                      marginLeft: 8,
                                      color: "#2563eb",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item.value}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {detail.description && (
                        <div className={styles.modalSection}>
                          <div className={styles.modalLabel}>Mô tả:</div>
                          <div className={styles.modalValue}>
                            {detail.description}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
              {activeTab === "event" && (
                <div>
                  <Row>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>Học sinh:</div>
                        <div className={styles.modalValue}>
                          {detail.studentName}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>Sự kiện:</div>
                        <div className={styles.modalValue}>
                          {detail.eventType}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>Thời gian:</div>
                        <div className={styles.modalValue}>
                          {detail.date
                            ? new Date(detail.date).toLocaleString("vi-VN")
                            : "-"}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>Địa điểm:</div>
                        <div className={styles.modalValue}>
                          {detail.location}
                        </div>
                      </div>
                      <div className={styles.modalSection}>
                        <div className={styles.modalLabel}>
                          <FaUserMd /> Y tá phụ trách:
                        </div>
                        <div className={styles.modalValue}>
                          {detail.nurseName || "-"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div></div>
              <h5>Đang tải chi tiết...</h5>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {(activeTab === "vaccination" || activeTab === "other") &&
            detail &&
            (!detail.resultAtHome || detail.resultAtHome.trim() === "" ? (
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  setConfirmModal({
                    show: true,
                    action: activeTab, // "vaccination" hoặc "other"
                  });
                }}
                disabled={confirmLoading || !detail.id}
              >
                {confirmLoading ? (
                  "Đang xác nhận..."
                ) : (
                  <>
                    <FaCheckCircle style={{ marginRight: 6 }} />
                    Xác nhận không có dấu hiệu
                  </>
                )}
              </button>
            ) : (
              <span className={styles.confirmedBadge}>
                <FaCheckCircle style={{ marginRight: 6 }} />
                Đã xác nhận không có dấu hiệu bất thường
              </span>
            ))}
          {/* Nút liên hệ - hiển thị cho checkup, vaccination, other, event tab */}
          {(activeTab === "checkup" ||
            activeTab === "vaccination" ||
            activeTab === "other" ||
            activeTab === "event") &&
            detail &&
            detail.nurseName && (
              <button
                className={styles.contactBtn}
                onClick={() => {
                  handleContactNurse(detail.nurseName, detail.nurseId);
                  setShowModal(false);
                }}
              >
                <FaComments style={{ marginRight: 6 }} />
                Liên hệ y tá
              </button>
            )}
          <button
            className={styles.closeBtnModern}
            onClick={() => setShowModal(false)}
          >
            <FaTimes style={{ marginRight: 6 }} />
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      {/* Medication Detail Modal */}
      <Modal
        show={showMedicationDetail}
        onHide={() => setShowMedicationDetail(false)}
        size="lg"
        centered
        className={styles.modal}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaPills className={styles.modalTitleIcon} />
            Chi tiết gửi thuốc
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMedicationDetail ? (
            <div>
              <div></div>
              <h5>Đang tải chi tiết...</h5>
            </div>
          ) : medicationDetail ? (
            <div>
              <Row>
                <Col md={6}>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>Mã lớp:</div>
                    <div className={styles.modalValue}>
                      {medicationDetail.studentClass ||
                        medicationDetail.studentClassName ||
                        "-"}
                    </div>
                  </div>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>
                      <FaUser /> Học sinh:
                    </div>
                    <div className={styles.modalValue}>
                      {medicationDetail.studentName}
                    </div>
                  </div>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>
                      <FaCalendarAlt /> Ngày gửi:
                    </div>
                    <div className={styles.modalValue}>
                      {medicationDetail.createdDate
                        ? new Date(
                            medicationDetail.createdDate
                          ).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>
                      <FaUserMd /> Y tá phụ trách:
                    </div>
                    <div className={styles.modalValue}>
                      {medicationDetail.nurseName || "-"}
                    </div>
                  </div>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>Phụ huynh:</div>
                    <div className={styles.modalValue}>
                      {medicationDetail.parentName}
                    </div>
                  </div>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>Ngày nhận:</div>
                    <div className={styles.modalValue}>
                      {medicationDetail.reviceDate
                        ? new Date(
                            medicationDetail.reviceDate
                          ).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className={styles.modalSection}>
                    <span className={getStatusClass(medicationDetail.status)}>
                      {medicationDetail.status === "Completed"
                        ? "Đã hoàn thành"
                        : medicationDetail.status === "Active"
                        ? "Đang sử dụng"
                        : medicationDetail.status === "Pending"
                        ? "Chờ xác nhận"
                        : medicationDetail.status}
                    </span>
                  </div>
                  <div className={styles.modalSection}>
                    <div className={styles.modalLabel}>
                      <FaPills /> Danh sách thuốc:
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
                      {medicationDetail.medications &&
                      medicationDetail.medications.length > 0 ? (
                        medicationDetail.medications.map((med, idx) => (
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
                              {med.medicationName}
                            </span>
                            <span style={{ marginLeft: 8 }}>{med.dosage}</span>
                            {med.note && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  color: "#2563eb",
                                  fontWeight: 400,
                                }}
                              >
                                ({med.note})
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>Không có thông tin thuốc.</li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div>Không lấy được chi tiết gửi thuốc.</div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "flex-end", gap: 12 }}>
          {/* Nút liên hệ y tá (có nurseId và nurseName) */}
          {medicationDetail?.nurseId && medicationDetail?.nurseName && (
            <button
              className={styles.actionBtn}
              onClick={() =>
                handleContactNurse(
                  medicationDetail.nurseName,
                  medicationDetail.nurseId
                )
              }
            >
              <FaComments style={{ marginRight: 6 }} />
              Liên hệ y tá
            </button>
          )}

          {/* Nút đóng */}
          <button
            className={styles.closeBtn}
            onClick={() => setShowMedicationDetail(false)}
          >
            <FaTimes /> Đóng
          </button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, action: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === "vaccination"
            ? "Xác nhận tiêm chủng"
            : "Xác nhận kiểm tra khác"
        }
        message="Bạn có chắc chắn muốn xác nhận không có dấu hiệu bất thường?"
        confirmText="Xác nhận"
        confirmVariant="success"
      />
    </div>
  );
};

export default HealthHistory;
