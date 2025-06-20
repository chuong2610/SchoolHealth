import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Card, Dropdown, Badge } from "react-bootstrap";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FaChartLine, FaFileAlt, FaDownload, FaFilter, FaPlus, FaEye, FaEdit, FaTrash, FaFilePdf, FaFileCsv, FaFileExcel, FaPrint, FaCalendarAlt, FaUser, FaChartBar, FaChartPie, FaArrowUp, FaArrowDown } from "react-icons/fa";

// Mock data for charts
const monthlyHealthData = [
  { month: 'T1', students: 1200, checkups: 850, vaccinations: 950 },
  { month: 'T2', students: 1250, checkups: 920, vaccinations: 980 },
  { month: 'T3', students: 1300, checkups: 1100, vaccinations: 1050 },
  { month: 'T4', students: 1280, checkups: 1050, vaccinations: 1020 },
  { month: 'T5', students: 1350, checkups: 1150, vaccinations: 1080 },
  { month: 'T6', students: 1400, checkups: 1200, vaccinations: 1150 }
];

const medicineUsageData = [
  { name: 'Paracetamol', used: 400, stock: 600, category: 'Giảm đau' },
  { name: 'Vitamin C', used: 300, stock: 800, category: 'Vitamin' },
  { name: 'Bandages', used: 250, stock: 350, category: 'Vật tư' },
  { name: 'Antiseptic', used: 180, stock: 420, category: 'Khử trùng' },
  { name: 'Cough Syrup', used: 120, stock: 280, category: 'Ho' }
];

const healthStatusData = [
  { name: 'Tốt', value: 65, color: '#28a745' },
  { name: 'Khá', value: 25, color: '#ffc107' },
  { name: 'Cần theo dõi', value: 8, color: '#fd7e14' },
  { name: 'Yếu', value: 2, color: '#dc3545' }
];

const reports = [
  {
    id: 1,
    name: "Báo cáo sức khỏe học sinh tháng 6/2024",
    type: "Sức khỏe",
    date: "2024-06-01",
    creator: "Nguyễn Văn Admin",
    note: "Tổng hợp sức khỏe học sinh tháng 6",
    status: "Hoàn thành",
    size: "2.5 MB",
    downloads: 45
  },
  {
    id: 2,
    name: "Thống kê thuốc & vật tư Q2/2024",
    type: "Thuốc & vật tư",
    date: "2024-06-30",
    creator: "Trần Thị Nurse",
    note: "Thống kê sử dụng thuốc và vật tư quý 2",
    status: "Đang xử lý",
    size: "1.8 MB",
    downloads: 32
  },
  {
    id: 3,
    name: "Báo cáo tiêm chủng 6 tháng đầu năm",
    type: "Tiêm chủng",
    date: "2024-06-15",
    creator: "Lê Văn Doc",
    note: "Tổng hợp tiêm chủng từ T1-T6/2024",
    status: "Hoàn thành",
    size: "3.2 MB",
    downloads: 78
  }
];

const reportTypes = ["Tất cả", "Sức khỏe", "Thuốc & vật tư", "Tiêm chủng", "Sự kiện y tế", "Khác"];

const quickStats = [
  { title: "Tổng báo cáo", value: "156", change: "+12%", trend: "up", color: "primary", icon: FaFileAlt },
  { title: "Báo cáo tháng này", value: "23", change: "+8%", trend: "up", color: "success", icon: FaChartLine },
  { title: "Lượt tải xuống", value: "2,341", change: "+25%", trend: "up", color: "info", icon: FaDownload },
  { title: "Đang xử lý", value: "5", change: "-2%", trend: "down", color: "warning", icon: FaChartBar }
];

const Reports = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editMode, setEditMode] = useState("add");
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [form, setForm] = useState({
    name: "",
    type: reportTypes[1],
    date: "",
    creator: "",
    note: "",
    template: ""
  });

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesType = filterType === "Tất cả" || report.type === filterType;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.creator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleShowAdd = () => {
    setEditMode("add");
    setForm({
      name: "",
      type: reportTypes[1],
      date: new Date().toISOString().split('T')[0],
      creator: "Nguyễn Văn Admin",
      note: "",
      template: ""
    });
    setShowEditModal(true);
  };

  const handleShowEdit = (report) => {
    setEditMode("edit");
    setForm({
      name: report.name,
      type: report.type,
      date: report.date,
      creator: report.creator,
      note: report.note || "",
      template: ""
    });
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleShowDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleSave = () => {
    console.log("Saving report:", form);
    setShowEditModal(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Hoàn thành": "success",
      "Đang xử lý": "warning",
      "Chờ duyệt": "info",
      "Lỗi": "danger"
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-reports-header">
        <div className="admin-reports-header-bg"></div>
        <div className="admin-reports-header-content">
          <div className="admin-reports-title-section">
            <h1 className="admin-reports-title">
              <FaChartLine className="me-3" />
              Báo cáo & Thống kê
            </h1>
            <p className="admin-reports-subtitle">
              Tổng hợp và phân tích dữ liệu y tế trường học
            </p>
          </div>
          <div className="admin-reports-actions">
            <Dropdown>
              <Dropdown.Toggle className="admin-btn admin-secondary-btn">
                <FaDownload className="me-2" />
                Xuất dữ liệu
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><FaFilePdf className="me-2" />Xuất PDF</Dropdown.Item>
                <Dropdown.Item><FaFileCsv className="me-2" />Xuất CSV</Dropdown.Item>
                <Dropdown.Item><FaFileExcel className="me-2" />Xuất Excel</Dropdown.Item>
                <Dropdown.Item><FaPrint className="me-2" />In báo cáo</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button
              className="admin-btn admin-primary-btn"
              onClick={handleShowAdd}
            >
              <FaPlus className="me-2" />
              Tạo báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-4 mb-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <div className="admin-stat-card">
              <div className="admin-stat-icon-container">
                <div className={`admin-stat-icon ${stat.color}`}>
                  <stat.icon />
                </div>
              </div>
              <div className="admin-stat-content">
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-title">{stat.title}</div>
                <div className={`admin-stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Dashboard */}
      <div className="row g-4 mb-4">
        {/* Health Trends Chart */}
        <div className="col-xl-8">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaChartLine className="me-2" />
                Xu hướng sức khỏe học sinh
              </h5>
            </div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyHealthData}>
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9500" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF9500" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="checkupGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="checkups" stroke="#9C27B0" fillOpacity={1} fill="url(#checkupGradient)" name="Khám sức khỏe" />
                  <Area type="monotone" dataKey="vaccinations" stroke="#FF9500" fillOpacity={1} fill="url(#healthGradient)" name="Tiêm chủng" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Health Status Pie Chart */}
        <div className="col-xl-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="admin-card-title">
                <FaChartPie className="me-2" />
                Phân bố tình trạng sức khỏe
              </h5>
            </div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {healthStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Usage Chart */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h5 className="admin-card-title">
            <FaChartLine className="me-2" />
            Thống kê sử dụng thuốc & vật tư
          </h5>
        </div>
        <div className="admin-card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={medicineUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="used" fill="#FF9500" name="Đã sử dụng" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stock" fill="#9C27B0" name="Tồn kho" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label className="admin-form-label">
                <FaFilter className="me-2" />
                Loại báo cáo
              </Form.Label>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="admin-form-control"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="admin-form-label">
                <FaCalendarAlt className="me-2" />
                Từ ngày
              </Form.Label>
              <Form.Control
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="admin-form-control"
              />
            </Col>
            <Col md={3}>
              <Form.Label className="admin-form-label">Đến ngày</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="admin-form-control"
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-control"
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Reports Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h5 className="admin-card-title">
            <FaFileAlt className="me-2" />
            Danh sách báo cáo ({filteredReports.length})
          </h5>
          <button
            className="admin-btn admin-primary-btn"
            onClick={() => setShowTemplateModal(true)}
          >
            <FaPlus className="me-2" />
            Template
          </button>
        </div>
        <div className="admin-card-body">
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên báo cáo</th>
                  <th>Loại</th>
                  <th>Ngày tạo</th>
                  <th>Người tạo</th>
                  <th>Trạng thái</th>
                  <th>Kích thước</th>
                  <th>Lượt tải</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr key={report.id}>
                    <td>{idx + 1}</td>
                    <td className="admin-table-title">{report.name}</td>
                    <td>
                      <Badge bg="info" className="admin-type-badge">
                        {report.type}
                      </Badge>
                    </td>
                    <td>{report.date.split("-").reverse().join("/")}</td>
                    <td>
                      <div className="admin-user-info">
                        <FaUser className="me-2" />
                        {report.creator}
                      </div>
                    </td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td className="admin-file-size">{report.size}</td>
                    <td className="admin-downloads">{report.downloads}</td>
                    <td>
                      <div className="admin-action-buttons">
                        <button
                          className="admin-table-btn admin-view-btn"
                          onClick={() => handleShowDetail(report)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="admin-table-btn admin-edit-btn"
                          onClick={() => handleShowEdit(report)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="admin-table-btn admin-download-btn"
                          title="Tải xuống"
                        >
                          <FaDownload />
                        </button>
                        <button
                          className="admin-table-btn admin-delete-btn"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Report Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        className="admin-modal-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            {editMode === "add" ? "Tạo báo cáo mới" : "Chỉnh sửa báo cáo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">
                  <FaFileAlt className="me-2" />
                  Tên báo cáo
                </Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên báo cáo"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">
                  <FaChartBar className="me-2" />
                  Loại báo cáo
                </Form.Label>
                <Form.Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="admin-form-control"
                >
                  {reportTypes.slice(1).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">
                  <FaCalendarAlt className="me-2" />
                  Ngày tạo
                </Form.Label>
                <Form.Control
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">
                  <FaUser className="me-2" />
                  Người tạo
                </Form.Label>
                <Form.Control
                  type="text"
                  value={form.creator}
                  onChange={(e) => setForm({ ...form, creator: e.target.value })}
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">Template báo cáo</Form.Label>
                <Form.Select
                  value={form.template}
                  onChange={(e) => setForm({ ...form, template: e.target.value })}
                  className="admin-form-control"
                >
                  <option value="">-- Chọn template --</option>
                  <option value="health-monthly">Báo cáo sức khỏe hàng tháng</option>
                  <option value="medicine-quarterly">Thống kê thuốc theo quý</option>
                  <option value="vaccination-yearly">Báo cáo tiêm chủng hàng năm</option>
                  <option value="custom">Tùy chỉnh</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="admin-form-label">Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Nhập ghi chú về báo cáo..."
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button className="admin-primary-btn" onClick={handleSave}>
            <FaFileAlt className="me-2" />
            {editMode === "add" ? "Tạo báo cáo" : "Lưu thay đổi"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Report Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        className="admin-modal-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" />
            Chi tiết báo cáo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div className="admin-report-detail">
              <div className="admin-detail-section">
                <h6 className="admin-detail-title">Thông tin cơ bản</h6>
                <Row>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Tên báo cáo:</strong>
                      <span>{selectedReport.name}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Loại:</strong>
                      <Badge bg="info">{selectedReport.type}</Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Ngày tạo:</strong>
                      <span>{selectedReport.date.split("-").reverse().join("/")}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Người tạo:</strong>
                      <span>{selectedReport.creator}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Trạng thái:</strong>
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="admin-detail-item">
                      <strong>Lượt tải xuống:</strong>
                      <span>{selectedReport.downloads}</span>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="admin-detail-section">
                <h6 className="admin-detail-title">Ghi chú</h6>
                <p className="admin-detail-note">{selectedReport.note}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          <Button className="admin-primary-btn">
            <FaDownload className="me-2" />
            Tải xuống
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Template Modal */}
      <Modal
        show={showTemplateModal}
        onHide={() => setShowTemplateModal(false)}
        className="admin-modal-reports"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            Chọn Template Báo cáo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="admin-template-grid">
            <div className="admin-template-item" onClick={() => { setShowTemplateModal(false); handleShowAdd(); }}>
              <div className="admin-template-icon">📊</div>
              <h6>Báo cáo sức khỏe</h6>
              <p>Template báo cáo tình hình sức khỏe học sinh</p>
            </div>
            <div className="admin-template-item" onClick={() => { setShowTemplateModal(false); handleShowAdd(); }}>
              <div className="admin-template-icon">💊</div>
              <h6>Thống kê thuốc</h6>
              <p>Template thống kê sử dụng thuốc và vật tư</p>
            </div>
            <div className="admin-template-item" onClick={() => { setShowTemplateModal(false); handleShowAdd(); }}>
              <div className="admin-template-icon">💉</div>
              <h6>Báo cáo tiêm chủng</h6>
              <p>Template báo cáo tình hình tiêm chủng</p>
            </div>
            <div className="admin-template-item" onClick={() => { setShowTemplateModal(false); handleShowAdd(); }}>
              <div className="admin-template-icon">📋</div>
              <h6>Báo cáo tùy chỉnh</h6>
              <p>Tạo báo cáo với template tùy chỉnh</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reports;
