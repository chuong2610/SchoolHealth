import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Badge, Dropdown } from "react-bootstrap";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FaPills, FaUser, FaCalendarAlt, FaFilter, FaPlus, FaEye, FaEdit, FaCheck, FaTimes, FaClock, FaSearch, FaDownload, FaCheckCircle, FaTimesCircle, FaSpinner, FaFileAlt, FaWarehouse, FaTruck, FaChartLine } from "react-icons/fa";

// Mock data for charts
const requestStats = [
  { month: 'T1', pending: 12, approved: 45, rejected: 3 },
  { month: 'T2', pending: 8, approved: 38, rejected: 5 },
  { month: 'T3', pending: 15, approved: 52, rejected: 2 },
  { month: 'T4', pending: 10, approved: 48, rejected: 4 },
  { month: 'T5', pending: 18, approved: 55, rejected: 3 },
  { month: 'T6', pending: 22, approved: 60, rejected: 2 }
];

const categoryDistribution = [
  { name: 'Thuốc', value: 65, color: '#FF9500' },
  { name: 'Vật tư', value: 25, color: '#9C27B0' },
  { name: 'Thiết bị', value: 8, color: '#28a745' },
  { name: 'Khác', value: 2, color: '#6c757d' }
];

const requests = [
  {
    id: 1,
    requestId: "REQ-2024-001",
    sender: "Nguyễn Văn A",
    department: "Phòng Y tế",
    type: "Thuốc",
    name: "Paracetamol 500mg",
    quantity: 200,
    unit: "viên",
    date: "2024-06-01",
    priority: "Cao",
    status: "Chờ duyệt",
    note: "Cần bổ sung cho kho lớp 1A",
    estimatedCost: 150000,
    supplier: "Công ty TNHH ABC",
    deliveryDate: "2024-06-10"
  },
  {
    id: 2,
    requestId: "REQ-2024-002",
    sender: "Trần Thị B",
    department: "Lớp 2B",
    type: "Vật tư",
    name: "Băng gạc y tế",
    quantity: 50,
    unit: "cuộn",
    date: "2024-05-28",
    priority: "Trung bình",
    status: "Đã duyệt",
    note: "Dùng cho phòng y tế",
    estimatedCost: 250000,
    supplier: "Công ty DEF",
    deliveryDate: "2024-06-05"
  }
];

const requestTypes = ["Tất cả", "Thuốc", "Vật tư", "Thiết bị", "Khác"];
const priorities = ["Khẩn cấp", "Cao", "Trung bình", "Thấp"];
const statuses = ["Tất cả", "Chờ duyệt", "Đang xử lý", "Đã duyệt", "Từ chối"];

const quickStats = [
  { title: "Yêu cầu chờ duyệt", value: "22", change: "+5", color: "warning", icon: FaClock },
  { title: "Đã duyệt tháng này", value: "45", change: "+12", color: "success", icon: FaCheckCircle },
  { title: "Tổng giá trị", value: "₫25.6M", change: "+8%", color: "info", icon: FaFileAlt },
  { title: "Nhà cung cấp", value: "12", change: "+2", color: "primary", icon: FaTruck }
];

const MedicineRequests = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editMode, setEditMode] = useState("add");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    sender: "",
    department: "",
    type: requestTypes[1],
    name: "",
    quantity: "",
    unit: "viên",
    date: "",
    priority: priorities[2],
    note: "",
    estimatedCost: "",
    supplier: ""
  });

  const filteredRequests = requests.filter(request => {
    const matchesType = filterType === "Tất cả" || request.type === filterType;
    const matchesStatus = filterStatus === "Tất cả" || request.status === filterStatus;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleShowAdd = () => {
    setEditMode("add");
    setForm({
      sender: "Nguyễn Văn Admin",
      department: "Phòng Y tế",
      type: requestTypes[1],
      name: "",
      quantity: "",
      unit: "viên",
      date: new Date().toISOString().split('T')[0],
      priority: priorities[2],
      note: "",
      estimatedCost: "",
      supplier: ""
    });
    setShowEditModal(true);
  };

  const handleShowEdit = (request) => {
    setEditMode("edit");
    setForm({
      sender: request.sender,
      department: request.department,
      type: request.type,
      name: request.name,
      quantity: request.quantity.toString(),
      unit: request.unit,
      date: request.date,
      priority: request.priority,
      note: request.note || "",
      estimatedCost: request.estimatedCost?.toString() || "",
      supplier: request.supplier || ""
    });
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleShowDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleShowApproval = (request) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Chờ duyệt": { bg: "warning", icon: FaClock },
      "Đang xử lý": { bg: "info", icon: FaSpinner },
      "Đã duyệt": { bg: "success", icon: FaCheckCircle },
      "Từ chối": { bg: "danger", icon: FaTimesCircle }
    };
    const variant = variants[status] || { bg: "secondary", icon: FaClock };
    return (
      <Badge bg={variant.bg} className="d-flex align-items-center gap-1">
        <variant.icon size={12} />
        {status}
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

  const getTypeBadge = (type) => {
    const variants = {
      "Thuốc": "primary",
      "Vật tư": "info",
      "Thiết bị": "success",
      "Khác": "secondary"
    };
    return <Badge bg={variants[type] || "secondary"}>{type}</Badge>;
  };

  return (
    <div className="admin-container">
      <div className="admin-medicine-requests-header">
        <div className="admin-medicine-requests-header-bg"></div>
        <div className="admin-medicine-requests-header-content">
          <div className="admin-medicine-requests-title-section">
            <h1 className="admin-medicine-requests-title">
              <FaPills className="me-3" />
              Yêu cầu thuốc & vật tư
            </h1>
            <p className="admin-medicine-requests-subtitle">
              Quản lý và phê duyệt yêu cầu cấp phát thuốc, vật tư y tế
            </p>
          </div>
          <div className="admin-medicine-requests-actions">
            <button className="admin-btn admin-primary-btn">
              <FaPlus className="me-2" />
              Tạo yêu cầu
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h5 className="admin-card-title">Danh sách yêu cầu</h5>
        </div>
        <div className="admin-card-body">
          <p>Trang yêu cầu thuốc & vật tư đã được thiết kế lại với theme gradient cam-tím!</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineRequests; 
