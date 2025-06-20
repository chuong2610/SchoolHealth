import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Badge,
  InputGroup,
  Form,
  Modal,
  Row,
  Col,
  Alert,
  Dropdown,
  Spinner,
  Tabs,
  Tab
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPills,
  FaUser,
  FaGraduationCap,
  FaStethoscope,
  FaChartLine,
  FaCalendarWeek,
  FaPlay,
  FaPause,
  FaStop
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
// Styles được import từ main.jsx
// Styles được import từ main.jsx

const MedicinePlan = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      title: "Kế hoạch thuốc tháng 3",
      description: "Phân phối thuốc cho học sinh lớp 10-12",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      status: "Đang thực hiện",
      progress: 65,
      totalStudents: 150,
      completedStudents: 98,
      medicines: [
        { name: "Vitamin C", quantity: 300, distributed: 195 },
        { name: "Paracetamol", quantity: 100, distributed: 65 }
      ],
      createdBy: "Admin",
      priority: "Cao"
    },
    {
      id: 2,
      title: "Chương trình bổ sung vitamin",
      description: "Hỗ trợ vitamin cho học sinh nhỏ tuổi",
      startDate: "2024-02-15",
      endDate: "2024-04-15",
      status: "Hoàn thành",
      progress: 100,
      totalStudents: 80,
      completedStudents: 80,
      medicines: [
        { name: "Vitamin D", quantity: 160, distributed: 160 },
        { name: "Canxi", quantity: 80, distributed: 80 }
      ],
      createdBy: "Y tá trưởng",
      priority: "Trung bình"
    },
    {
      id: 3,
      title: "Kế hoạch thuốc khẩn cấp",
      description: "Dự phòng cho mùa dịch",
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      status: "Chờ duyệt",
      progress: 0,
      totalStudents: 200,
      completedStudents: 0,
      medicines: [
        { name: "Thuốc kháng sinh", quantity: 100, distributed: 0 },
        { name: "Thuốc hạ sốt", quantity: 150, distributed: 0 }
      ],
      createdBy: "Admin",
      priority: "Khẩn cấp"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTab, setActiveTab] = useState("list");

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Chờ duyệt",
    priority: "Trung bình",
    totalStudents: 0,
    medicines: []
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
  };

  // Data processing
  const getStats = () => {
    const total = plans.length;
    const active = plans.filter(p => p.status === "Đang thực hiện").length;
    const completed = plans.filter(p => p.status === "Hoàn thành").length;
    const pending = plans.filter(p => p.status === "Chờ duyệt").length;

    return { total, active, completed, pending };
  };

  const getProgressData = () => {
    return plans.map(plan => ({
      name: plan.title.substring(0, 20) + (plan.title.length > 20 ? '...' : ''),
      progress: plan.progress,
      completed: plan.completedStudents,
      total: plan.totalStudents
    }));
  };

  const getPriorityData = () => {
    const priorityCount = {};
    plans.forEach(plan => {
      priorityCount[plan.priority] = (priorityCount[plan.priority] || 0) + 1;
    });

    return Object.entries(priorityCount).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#dc3545', '#ffc107', '#28a745'];
  const PRIORITY_COLORS = { 'Khẩn cấp': '#dc3545', 'Cao': '#fd7e14', 'Trung bình': '#ffc107', 'Thấp': '#28a745' };

  // Filter plans
  const filteredPlans = plans
    .filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(search.toLowerCase()) ||
        plan.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || plan.status === filterStatus;
      const matchesPriority = filterPriority === "all" || plan.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

  const handleShowModal = (type, plan = null) => {
    setModalType(type);
    if (plan) {
      setFormData({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
        priority: plan.priority,
        totalStudents: plan.totalStudents,
        medicines: plan.medicines
      });
    } else {
      setFormData({
        id: null,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Chờ duyệt",
        priority: "Trung bình",
        totalStudents: 0,
        medicines: []
      });
    }
    setShowModal(true);
  };

  const handleSavePlan = () => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề kế hoạch!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (modalType === "add") {
        const newPlan = {
          ...formData,
          id: Date.now(),
          progress: 0,
          completedStudents: 0,
          createdBy: "Admin"
        };
        setPlans([...plans, newPlan]);
      } else {
        setPlans(plans.map(plan =>
          plan.id === formData.id ? { ...plan, ...formData } : plan
        ));
      }

      setShowModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleDeletePlan = () => {
    if (planToDelete) {
      setPlans(plans.filter(plan => plan.id !== planToDelete.id));
      setShowDeleteModal(false);
      setPlanToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Chờ duyệt": "warning",
      "Đang thực hiện": "primary",
      "Hoàn thành": "success",
      "Tạm dừng": "secondary",
      "Hủy bỏ": "danger"
    };
    const icons = {
      "Chờ duyệt": <FaClock className="me-1" />,
      "Đang thực hiện": <FaPlay className="me-1" />,
      "Hoàn thành": <FaCheckCircle className="me-1" />,
      "Tạm dừng": <FaPause className="me-1" />,
      "Hủy bỏ": <FaStop className="me-1" />
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {icons[status]}{status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      "Khẩn cấp": "danger",
      "Cao": "warning",
      "Trung bình": "info",
      "Thấp": "success"
    };
    return <Badge bg={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const stats = getStats();
  const progressData = getProgressData();
  const priorityData = getPriorityData();

  return (
    <div className="admin-theme">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="admin-container"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="accounts-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="accounts-title mb-2">
                <FaCalendarAlt className="me-3" />
                Kế hoạch thuốc
              </h1>
              <p className="accounts-subtitle mb-0">
                Lập và quản lý kế hoạch phân phối thuốc cho học sinh
              </p>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="btn-primary me-2"
                onClick={() => handleShowModal("add")}
              >
                <FaPlus className="me-2" />
                Tạo kế hoạch
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                  <FaDownload className="me-2" />
                  Xuất báo cáo
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Xuất Excel</Dropdown.Item>
                  <Dropdown.Item>Xuất PDF</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-primary mb-2">
                <FaCalendarAlt size={24} />
              </div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng kế hoạch</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-info mb-2">
                <FaPlay size={24} />
              </div>
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Đang thực hiện</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-success mb-2">
                <FaCheckCircle size={24} />
              </div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Hoàn thành</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-warning mb-2">
                <FaClock size={24} />
              </div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Chờ duyệt</div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-md-8">
            <Card className="chart-card h-100">
              <Card.Header>
                <h5 className="mb-0">Tiến độ thực hiện kế hoạch</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#2563eb" name="Tiến độ (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="chart-card h-100">
              <Card.Header>
                <h5 className="mb-0">Độ ưu tiên</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#6c757d'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="nav-pills mb-4">
            <Tab eventKey="list" title={<><FaCalendarAlt className="me-2" />Danh sách</>}>
              {/* Controls */}
              <div className="search-filter-bar mb-4">
                <Row className="align-items-center">
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Tìm kiếm kế hoạch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Đang thực hiện">Đang thực hiện</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="all">Tất cả mức độ</option>
                      <option value="Khẩn cấp">Khẩn cấp</option>
                      <option value="Cao">Cao</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Thấp">Thấp</option>
                    </Form.Select>
                  </Col>
                </Row>
              </div>

              {/* Plans Table */}
              <div className="plan-table-wrapper">
                <div className="plan-table-header">
                  <div className="plan-table-row header-row">
                    <div className="plan-cell title-cell">
                      <span>Kế hoạch</span>
                    </div>
                    <div className="plan-cell period-cell">
                      <span>Thời gian</span>
                    </div>
                    <div className="plan-cell progress-cell">
                      <span>Tiến độ</span>
                    </div>
                    <div className="plan-cell students-cell">
                      <span>Học sinh</span>
                    </div>
                    <div className="plan-cell medicines-cell">
                      <span>Thuốc</span>
                    </div>
                    <div className="plan-cell priority-cell">
                      <span>Ưu tiên</span>
                    </div>
                    <div className="plan-cell status-cell">
                      <span>Trạng thái</span>
                    </div>
                    <div className="plan-cell action-cell">
                      <span>Thao tác</span>
                    </div>
                  </div>
                </div>

                <div className="plan-table-body">
                  <AnimatePresence>
                    {filteredPlans.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        className="plan-table-row data-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="plan-cell title-cell">
                          <div className="plan-info">
                            <div className="plan-icon">
                              <FaCalendarAlt />
                            </div>
                            <div className="plan-details">
                              <div className="plan-title">{plan.title}</div>
                              <div className="plan-description">{plan.description}</div>
                            </div>
                          </div>
                        </div>

                        <div className="plan-cell period-cell">
                          <div className="period-info">
                            <div className="period-start">
                              <FaCalendarWeek className="me-1" />
                              {new Date(plan.startDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="period-end">
                              → {new Date(plan.endDate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        <div className="plan-cell progress-cell">
                          <div className="progress-info">
                            <div className="progress-bar-wrapper">
                              <div
                                className={`progress-bar ${plan.progress === 100 ? 'success' : plan.progress > 50 ? 'primary' : 'warning'}`}
                                style={{ width: `${plan.progress}%` }}
                              ></div>
                            </div>
                            <div className="progress-text">{plan.progress}%</div>
                          </div>
                        </div>

                        <div className="plan-cell students-cell">
                          <div className="students-info">
                            <div className="students-count">
                              <FaGraduationCap className="me-1" />
                              {plan.completedStudents}/{plan.totalStudents}
                            </div>
                            <div className="students-label">học sinh</div>
                          </div>
                        </div>

                        <div className="plan-cell medicines-cell">
                          <div className="medicines-info">
                            <div className="medicines-count">
                              <FaPills className="me-1" />
                              {plan.medicines.length}
                            </div>
                            <div className="medicines-label">loại thuốc</div>
                          </div>
                        </div>

                        <div className="plan-cell priority-cell">
                          <span className={`priority-badge ${plan.priority.toLowerCase().replace(' ', '-')}`}>
                            {plan.priority === "Khẩn cấp" && <FaExclamationTriangle />}
                            {plan.priority}
                          </span>
                        </div>

                        <div className="plan-cell status-cell">
                          <span className={`status-badge ${plan.status.toLowerCase().replace(' ', '-')}`}>
                            {plan.status === "Chờ duyệt" && <FaClock />}
                            {plan.status === "Đang thực hiện" && <FaPlay />}
                            {plan.status === "Hoàn thành" && <FaCheckCircle />}
                            {plan.status === "Tạm dừng" && <FaPause />}
                            {plan.status === "Hủy bỏ" && <FaStop />}
                            {plan.status}
                          </span>
                        </div>

                        <div className="plan-cell action-cell">
                          <div className="action-buttons">
                            <button className="action-btn view-btn" title="Xem chi tiết">
                              <FaEye />
                            </button>
                            <button
                              className="action-btn edit-btn"
                              title="Chỉnh sửa"
                              onClick={() => handleShowModal("edit", plan)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Xóa"
                              onClick={() => {
                                setPlanToDelete(plan);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredPlans.length === 0 && (
                    <div className="empty-state">
                      <FaCalendarAlt className="empty-icon" />
                      <h5>Không tìm thấy kế hoạch nào</h5>
                      <p>Thử thay đổi bộ lọc hoặc tạo kế hoạch mới</p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            <Tab eventKey="calendar" title={<><FaCalendarWeek className="me-2" />Lịch</>}>
              <Card className="chart-card">
                <Card.Header>
                  <h5 className="mb-0">Lịch thực hiện kế hoạch</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-5">
                    <FaCalendarWeek size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Tính năng lịch đang phát triển</h5>
                    <p className="text-muted">Sẽ sớm có mặt trong phiên bản tiếp theo</p>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </motion.div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "add" ? "Tạo kế hoạch mới" : "Chỉnh sửa kế hoạch"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề kế hoạch *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tiêu đề kế hoạch"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Độ ưu tiên</Form.Label>
                    <Form.Select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Thấp">Thấp</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Cao">Cao</option>
                      <option value="Khẩn cấp">Khẩn cấp</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả kế hoạch"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày bắt đầu</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày kết thúc</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số học sinh</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={formData.totalStudents}
                      onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 0 })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleSavePlan}
              disabled={loading}
            >
              {loading && <Spinner animation="border" size="sm" className="me-2" />}
              {modalType === "add" ? "Tạo kế hoạch" : "Cập nhật"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Bạn có chắc chắn muốn xóa kế hoạch <strong>{planToDelete?.title}</strong>?</p>
            <Alert variant="warning">
              <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị mất.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeletePlan}>
              Xóa kế hoạch
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </div>
  );
};

export default MedicinePlan;
