import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
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
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
// Styles được import từ main.jsx

const HealthHistory = () => {
  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("checkup");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const parentId = user?.id ? Number(user.id) : undefined;

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

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;

  const fetchData = async () => {
    if (!parentId) return;
    setLoading(true);
    setError("");
    let url = "";
    if (activeTab === "checkup" || activeTab === "chart") {
      url = `/HealthCheck/parent/${parentId}?pageNumber=${currentPage}&pageSize=${pageSize}${
        searchTerm ? `&search=${searchTerm}` : ""
      }`;
    } else if (activeTab === "vaccination") {
      url = `/Vaccination/parent/${parentId}?pageNumber=${currentPage}&pageSize=${pageSize}${
        searchTerm ? `&search=${searchTerm}` : ""
      }`;
    } else if (activeTab === "medication") {
      url = `/Medication/parent/${parentId}?pageNumber=${currentPage}&pageSize=${pageSize}${
        searchTerm ? `&search=${searchTerm}` : ""
      }`;
    }

    if (!url) return;
    try {
      const response = await axiosInstance.get(url);
      setData(response.data.data.items || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      setError("Failed to load data!");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Fetch dữ liệu khi đổi tab
  useEffect(() => {
    fetchData();
  }, [parentId, activeTab, currentPage, searchTerm]);

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
  const filteredData = data;

  const paginatedData = filteredData;

  const handleChangePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="parent-container">
      {/* Page Header */}
      <div className="parent-page-header parent-animate-fade-in">
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
      </div>

      <Container>
        {/* Statistics Cards */}
        <Row className="mb-4 parent-animate-slide-in">
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon">
                <FaStethoscope />
              </div>
              <div className="parent-stat-value">
                {data.filter((item) => item.height || item.weight).length}
              </div>
              <div className="parent-stat-label">Lượt khám</div>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div
                className="parent-stat-icon"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                }}
              >
                <FaSyringe />
              </div>
              <div className="parent-stat-value">
                {data.filter((item) => item.vaccineName).length}
              </div>
              <div className="parent-stat-label">Lượt tiêm</div>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div
                className="parent-stat-icon"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                }}
              >
                <FaPills />
              </div>
              <div className="parent-stat-value">
                {
                  data.filter(
                    (item) => item.medications && item.medications.length > 0
                  ).length
                }
              </div>
              <div className="parent-stat-label">Lượt gửi thuốc</div>
            </div>
          </Col>
          {/* <Col md={3} className="mb-3">
            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
                <FaChartBar />
              </div>
              <div className="parent-stat-value">{filteredData.length}</div>
              <div className="parent-stat-label">Kết quả lọc</div>
            </div>
          </Col> */}
        </Row>

        {/* Main Content */}
        <div className="parent-card parent-animate-scale-in">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(key) => {
              setActiveTab(key);
              setCurrentPage(1); // Reset page về 1 khi đổi tab
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
                        background:
                          activeTab === "checkup"
                            ? "var(--parent-gradient-primary)"
                            : "transparent",
                        color:
                          activeTab === "checkup"
                            ? "white"
                            : "var(--parent-primary)",
                        border: `2px solid ${
                          activeTab === "checkup"
                            ? "transparent"
                            : "rgba(107, 70, 193, 0.2)"
                        }`,
                        fontWeight: "600",
                        borderRadius: "var(--parent-border-radius-lg)",
                        padding: "0.75rem 1.5rem",
                        margin: "0 0.25rem",
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
                        background:
                          activeTab === "vaccination"
                            ? "var(--parent-gradient-primary)"
                            : "transparent",
                        color:
                          activeTab === "vaccination"
                            ? "white"
                            : "var(--parent-primary)",
                        border: `2px solid ${
                          activeTab === "vaccination"
                            ? "transparent"
                            : "rgba(107, 70, 193, 0.2)"
                        }`,
                        fontWeight: "600",
                        borderRadius: "var(--parent-border-radius-lg)",
                        padding: "0.75rem 1.5rem",
                        margin: "0 0.25rem",
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
                        background:
                          activeTab === "chart"
                            ? "var(--parent-gradient-primary)"
                            : "transparent",
                        color:
                          activeTab === "chart"
                            ? "white"
                            : "var(--parent-primary)",
                        border: `2px solid ${
                          activeTab === "chart"
                            ? "transparent"
                            : "rgba(107, 70, 193, 0.2)"
                        }`,
                        fontWeight: "600",
                        borderRadius: "var(--parent-border-radius-lg)",
                        padding: "0.75rem 1.5rem",
                        margin: "0 0.25rem",
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
                        background:
                          activeTab === "medication"
                            ? "var(--parent-gradient-primary)"
                            : "transparent",
                        color:
                          activeTab === "medication"
                            ? "white"
                            : "var(--parent-primary)",
                        border: `2px solid ${
                          activeTab === "medication"
                            ? "transparent"
                            : "rgba(107, 70, 193, 0.2)"
                        }`,
                        fontWeight: "600",
                        borderRadius: "var(--parent-border-radius-lg)",
                        padding: "0.75rem 1.5rem",
                        margin: "0 0.25rem",
                        transition: "all var(--parent-transition-normal)",
                      }}
                    >
                      <FaPills className="me-2" />
                      Gửi thuốc
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>

            <Tab.Content>
              {/* Search Section */}
              <div className="parent-card-body mb-4">
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label className="parent-form-label">
                        <FaSearch className="me-2" />
                        Tìm kiếm lịch sử y tế
                      </Form.Label>
                      <div style={{ position: "relative" }}>
                        <FaSearch
                          style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--parent-primary)",
                            zIndex: 2,
                          }}
                        />
                        <Form.Control
                          type="text"
                          className="parent-form-control"
                          placeholder="Tìm theo tên học sinh, bác sĩ, kết luận, vắc-xin..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          style={{ paddingLeft: "3rem" }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      className="parent-secondary-btn w-100"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
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
                        border: "1px solid rgba(107, 70, 193, 0.1)",
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
                                stroke: "#6b46c1",
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
                  {filteredData.length === 0 ? (
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
                      <h5
                        style={{
                          color: "var(--parent-primary)",
                          fontWeight: "700",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Không có dữ liệu
                      </h5>
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
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((item, index) => (
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
                                    <td className="text-center">{item.bmi}</td>
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
                                        className="action-btn"
                                        onClick={() =>
                                          handleShowDetail(item.id, "checkup")
                                        }
                                      >
                                        <FaEye />
                                        Xem
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
                                        className="action-btn"
                                        onClick={() =>
                                          handleShowDetail(
                                            item.id,
                                            "vaccination"
                                          )
                                        }
                                      >
                                        <FaEye />
                                        Xem
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
                                          <strong>{med.medicationName}</strong>{" "}
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
                                        className={getStatusClass(item.status)}
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
                                        className="action-btn"
                                        onClick={() =>
                                          handleShowMedicationDetail(item.id)
                                        }
                                      >
                                        <FaEye />
                                        Xem
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
                        <PaginationBar
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handleChangePage}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>

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
              : "Chi tiết tiêm chủng"}
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
                          Ngày khám:
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
                            style={{
                              background:
                                detail.conclusion === "Healthy"
                                  ? "linear-gradient(135deg, #10b981, #34d399)"
                                  : detail.conclusion === "Sick"
                                  ? "linear-gradient(135deg, #ef4444, #f87171)"
                                  : "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
                            style={{
                              background:
                                detail.result === "Successful"
                                  ? "linear-gradient(135deg, #10b981, #34d399)"
                                  : detail.result === "Rejected"
                                  ? "linear-gradient(135deg, #ef4444, #f87171)"
                                  : "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
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
                      style={{
                        background:
                          medicationDetail.status === "Completed"
                            ? "linear-gradient(135deg, #10b981, #34d399)"
                            : medicationDetail.status === "Rejected"
                            ? "linear-gradient(135deg, #ef4444, #f87171)"
                            : "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
