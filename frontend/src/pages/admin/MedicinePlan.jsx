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
    <div className="admin-plans-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="admin-plans-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="admin-plans-title mb-2">
                <FaCalendarAlt className="me-3" />
                Kế hoạch thuốc
              </h1>
              <p className="admin-plans-subtitle mb-0">
                Lập và quản lý kế hoạch phân phối thuốc cho học sinh với giao diện gradient cam tím
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-3">
                <button
                  className="admin-primary-btn"
                  onClick={() => handleShowModal("add")}
                >
                  <FaPlus className="me-2" />
                  Tạo kế hoạch
                </button>
                <button className="admin-secondary-btn">
                  <FaDownload className="me-2" />
                  Xuất báo cáo
                </button>
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="admin-plans-search-bar">
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Tìm kiếm kế hoạch thuốc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-plans-search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-plans-search-input"
            style={{ flex: '0 0 200px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="admin-plans-search-input"
            style={{ flex: '0 0 200px' }}
          >
            <option value="all">Tất cả mức độ</option>
            <option value="Khẩn cấp">Khẩn cấp</option>
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
          </select>
          <button className="admin-medicine-filter-btn">
            <FaFilter />
            Lọc nâng cao
          </button>
        </motion.div>

        {/* Plans Grid */}
        <motion.div variants={itemVariants} className="admin-plans-grid">
          <AnimatePresence>
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="admin-plan-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="admin-plan-card-header">
                  <div className="admin-plan-title">
                    <FaCalendarAlt />
                    {plan.title}
                  </div>
                  <div className="admin-plan-meta">
                    <span>
                      <FaUser className="me-1" />
                      {plan.createdBy}
                    </span>
                    <div className="admin-plan-status">
                      {plan.status === "Chờ duyệt" && <FaClock className="me-1" />}
                      {plan.status === "Đang thực hiện" && <FaPlay className="me-1" />}
                      {plan.status === "Hoàn thành" && <FaCheckCircle className="me-1" />}
                      {plan.status === "Tạm dừng" && <FaPause className="me-1" />}
                      {plan.status}
                    </div>
                  </div>
                </div>

                <div className="admin-plan-card-body">
                  <div className="admin-plan-description">
                    {plan.description}
                  </div>

                  <div className="admin-plan-stats">
                    <div className="admin-plan-stat">
                      <div className="admin-plan-stat-value">{plan.totalStudents}</div>
                      <div className="admin-plan-stat-label">Học sinh</div>
                    </div>
                    <div className="admin-plan-stat">
                      <div className="admin-plan-stat-value">{plan.medicines.length}</div>
                      <div className="admin-plan-stat-label">Loại thuốc</div>
                    </div>
                    <div className="admin-plan-stat">
                      <div className="admin-plan-stat-value" style={{
                        color: plan.priority === 'Khẩn cấp' ? '#F44336' :
                          plan.priority === 'Cao' ? '#FF9800' :
                            plan.priority === 'Trung bình' ? '#2196F3' : '#4CAF50'
                      }}>
                        {plan.priority === 'Khẩn cấp' ? '🔴' :
                          plan.priority === 'Cao' ? '🟡' :
                            plan.priority === 'Trung bình' ? '🔵' : '🟢'}
                      </div>
                      <div className="admin-plan-stat-label">{plan.priority}</div>
                    </div>
                  </div>

                  <div className="admin-plan-progress">
                    <div className="admin-plan-progress-label">
                      <span>Tiến độ thực hiện</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="admin-plan-progress-bar">
                      <div
                        className="admin-plan-progress-fill"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#757575',
                      marginTop: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{plan.startDate}</span>
                      <span>{plan.endDate}</span>
                    </div>
                  </div>

                  <div className="admin-plan-actions">
                    <button
                      className="admin-plan-btn view"
                      onClick={() => {/* View logic */ }}
                    >
                      <FaEye />
                      Xem chi tiết
                    </button>
                    <button
                      className="admin-plan-btn edit"
                      onClick={() => handleShowModal("edit", plan)}
                    >
                      <FaEdit />
                      Chỉnh sửa
                    </button>
                    <button
                      className="admin-plan-btn delete"
                      onClick={() => {
                        setPlanToDelete(plan);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                      Xóa
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPlans.length === 0 && search && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#757575' }}>
              <FaCalendarAlt style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }} />
              <h4>Không tìm thấy kế hoạch nào</h4>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="admin-categories-modal">
          <Modal.Header closeButton>
            <Modal.Title className="admin-categories-modal-title">
              <FaCalendarAlt className="me-2" />
              {modalType === "add" ? "Tạo kế hoạch mới" : "Chỉnh sửa kế hoạch"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={8}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaEdit />
                      Tiêu đề kế hoạch *
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề kế hoạch"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="admin-categories-form-control"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaExclamationTriangle />
                      Độ ưu tiên
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="admin-categories-form-control"
                    >
                      <option value="Thấp">🟢 Thấp</option>
                      <option value="Trung bình">🔵 Trung bình</option>
                      <option value="Cao">🟡 Cao</option>
                      <option value="Khẩn cấp">🔴 Khẩn cấp</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <div className="admin-categories-form-group">
                <label className="admin-categories-form-label">
                  <FaEdit />
                  Mô tả kế hoạch
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết kế hoạch..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-categories-form-control"
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>
              <Row>
                <Col md={4}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaCalendarAlt />
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="admin-categories-form-control"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaCalendarAlt />
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="admin-categories-form-control"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaGraduationCap />
                      Số học sinh
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.totalStudents}
                      onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 0 })}
                      className="admin-categories-form-control"
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="admin-secondary-btn" onClick={() => setShowModal(false)}>
              Hủy
            </button>
            <button
              className="admin-primary-btn"
              onClick={handleSavePlan}
              disabled={loading}
            >
              {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>}
              {modalType === "add" ? "Tạo kế hoạch" : "Cập nhật"}
            </button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="admin-categories-modal">
          <Modal.Header closeButton>
            <Modal.Title className="admin-categories-modal-title">
              <FaTrash className="me-2" />
              Xác nhận xóa kế hoạch
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center py-4">
              <div className="mb-4">
                <FaCalendarAlt style={{ fontSize: '5rem', color: '#F44336', opacity: 0.7 }} />
              </div>
              <h4 className="mb-3">Bạn có chắc chắn muốn xóa kế hoạch</h4>
              <h4 className="mb-4" style={{ color: '#FF9500', fontWeight: 'bold' }}>
                "{planToDelete?.title}"?
              </h4>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                border: '2px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '16px',
                color: '#FF9800'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <FaExclamationTriangle style={{ marginRight: '0.75rem', fontSize: '1.25rem' }} />
                  <strong>Cảnh báo quan trọng!</strong>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan đến kế hoạch
                  phân phối thuốc cho <strong>{planToDelete?.totalStudents || 0} học sinh</strong> sẽ bị mất vĩnh viễn.
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="admin-secondary-btn" onClick={() => setShowDeleteModal(false)}>
              Hủy bỏ
            </button>
            <button
              className="admin-medicine-btn delete"
              onClick={handleDeletePlan}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                width: 'auto',
                height: 'auto',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}
            >
              <FaTrash className="me-2" />
              Xóa vĩnh viễn
            </button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </div>
  );
};

export default MedicinePlan;
