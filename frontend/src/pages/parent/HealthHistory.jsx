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
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import { getHealthHistoryStatistics } from "../../api/parent/HealthHistoryApi";
import { useDebounce } from "use-debounce";
import { formatDateTime, formatDDMMYYYY } from "../../utils/dateFormatter";
import { toast } from "react-toastify";

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
  const pageSize = 5;
  const [statistics, setStatistics] = useState({
    totalHealthChecks: 0,
    totalVaccinations: 0,
    totalMedicationsSent: 0,
  });

  // State xác nhận tiêm chủng
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Hàm xử lý liên hệ với y tá
  const handleContactNurse = (nurseName, nurseId) => {
    navigate('/parent/chat', {
      state: {
        nurseName: nurseName,
        nurseId: nurseId,
        autoStartChat: true
      }
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
      console.error("Error fetching health history statistics:", error);
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

    const url = `${baseUrl}?pageNumber=${currentPage}&pageSize=${pageSize}` + `${debouncedSearch ? `&search=${debouncedSearch}` : ""}`;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        console.log("API response from", url, response.data);

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
    fetchHealthHistoryStats();
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

  // Hàm xác định class cho badge
  function getStatusClass(status) {
    if (!status) return "badge-status";
    const s = status.toLowerCase();
    if (s === "completed" || s === "đã hoàn thành")
      return "badge-status completed";
    if (s === "active" || s === "đang sử dụng") return "badge-status active";
    if (s === "pending" || s === "chờ xác nhận") return "badge-status pending";
    if (s === "rejected" || s === "đã từ chối") return "badge-status rejected";
    return "badge-status";
  }

  function getStatusConclusion(conclusion) {
    if (!conclusion) return "badge-status";
    const c = conclusion.toLowerCase();
    if (c === "healthy" || c === "khỏe mạnh") return "badge-status healthy";
    if (c === "sick" || c === "bệnh") return "badge-status sick";
    return "badge-status";
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
      console.error("Error filtering item:", item, e);
      return false; // Exclude item that causes an error from the results
    }
  });

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="parent-container">
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
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          marginTop: "-2rem",
          border: "1px solid #2563eb",
          borderRadius: "10px",
        }}
      >
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
          <div className="parent-card parent-animate-scale-in">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                setCurrentPage(1); // Reset page to 1 on tab switch
              }}
            >
              {/* Navigation Tabs */}
              <div className="parent-card-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h3 className="parent-card-title">
                    <FaClipboardList />
                    Lịch sử y tế
                  </h3>
                  <Nav variant="pills" className="d-flex">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="checkup"
                        style={{
                          background: activeTab === "checkup" ? "#2563eb" : "transparent",
                          color: activeTab === "checkup" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "checkup" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaStethoscope className="me-2" />
                        Khám sức khỏe
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="vaccination"
                        style={{
                          background: activeTab === "vaccination" ? "#2563eb" : "transparent",
                          color: activeTab === "vaccination" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "vaccination" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaSyringe className="me-2" />
                        Tiêm chủng
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="chart"
                        style={{
                          background: activeTab === "chart" ? "#2563eb" : "transparent",
                          color: activeTab === "chart" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "chart" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaChartBar className="me-2" />
                        Theo dõi
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="medication"
                        style={{
                          background: activeTab === "medication" ? "#2563eb" : "transparent",
                          color: activeTab === "medication" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "medication" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaPills className="me-2" />
                        Gửi thuốc
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="event"
                        style={{
                          background: activeTab === "event" ? "#2563eb" : "transparent",
                          color: activeTab === "event" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "event" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaPills className="me-2" />
                        Sự kiện
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="other"
                        style={{
                          background: activeTab === "other" ? "#2563eb" : "transparent",
                          color: activeTab === "other" ? "white" : "var(--parent-primary)",
                          border: `1.5px solid ${activeTab === "other" ? "transparent" : "rgba(37, 99, 235, 0.2)"}`,
                          fontWeight: 600,
                          borderRadius: "8px",
                          padding: "0.5rem 1.25rem",
                          margin: "0 0.15rem",
                          fontSize: "0.95rem",
                          transition: "all var(--parent-transition-normal)",
                        }}
                      >
                        <FaClipboardList className="me-2" />
                        Khác
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>

              <Tab.Content>
                {/* Search Section */}
                <div className="parent-card-body mb-4">
                  <Row className="align-items-center gx-2 mt-3">
                    <Col md={8}>
                      <Form.Group className="mb-0">
                        <div style={{ position: "relative" }}>
                          <FaSearch
                            style={{
                              position: "absolute",
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--parent-primary)",
                              zIndex: 2,
                              fontSize: "1rem"
                            }}
                          />
                          <Form.Control
                            type="text"
                            className="search-input"
                            placeholder="Tìm theo tiêu đề, nội dung thông báo..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1);
                            }}
                            style={{
                              paddingLeft: "2.2rem",
                              paddingRight: "1rem",
                              height: "40px",
                              fontSize: "0.95rem",
                              borderRadius: "8px"
                            }}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Button
                        className="parent-secondary-btn w-100"
                        style={{
                          height: "40px",
                          fontSize: "0.95rem",
                          borderRadius: "8px"
                        }}
                        onClick={() => {
                          setSearchTerm("");
                        }}
                      >
                        <FaTimes className="me-2" />
                        Xóa bộ lọc
                      </Button>
                    </Col>
                  </Row>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="parent-spinner mb-3"></div>
                    <h5
                      style={{
                        color: "var(--parent-primary)",
                        fontWeight: "600",
                      }}
                    >
                      Đang tải dữ liệu...
                    </h5>
                    <p className="text-muted">Vui lòng chờ trong giây lát</p>
                  </div>
                ) : error ? (
                  <div className="parent-alert parent-alert-danger">
                    <FaExclamationCircle className="me-2" />
                    {error}
                  </div>
                ) : (
                  <>
                    {/* Chart Section for Chart Tab */}
                    {activeTab === "chart" && (
                      <div
                        className="parent-card mb-4"
                        style={{
                          background: "white",
                          padding: "1.5rem",
                          borderRadius: "var(--parent-border-radius-xl)",
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5
                            className="mb-0"
                            style={{
                              color: "var(--parent-primary)",
                              fontWeight: "700",
                            }}
                          >
                            <FaChartBar className="me-2" />
                            Biểu đồ phát triển chiều cao
                          </h5>
                          <Button
                            className={
                              showChart
                                ? "parent-secondary-btn"
                                : "parent-primary-btn"
                            }
                            onClick={() => setShowChart(!showChart)}
                          >
                            {showChart ? "Ẩn biểu đồ" : "Hiển thị biểu đồ"}
                          </Button>
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
                                xAxis={{
                                  title: { text: "Ngày đo" },
                                }}
                                yAxis={{
                                  title: { text: "Chiều cao (cm)" },
                                }}
                                height={320}
                                legend={{ position: "top" }}
                                barStyle={{
                                  stroke: "#2563eb",
                                  lineWidth: 1,
                                  radius: [4, 4, 0, 0],
                                }}
                              />
                            ) : (
                              <div className="text-center py-5">
                                <div
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 1.5rem",
                                    fontSize: "2rem",
                                    color: "#9ca3af",
                                  }}
                                >
                                  <FaChartBar />
                                </div>
                                <h5
                                  style={{
                                    color: "var(--parent-primary)",
                                    fontWeight: "700",
                                  }}
                                >
                                  Không có dữ liệu để hiển thị biểu đồ
                                </h5>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Data Table */}
                    {data.length === 0 ? (
                      <div className="text-center py-5">
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem",
                            fontSize: "2rem",
                            color: "#9ca3af",
                          }}
                        >
                          <FaClipboardList />
                        </div>
                        {/* <h5
                          style={{
                            color: "var(--parent-primary)",
                            fontWeight: "700",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Không có dữ liệu
                        </h5> */}
                        <p className="text-muted">
                          {searchTerm
                            ? "Không tìm thấy dữ liệu phù hợp với từ khóa tìm kiếm"
                            : "Chưa có dữ liệu cho tab này"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="parent-table-container">
                          <table className="parent-table">
                            <thead>
                              <tr>
                                {activeTab === "checkup" && (
                                  <>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Ngày khám
                                    </th>
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaRulerVertical className="me-2" />
                                      Chiều cao
                                    </th>
                                    <th className="text-center">
                                      <FaWeight className="me-2" />
                                      Cân nặng
                                    </th>
                                    <th className="text-center">BMI</th>
                                    <th className="text-center">
                                      <FaCheckCircle className="me-2" />
                                      Kết luận
                                    </th>
                                    <th className="text-center">
                                      <FaUserMd className="me-2" />
                                      Bác sĩ
                                    </th>
                                    <th className="text-center">Thao tác</th>
                                  </>
                                )}

                                {activeTab === "vaccination" && (
                                  <>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Ngày tiêm
                                    </th>
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaSyringe className="me-2" />
                                      Vắc-xin
                                    </th>
                                    <th className="text-center">
                                      <FaBuilding className="me-2" />
                                      Địa điểm
                                    </th>
                                    <th className="text-center">
                                      <FaUserMd className="me-2" />
                                      Bác sĩ
                                    </th>
                                    <th className="text-center">Thao tác</th>
                                  </>
                                )}

                                {activeTab === "chart" && (
                                  <>
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Ngày đo
                                    </th>
                                    <th className="text-center">
                                      <FaRulerVertical className="me-2" />
                                      Chiều cao (cm)
                                    </th>
                                  </>
                                )}

                                {activeTab === "medication" && (
                                  <>
                                    <th className="text-center">
                                      <FaPills className="me-2" />
                                      Mã đơn
                                    </th>
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaPills className="me-2" />
                                      Thuốc
                                    </th>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Ngày gửi
                                    </th>
                                    <th className="text-center">
                                      <FaCheckCircle className="me-2" />
                                      Trạng thái
                                    </th>
                                    <th className="text-center">Thao tác</th>
                                  </>
                                )}

                                {activeTab === "event" && (
                                  <>
                                    {/* <th className="text-center">
                                      <FaPills className="me-2" />
                                      STT
                                    </th> */}
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaPills className="me-2" />
                                      Sự kiện
                                    </th>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Thời gian
                                    </th>
                                    <th className="text-center">
                                      <FaCheckCircle className="me-2" />
                                      Địa điểm
                                    </th>
                                    <th className="text-center">Y tá</th>
                                  </>
                                )}

                                {activeTab === "other" && (
                                  <>
                                    <th className="text-center">
                                      <FaUser className="me-2" />
                                      Học sinh
                                    </th>
                                    <th className="text-center">
                                      <FaClipboardList className="me-2" />
                                      Tên kiểm tra
                                    </th>
                                    <th className="text-center">
                                      <FaCalendarAlt className="me-2" />
                                      Ngày kiểm tra
                                    </th>
                                    <th className="text-center">
                                      <FaBuilding className="me-2" />
                                      Địa điểm
                                    </th>
                                    <th className="text-center">
                                      <FaCheckCircle className="me-2" />
                                      Kết luận
                                    </th>
                                    <th className="text-center">
                                      <FaUserMd className="me-2" />
                                      Y tá
                                    </th>
                                    <th className="text-center">Thao tác</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={item.id || index}>
                                  {activeTab === "checkup" && (
                                    <>
                                      <td className="text-center">
                                        {new Date(item.date).toLocaleDateString(
                                          "vi-VN"
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.height} cm
                                      </td>
                                      <td className="text-center">
                                        {item.weight} kg
                                      </td>
                                      <td className="text-center">
                                        {item.bmi}
                                      </td>
                                      <td className="text-center">
                                        <Badge
                                          className={getStatusConclusion(
                                            item.conclusion
                                          )}
                                        >
                                          {item.conclusion === "Healthy"
                                            ? "Khỏe mạnh"
                                            : item.conclusion === "Sick"
                                              ? "Bệnh"
                                              : "Cần chú ý"}
                                        </Badge>
                                      </td>
                                      <td className="text-center">
                                        {item.nurseName}
                                      </td>
                                      <td className="text-center">
                                        <Button
                                          size="sm"
                                          className="parent-primary-btn"
                                          onClick={() =>
                                            handleShowDetail(item.id, "checkup")
                                          }
                                          title="Xem chi tiết"
                                        >
                                          <FaEye className="me-1" />
                                          Chi tiết
                                        </Button>
                                      </td>
                                    </>
                                  )}

                                  {activeTab === "vaccination" && (
                                    <>
                                      <td className="text-center">
                                        {item.date
                                          ? new Date(
                                            item.date
                                          ).toLocaleDateString("vi-VN")
                                          : "-"}
                                      </td>
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.vaccineName}
                                      </td>
                                      <td className="text-center">
                                        {item.location}
                                      </td>
                                      <td className="text-center">
                                        {item.nurseName}
                                      </td>
                                      <td className="text-center">
                                        <Button
                                          size="sm"
                                          className="parent-primary-btn"
                                          onClick={() =>
                                            handleShowDetail(
                                              item.id,
                                              "vaccination"
                                            )
                                          }
                                          title="Xem chi tiết"
                                        >
                                          <FaEye className="me-1" />
                                          Chi tiết
                                        </Button>
                                      </td>
                                    </>
                                  )}

                                  {activeTab === "chart" && (
                                    <>
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.date
                                          ? new Date(
                                            item.date
                                          ).toLocaleDateString("vi-VN")
                                          : ""}
                                      </td>
                                      <td className="text-center">
                                        {item.height}
                                      </td>
                                    </>
                                  )}

                                  {activeTab === "medication" && (
                                    <>
                                      <td className="text-center">{item.id}</td>
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.medications?.map((med, idx) => (
                                          <div key={idx} className="small">
                                            <strong>
                                              {med.medicationName}
                                            </strong>{" "}
                                            - {med.dosage}
                                          </div>
                                        ))}
                                      </td>
                                      <td className="text-center">
                                        {item.createdDate
                                          ? new Date(
                                            item.createdDate
                                          ).toLocaleDateString("vi-VN")
                                          : "-"}
                                      </td>
                                      <td className="text-center">
                                        <Badge
                                          className={getStatusClass(
                                            item.status
                                          )}
                                        >
                                          {item.status === "Active"
                                            ? "Đang sử dụng"
                                            : item.status === "Pending"
                                              ? "Chờ xác nhận"
                                              : item.status === "Completed"
                                                ? "Đã hoàn thành"
                                                : item.status}
                                        </Badge>
                                      </td>
                                      <td className="text-center">
                                        <Button
                                          size="sm"
                                          className="parent-primary-btn"
                                          onClick={() =>
                                            handleShowMedicationDetail(item.id)
                                          }
                                          title="Xem chi tiết"
                                        >
                                          <FaEye className="me-1" />
                                          Chi tiết
                                        </Button>
                                      </td>
                                    </>
                                  )}
                                  {/* Thêm sự kiện y tế của học sinh tại trường học */}
                                  {activeTab === "event" && (
                                    <>
                                      {/* <td className="text-center">{index + 1}</td> */}
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.eventType}
                                      </td>
                                      <td className="text-center">
                                        {formatDateTime(item.date)}
                                      </td>
                                      <td className="text-center">
                                        {item.location}
                                      </td>
                                      <td className="text-center">
                                        {item.nurseName}
                                      </td>
                                    </>
                                  )}

                                  {/* Thêm kiểm tra khác */}
                                  {activeTab === "other" && (
                                    <>
                                      <td className="text-center">
                                        {item.studentName}
                                      </td>
                                      <td className="text-center">
                                        {item.name}
                                      </td>
                                      <td className="text-center">
                                        {item.date
                                          ? new Date(item.date).toLocaleDateString("vi-VN")
                                          : "-"}
                                      </td>
                                      <td className="text-center">
                                        {item.location}
                                      </td>
                                      <td className="text-center">
                                        <Badge className={getStatusConclusion(item.conclusion)}>
                                          {item.conclusion === "Healthy"
                                            ? "Khỏe mạnh"
                                            : item.conclusion === "Sick"
                                              ? "Bệnh"
                                              : item.conclusion || "Chưa có kết luận"}
                                        </Badge>
                                      </td>
                                      <td className="text-center">
                                        {item.nurseName}
                                      </td>
                                      <td className="text-center">
                                        <Button
                                          size="sm"
                                          className="parent-primary-btn"
                                          onClick={() =>
                                            handleShowDetail(item.id, "other")
                                          }
                                          title="Xem chi tiết"
                                        >
                                          <FaEye className="me-1" />
                                          Chi tiết
                                        </Button>
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
                  </>
                )}
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
      </div>
      {/* Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="parent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStethoscope className="me-2" />
            {activeTab === "checkup"
              ? "Chi tiết khám sức khỏe"
              : activeTab === "vaccination"
                ? "Chi tiết tiêm chủng"
                : "Chi tiết kiểm tra khác"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetail ? (
            <div className="text-center py-5">
              <div className="parent-spinner mb-3"></div>
              <h5 style={{ color: "var(--parent-primary)", fontWeight: "600" }}>
                Đang tải chi tiết...
              </h5>
            </div>
          ) : errorDetail ? (
            <div className="parent-alert parent-alert-danger">
              <FaExclamationCircle className="me-2" />
              {errorDetail}
            </div>
          ) : detail ? (
            <div>
              {activeTab === "checkup" ? (
                <div
                  style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "var(--parent-border-radius-lg)",
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                    boxShadow: "var(--parent-shadow-sm)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "#2563eb",
                    }}
                  ></div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaCalendarAlt className="me-2" />
                          Ngày khám:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background: "#f8fafc",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(37, 99, 235, 0.1)",
                          }}
                        >
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaUserMd className="me-2" />
                          Bác sĩ:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.nurseName}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaBuilding className="me-2" />
                          Địa điểm:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                          }}
                        >
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaRulerVertical className="me-2" />
                          Chiều cao:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.height ? detail.height + " cm" : "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaWeight className="me-2" />
                          Cân nặng:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.weight ? detail.weight + " kg" : "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          BMI:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.bmi || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="mb-3 text-center">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaCheckCircle className="me-2" />
                          Kết luận:
                        </strong>
                        <div className="mt-2">
                          <Badge
                            className={`badge-status ${detail.conclusion === "Healthy"
                              ? "healthy"
                              : detail.conclusion === "Sick"
                                ? "sick"
                                : "pending"
                              }`}
                            style={{
                              background:
                                detail.conclusion === "Healthy"
                                  ? "#059669"
                                  : detail.conclusion === "Sick"
                                    ? "#dc2626"
                                    : "#F59E0B",
                              color: "white",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "var(--parent-border-radius-lg)",
                              fontWeight: "600",
                              fontSize: "1rem",
                              border: "none",
                            }}
                          >
                            {detail.conclusion === "Healthy"
                              ? "Khỏe mạnh"
                              : detail.conclusion === "Sick"
                                ? "Bệnh"
                                : "Cần chú ý"}
                          </Badge>
                        </div>
                      </div>
                      {detail.description && (
                        <div className="mb-3">
                          <strong style={{ color: "var(--parent-primary)" }}>
                            Ghi chú:
                          </strong>
                          <div
                            style={{
                              marginTop: "0.5rem",
                              padding: "1rem",
                              background:
                                "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                              borderRadius: "var(--parent-border-radius-md)",
                              border: "1px solid rgba(107, 70, 193, 0.1)",
                              lineHeight: "1.6",
                            }}
                          >
                            {detail.description}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              ) : (
                <div
                  style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "var(--parent-border-radius-lg)",
                    border: "1px solid rgba(107, 70, 193, 0.1)",
                    boxShadow: "var(--parent-shadow-sm)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "var(--parent-gradient-primary)",
                    }}
                  ></div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaCalendarAlt className="me-2" />
                          Ngày tiêm:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                          }}
                        >
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaUser className="me-2" />
                          Học sinh:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.studentName}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaBuilding className="me-2" />
                          Địa điểm:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                          }}
                        >
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaSyringe className="me-2" />
                          Vắc-xin:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.vaccineName}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          Kết quả:
                        </strong>
                        <div className="mt-2">
                          <Badge
                            className={`badge-status ${detail.result === "Successful"
                              ? "successful"
                              : detail.result === "Rejected"
                                ? "rejected"
                                : "pending"
                              }`}
                            style={{
                              background:
                                detail.result === "Successful"
                                  ? "#059669"
                                  : detail.result === "Rejected"
                                    ? "#dc2626"
                                    : "#F59E0B",
                              color: "white",
                              padding: "0.5rem 1rem",
                              borderRadius: "var(--parent-border-radius-lg)",
                              fontWeight: "600",
                              border: "none",
                            }}
                          >
                            {detail.result === "Successful"
                              ? "Đã tiêm"
                              : detail.result === "Pending"
                                ? "Chờ tiêm"
                                : detail.result === "Rejected"
                                  ? "Đã từ chối"
                                  : detail.result}
                          </Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaUserMd className="me-2" />Y tá/Bác sĩ:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.nurseName}
                        </div>
                      </div>
                    </Col>
                    {detail.description && (
                      <Col xs={12}>
                        <div className="mb-3">
                          <strong style={{ color: "var(--parent-primary)" }}>
                            Ghi chú:
                          </strong>
                          <div
                            style={{
                              marginTop: "0.5rem",
                              padding: "1rem",
                              background:
                                "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                              borderRadius: "var(--parent-border-radius-md)",
                              border: "1px solid rgba(107, 70, 193, 0.1)",
                              lineHeight: "1.6",
                            }}
                          >
                            {detail.description}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              )}
              {activeTab === "other" ? (
                <div
                  style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "var(--parent-border-radius-lg)",
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                    boxShadow: "var(--parent-shadow-sm)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "#2563eb",
                    }}
                  ></div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaCalendarAlt className="me-2" />
                          Ngày kiểm tra:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background: "#f8fafc",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(37, 99, 235, 0.1)",
                          }}
                        >
                          {detail.date
                            ? new Date(detail.date).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaClipboardList className="me-2" />
                          Tên kiểm tra:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.name}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaBuilding className="me-2" />
                          Địa điểm:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                          }}
                        >
                          {detail.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaUserMd className="me-2" />
                          Y tá:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                            fontWeight: "600",
                          }}
                        >
                          {detail.nurseName}
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          Kết quả tại nhà:
                        </strong>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.75rem",
                            background:
                              "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                            borderRadius: "var(--parent-border-radius-md)",
                            border: "1px solid rgba(107, 70, 193, 0.1)",
                          }}
                        >
                          {detail.resultAtHome || "Chưa có"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="mb-3 text-center">
                        <strong style={{ color: "var(--parent-primary)" }}>
                          <FaCheckCircle className="me-2" />
                          Kết luận:
                        </strong>
                        <div className="mt-2">
                          <Badge
                            className={`badge-status ${detail.conclusion === "Healthy"
                              ? "healthy"
                              : detail.conclusion === "Sick"
                                ? "sick"
                                : "pending"
                              }`}
                            style={{
                              background:
                                detail.conclusion === "Healthy"
                                  ? "#059669"
                                  : detail.conclusion === "Sick"
                                    ? "#dc2626"
                                    : "#F59E0B",
                              color: "white",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "var(--parent-border-radius-lg)",
                              fontWeight: "600",
                              fontSize: "1rem",
                              border: "none",
                            }}
                          >
                            {detail.conclusion === "Healthy"
                              ? "Khỏe mạnh"
                              : detail.conclusion === "Sick"
                                ? "Bệnh"
                                : detail.conclusion || "Chưa có kết luận"}
                          </Badge>
                        </div>
                      </div>

                      {/* Danh sách kiểm tra */}
                      {detail.checkList && detail.checkList.length > 0 && (
                        <div className="mb-3">
                          <strong style={{ color: "var(--parent-primary)" }}>
                            <FaClipboardList className="me-2" />
                            Danh sách kiểm tra:
                          </strong>
                          <div
                            style={{
                              marginTop: "0.5rem",
                              padding: "1rem",
                              background:
                                "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                              borderRadius: "var(--parent-border-radius-md)",
                              border: "1px solid rgba(107, 70, 193, 0.1)",
                            }}
                          >
                            {detail.checkList.map((item, index) => (
                              <div key={index} className="d-flex justify-content-between mb-2">
                                <span style={{ fontWeight: "600" }}>{item.name}:</span>
                                <span>{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {detail.description && (
                        <div className="mb-3">
                          <strong style={{ color: "var(--parent-primary)" }}>
                            Mô tả:
                          </strong>
                          <div
                            style={{
                              marginTop: "0.5rem",
                              padding: "1rem",
                              background:
                                "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                              borderRadius: "var(--parent-border-radius-md)",
                              border: "1px solid rgba(107, 70, 193, 0.1)",
                              lineHeight: "1.6",
                            }}
                          >
                            {detail.description}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              ) : null}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {/* Nút xác nhận tiêm chủng - chỉ hiển thị cho vaccination */}
          {activeTab === "vaccination" && detail && (
            (!detail.resultAtHome || detail.resultAtHome.trim() === "") ? (
              <Button
                className="parent-primary-btn"
                onClick={() => handleConfirmVaccination(detail.id)}
                disabled={confirmLoading || !detail.id}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  borderRadius: "var(--parent-border-radius-lg)",
                  marginRight: "0.5rem",
                  background: "#059669",
                  border: "none"
                }}
              >
                {confirmLoading ? "Đang xác nhận..." : "Xác nhận không có dấu hiệu"}
              </Button>
            ) : (
              <Button
                className="parent-primary-btn"
                disabled
                style={{
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  borderRadius: "var(--parent-border-radius-lg)",
                  marginRight: "0.5rem",
                  background: "#059669",
                  border: "none",
                  cursor: "not-allowed",
                  opacity: 1
                }}
              >
                Đã xác nhận không có dấu hiệu bất thường
              </Button>
            )
          )}
          {/* Nút liên hệ - hiển thị cho checkup, vaccination và other tab */}
          {((activeTab === "checkup" || activeTab === "vaccination" || activeTab === "other") && detail && detail.nurseName) && (
            <Button
              className="parent-primary-btn"
              onClick={() => {
                handleContactNurse(detail.nurseName, detail.nurseId);
                setShowModal(false);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
                borderRadius: "var(--parent-border-radius-lg)",
                marginRight: "0.5rem",
              }}
            >
              <FaComments className="me-1" />
              Liên hệ y tá
            </Button>
          )}
          <Button
            className="parent-secondary-btn"
            onClick={() => setShowModal(false)}
            style={{
              padding: "0.75rem 1.5rem",
              fontWeight: "600",
              borderRadius: "var(--parent-border-radius-lg)",
            }}
          >
            <FaTimes className="me-1" />
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Medication Detail Modal */}
      <Modal
        show={showMedicationDetail}
        onHide={() => setShowMedicationDetail(false)}
        size="lg"
        centered
        className="parent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPills className="me-2" />
            Chi tiết gửi thuốc
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMedicationDetail ? (
            <div className="text-center py-5">
              <div className="parent-spinner mb-3"></div>
              <h5 style={{ color: "var(--parent-primary)", fontWeight: "600" }}>
                Đang tải chi tiết...
              </h5>
            </div>
          ) : medicationDetail ? (
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "var(--parent-border-radius-lg)",
                border: "1px solid rgba(107, 70, 193, 0.1)",
                boxShadow: "var(--parent-shadow-sm)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--parent-gradient-primary)",
                }}
              ></div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      Mã lớp:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                      }}
                    >
                      {medicationDetail.studentClass ||
                        medicationDetail.studentClassName ||
                        "-"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      <FaUser className="me-2" />
                      Học sinh:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                        fontWeight: "600",
                      }}
                    >
                      {medicationDetail.studentName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      <FaCalendarAlt className="me-2" />
                      Ngày gửi:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                      }}
                    >
                      {medicationDetail.createdDate
                        ? new Date(
                          medicationDetail.createdDate
                        ).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      <FaUserMd className="me-2" />Y tá phụ trách:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                        fontWeight: "600",
                      }}
                    >
                      {medicationDetail.nurseName || "-"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      Phụ huynh:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                        fontWeight: "600",
                      }}
                    >
                      {medicationDetail.parentName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      Ngày nhận:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                      }}
                    >
                      {medicationDetail.reviceDate
                        ? new Date(
                          medicationDetail.reviceDate
                        ).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="mb-3 text-center">
                    <Badge
                      className={`badge-status ${medicationDetail.status === "Completed"
                        ? "completed"
                        : medicationDetail.status === "Rejected"
                          ? "rejected"
                          : medicationDetail.status === "Active"
                            ? "active"
                            : "pending"
                        }`}
                      style={{
                        background:
                          medicationDetail.status === "Completed"
                            ? "#059669"
                            : medicationDetail.status === "Rejected"
                              ? "#dc2626"
                              : "#F59E0B",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "var(--parent-border-radius-lg)",
                        fontWeight: "600",
                        fontSize: "1rem",
                        border: "none",
                      }}
                    >
                      {medicationDetail.status === "Completed"
                        ? "Đã hoàn thành"
                        : medicationDetail.status === "Active"
                          ? "Đang sử dụng"
                          : medicationDetail.status === "Pending"
                            ? "Chờ xác nhận"
                            : medicationDetail.status}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <strong style={{ color: "var(--parent-primary)" }}>
                      <FaPills className="me-2" />
                      Danh sách thuốc:
                    </strong>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "1rem",
                        background:
                          "linear-gradient(135deg, #faf7ff 0%, #f9fafb 100%)",
                        borderRadius: "var(--parent-border-radius-md)",
                        border: "1px solid rgba(107, 70, 193, 0.1)",
                      }}
                    >
                      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                        {medicationDetail.medications &&
                          medicationDetail.medications.length > 0 ? (
                          medicationDetail.medications.map((med, idx) => (
                            <li key={idx} style={{ marginBottom: "0.5rem" }}>
                              <strong>{med.medicationName}</strong> -{" "}
                              {med.dosage}
                              {med.note && (
                                <span className="text-muted">
                                  {" "}
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
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="parent-alert parent-alert-danger">
              Không lấy được chi tiết gửi thuốc.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Nút liên hệ - hiển thị cho medication detail nếu có thông tin y tá */}
          {medicationDetail && medicationDetail.nurseName && (
            <Button
              className="parent-primary-btn"
              onClick={() => {
                handleContactNurse(medicationDetail.nurseName, medicationDetail.nurseId);
                setShowMedicationDetail(false);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
                borderRadius: "var(--parent-border-radius-lg)",
                marginRight: "0.5rem",
              }}
            >
              <FaComments className="me-1" />
              Liên hệ y tá
            </Button>
          )}
          <Button
            className="parent-secondary-btn"
            onClick={() => setShowMedicationDetail(false)}
            style={{
              padding: "0.75rem 1.5rem",
              fontWeight: "600",
              borderRadius: "var(--parent-border-radius-lg)",
            }}
          >
            <FaTimes className="me-1" />
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HealthHistory;
