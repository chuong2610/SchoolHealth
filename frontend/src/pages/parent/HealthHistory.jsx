import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
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
  Alert
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
  FaClipboardList
} from "react-icons/fa";
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
  const pageSize = 8;

  // useEffect: Fetch dữ liệu khi đổi tab
  useEffect(() => {
    if (!parentId) return;
    setLoading(true);
    setError("");
    let url = "";
    if (activeTab === "checkup" || activeTab === "chart") {
      url = `http://localhost:5182/api/HealthCheck/parent/${parentId}`;
    } else if (activeTab === "vaccination") {
      url = `http://localhost:5182/api/Vaccination/parent/${parentId}`;
    } else if (activeTab === "medication") {
      url = `http://localhost:5182/api/Medication/parent/${parentId}`;
    }

    if (!url) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, activeTab]);

  // Hàm lấy chi tiết
  const handleShowDetail = async (id, type = "checkup") => {
    setShowModal(true);
    setLoadingDetail(true);
    setErrorDetail("");
    setDetail(null);

    let url = "";
    if (type === "checkup") url = `http://localhost:5182/api/HealthCheck/${id}`;
    else if (type === "vaccination") url = `http://localhost:5182/api/Vaccination/${id}`;
    else if (type === "medicine") url = `http://localhost:5182/api/MedicineUsage/${id}`;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDetail(res.data.data);
      } else {
        setErrorDetail("Không lấy được chi tiết");
      }
    } catch (err) {
      setErrorDetail("Lỗi khi lấy chi tiết");
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
      const res = await fetch(`http://localhost:5182/api/Medication/${id}`);
      const data = await res.json();
      setMedicationDetail(data.data);
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
    if (s === "completed" || s === "đã hoàn thành") return "badge-status completed";
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
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(searchLower) ||
      item.nurseName?.toLowerCase().includes(searchLower) ||
      item.conclusion?.toLowerCase().includes(searchLower) ||
      item.vaccineName?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="parent-theme">
      {/* Professional CSS Override */}
      <style>
        {`
          .health-history-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .history-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .history-header::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
            pointer-events: none !important;
          }
          
          .header-content {
            position: relative !important;
            z-index: 2 !important;
            text-align: center !important;
          }
          
          .page-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 1rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1rem !important;
          }
          
          .page-subtitle {
            font-size: 1.2rem !important;
            opacity: 0.95 !important;
            margin: 0 !important;
            font-weight: 400 !important;
          }
          
          .history-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .history-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .history-tabs {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            border-bottom: 3px solid #e5e7eb !important;
            padding: 0 !important;
          }
          
          .nav-pills .nav-link {
            background: transparent !important;
            border: 2px solid transparent !important;
            border-radius: 12px !important;
            margin: 0.5rem !important;
            padding: 1rem 1.5rem !important;
            color: #6b7280 !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .nav-pills .nav-link:hover {
            background: rgba(59, 130, 246, 0.1) !important;
            border-color: #3b82f6 !important;
            color: #3b82f6 !important;
          }
          
          .nav-pills .nav-link.active {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border-color: transparent !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3) !important;
          }
          
          .tab-content {
            padding: 2rem !important;
          }
          
          .search-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            padding: 1.5rem !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            margin-bottom: 2rem !important;
          }
          
          .search-input {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 0.75rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
            width: 100% !important;
          }
          
          .search-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .chart-section {
            background: white !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            margin-bottom: 2rem !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1) !important;
          }
          
          .data-table {
            background: white !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1) !important;
          }
          
          .table-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          .table tbody tr:hover {
            background: #f8f9fa !important;
          }
          
          .pagination-section {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 0.5rem !important;
            margin-top: 2rem !important;
          }
          
          .page-btn {
            background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
            border: none !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
          }
          
          .page-btn:hover {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            transform: translateY(-2px) !important;
          }
          
          .page-btn:disabled {
            background: #d1d5db !important;
            cursor: not-allowed !important;
            transform: none !important;
          }
          
          .action-btn {
            background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
            border: none !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .action-btn:hover {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
          }
          
          .empty-state {
            text-align: center !important;
            padding: 3rem 2rem !important;
            color: #6b7280 !important;
          }
          
          .empty-state-icon {
            font-size: 4rem !important;
            color: #d1d5db !important;
            margin-bottom: 1rem !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            
            .history-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .nav-pills .nav-link {
              margin: 0.25rem !important;
              padding: 0.75rem 1rem !important;
              font-size: 0.9rem !important;
            }
            
            .tab-content {
              padding: 1rem !important;
            }
          }
        `}
      </style>

      <div className="health-history-page">
        {/* Header */}
        <div className="history-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                <FaHistory />
                Lịch sử sức khỏe
              </h1>
              <p className="page-subtitle">
                Theo dõi toàn bộ lịch sử chăm sóc sức khỏe của học sinh
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="history-container">
          <Container>
            <Card className="history-card">
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="pills" className="history-tabs justify-content-center">
                  <Nav.Item>
                    <Nav.Link eventKey="checkup">
                      <FaStethoscope />
                      Khám sức khỏe
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="vaccination">
                      <FaSyringe />
                      Tiêm chủng
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="chart">
                      <FaChartBar />
                      Theo dõi sức khỏe
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="medication">
                      <FaPills />
                      Gửi thuốc
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="tab-content">
                  {/* Search Section */}
                  <div className="search-section">
                    <Form.Group>
                      <Form.Label className="fw-bold text-primary">
                        <FaSearch className="me-2" />
                        Tìm kiếm
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="search-input"
                        placeholder="Tìm theo tên học sinh, bác sĩ, kết luận..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </Form.Group>
                  </div>

                  {loading ? (
                    <div className="empty-state">
                      <Spinner animation="border" className="empty-state-icon" />
                      <h5>Đang tải dữ liệu...</h5>
                    </div>
                  ) : error ? (
                    <Alert variant="danger" className="text-center">
                      <FaExclamationCircle className="me-2" />
                      {error}
                    </Alert>
                  ) : (
                    <>
                      {/* Chart Section for Chart Tab */}
                      {activeTab === "chart" && (
                        <>
                          <div className="chart-section">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="mb-0 text-primary fw-bold">Biểu đồ phát triển chiều cao</h5>
                              <Button
                                variant={showChart ? "outline-primary" : "primary"}
                                onClick={() => setShowChart(!showChart)}
                              >
                                {showChart ? "Ẩn biểu đồ" : "Hiển thị biểu đồ"}
                              </Button>
                            </div>

                            {showChart && (
                              <div>
                                {data.length > 0 ? (
                                  <Bar
                                    data={data}
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
                                      stroke: "#333",
                                      lineWidth: 1,
                                      radius: [4, 4, 0, 0],
                                    }}
                                  />
                                ) : (
                                  <div className="empty-state">
                                    <FaChartBar className="empty-state-icon" />
                                    <h5>Không có dữ liệu để hiển thị biểu đồ</h5>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Data Table */}
                      <div className="data-table">
                        {filteredData.length === 0 ? (
                          <div className="empty-state">
                            <FaClipboardList className="empty-state-icon" />
                            <h5>Không có dữ liệu</h5>
                            <p>Chưa có dữ liệu cho tab này hoặc không tìm thấy kết quả phù hợp</p>
                          </div>
                        ) : (
                          <>
                            <Table responsive className="mb-0">
                              <thead className="table-header">
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
                                          {new Date(item.date).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="text-center">{item.studentName}</td>
                                        <td className="text-center">{item.height} cm</td>
                                        <td className="text-center">{item.weight} kg</td>
                                        <td className="text-center">{item.bmi}</td>
                                        <td className="text-center">
                                          <Badge className={getStatusConclusion(item.conclusion)}>
                                            {item.conclusion === "Healthy" ? "Khỏe mạnh" :
                                              item.conclusion === "Sick" ? "Bệnh" : "Cần chú ý"}
                                          </Badge>
                                        </td>
                                        <td className="text-center">{item.nurseName}</td>
                                        <td className="text-center">
                                          <Button
                                            size="sm"
                                            className="action-btn"
                                            onClick={() => handleShowDetail(item.id, "checkup")}
                                          >
                                            <FaEye />
                                            Xem
                                          </Button>
                                        </td>
                                      </>
                                    )}

                                    {activeTab === "vaccination" && (
                                      <>
                                        <td className="text-center">{item.date}</td>
                                        <td className="text-center">{item.studentName}</td>
                                        <td className="text-center">{item.vaccineName}</td>
                                        <td className="text-center">{item.location}</td>
                                        <td className="text-center">{item.nurseName}</td>
                                        <td className="text-center">
                                          <Button
                                            size="sm"
                                            className="action-btn"
                                            onClick={() => handleShowDetail(item.id, "vaccination")}
                                          >
                                            <FaEye />
                                            Xem
                                          </Button>
                                        </td>
                                      </>
                                    )}

                                    {activeTab === "chart" && (
                                      <>
                                        <td className="text-center">{item.studentName}</td>
                                        <td className="text-center">
                                          {item.date ? new Date(item.date).toLocaleDateString("vi-VN") : ""}
                                        </td>
                                        <td className="text-center">{item.height}</td>
                                      </>
                                    )}

                                    {activeTab === "medication" && (
                                      <>
                                        <td className="text-center">{item.id}</td>
                                        <td className="text-center">{item.studentName}</td>
                                        <td className="text-center">
                                          {item.medications?.map((med, idx) => (
                                            <div key={idx} className="small">
                                              <strong>{med.medicationName}</strong> - {med.dosage}
                                            </div>
                                          ))}
                                        </td>
                                        <td className="text-center">
                                          {item.createdDate ? item.createdDate.split("T")[0] : "-"}
                                        </td>
                                        <td className="text-center">
                                          <Badge className={getStatusClass(item.status)}>
                                            {item.status === "Active" ? "Đang sử dụng" :
                                              item.status === "Pending" ? "Chờ xác nhận" :
                                                item.status === "Completed" ? "Đã hoàn thành" : item.status}
                                          </Badge>
                                        </td>
                                        <td className="text-center">
                                          <Button
                                            size="sm"
                                            className="action-btn"
                                            onClick={() => handleShowMedicationDetail(item.id)}
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
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                              <div className="pagination-section">
                                <Button
                                  className="page-btn"
                                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                  disabled={currentPage === 1}
                                >
                                  <FaChevronLeft />
                                </Button>

                                <span className="mx-3">
                                  Trang {currentPage} / {totalPages}
                                </span>

                                <Button
                                  className="page-btn"
                                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                  disabled={currentPage === totalPages}
                                >
                                  <FaChevronRight />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card>
          </Container>
        </div>

        {/* Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaStethoscope className="me-2" />
              {activeTab === "checkup" ? "Chi tiết khám sức khỏe" : "Chi tiết tiêm chủng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetail ? (
              <div className="text-center p-4">
                <Spinner animation="border" />
                <p className="mt-2">Đang tải chi tiết...</p>
              </div>
            ) : errorDetail ? (
              <Alert variant="danger">
                <FaExclamationCircle className="me-2" />
                {errorDetail}
              </Alert>
            ) : detail ? (
              <div>
                {activeTab === "checkup" ? (
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Ngày khám:</strong><br />
                        {detail.date ? new Date(detail.date).toLocaleDateString("vi-VN") : ""}
                      </div>
                      <div className="mb-3">
                        <strong>Bác sĩ:</strong><br />
                        {detail.nurseName}
                      </div>
                      <div className="mb-3">
                        <strong>Địa điểm:</strong><br />
                        {detail.location}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Chiều cao:</strong><br />
                        {detail.height ? detail.height + " cm" : "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>Cân nặng:</strong><br />
                        {detail.weight ? detail.weight + " kg" : "N/A"}
                      </div>
                      <div className="mb-3">
                        <strong>BMI:</strong><br />
                        {detail.bmi || "N/A"}
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="mb-3">
                        <strong>Kết luận:</strong><br />
                        <Badge className={getStatusConclusion(detail.conclusion)}>
                          {detail.conclusion === "Healthy" ? "Khỏe mạnh" :
                            detail.conclusion === "Sick" ? "Bệnh" : "Cần chú ý"}
                        </Badge>
                      </div>
                      {detail.description && (
                        <div className="mb-3">
                          <strong>Ghi chú:</strong><br />
                          {detail.description}
                        </div>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Ngày tiêm:</strong><br />
                        {detail.date ? new Date(detail.date).toLocaleDateString("vi-VN") : ""}
                      </div>
                      <div className="mb-3">
                        <strong>Học sinh:</strong><br />
                        {detail.studentName}
                      </div>
                      <div className="mb-3">
                        <strong>Địa điểm:</strong><br />
                        {detail.location}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Vắc-xin:</strong><br />
                        {detail.vaccineName}
                      </div>
                      <div className="mb-3">
                        <strong>Kết quả:</strong><br />
                        <Badge className={getStatusVaccine(detail.result)}>
                          {detail.result === "Successful" ? "Đã tiêm" :
                            detail.result === "Pending" ? "Chờ tiêm" :
                              detail.result === "Rejected" ? "Đã từ chối" : detail.result}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <strong>Y tá/Bác sĩ:</strong><br />
                        {detail.nurseName}
                      </div>
                    </Col>
                    <Col xs={12}>
                      {detail.description && (
                        <div className="mb-3">
                          <strong>Ghi chú:</strong><br />
                          {detail.description}
                        </div>
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <FaTimes className="me-1" />
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Medication Detail Modal */}
        <Modal show={showMedicationDetail} onHide={() => setShowMedicationDetail(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPills className="me-2" />
              Chi tiết gửi thuốc
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingMedicationDetail ? (
              <div className="text-center p-4">
                <Spinner animation="border" />
                <p className="mt-2">Đang tải chi tiết...</p>
              </div>
            ) : medicationDetail ? (
              <div>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Mã lớp:</strong><br />
                      {medicationDetail.studentClass || medicationDetail.studentClassName || "-"}
                    </div>
                    <div className="mb-3">
                      <strong>Học sinh:</strong><br />
                      {medicationDetail.studentName}
                    </div>
                    <div className="mb-3">
                      <strong>Ngày gửi:</strong><br />
                      {medicationDetail.createdDate ? new Date(medicationDetail.createdDate).toLocaleDateString("vi-VN") : "-"}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Y tá phụ trách:</strong><br />
                      {medicationDetail.nurseName || "-"}
                    </div>
                    <div className="mb-3">
                      <strong>Phụ huynh:</strong><br />
                      {medicationDetail.parentName}
                    </div>
                    <div className="mb-3">
                      <strong>Ngày nhận:</strong><br />
                      {medicationDetail.reviceDate ? new Date(medicationDetail.reviceDate).toLocaleDateString("vi-VN") : "-"}
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3 text-center">
                      <Badge className={getStatusClass(medicationDetail.status)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                        {medicationDetail.status === "Completed" ? "Đã hoàn thành" :
                          medicationDetail.status === "Active" ? "Đang sử dụng" :
                            medicationDetail.status === "Pending" ? "Chờ xác nhận" : medicationDetail.status}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <strong>Danh sách thuốc:</strong>
                      <ul className="mt-2">
                        {medicationDetail.medications && medicationDetail.medications.length > 0 ? (
                          medicationDetail.medications.map((med, idx) => (
                            <li key={idx}>
                              <strong>{med.medicationName}</strong> - {med.dosage}
                              {med.note && <span className="text-muted"> ({med.note})</span>}
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
              <Alert variant="danger">Không lấy được chi tiết gửi thuốc.</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMedicationDetail(false)}>
              <FaTimes className="me-1" />
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default HealthHistory;