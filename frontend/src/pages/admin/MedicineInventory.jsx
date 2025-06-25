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
  ProgressBar,
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPills,
  FaFilter,
  FaDownload,
  FaUpload,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaBoxes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaWarehouse,
  FaCalendarAlt,
  FaBarcode,
  FaChartLine,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../../styles/admin/medicine-inventory.css";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import PaginationBar from "../../components/common/PaginationBar";

// Colors for charts
const COLORS = ['#4ECDC4', '#45B7D1', '#FFA726', '#66BB6A', '#EF5350', '#AB47BC', '#FF7043', '#5C6BC0'];

const MedicineInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", quantity: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  //
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unit: "Viên",
    price: 0,
    expiryDate: "",
    location: "",
    barcode: "",
  });

  // Functions to generate chart data
  const getInventoryStats = () => {
    if (!inventory || inventory.length === 0) {
      return {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      };
    }

    const total = inventory.length;
    const inStock = inventory.filter(item => item.quantity > 10).length;
    const lowStock = inventory.filter(item => item.quantity > 0 && item.quantity <= 10).length;
    const outOfStock = inventory.filter(item => item.quantity === 0).length;

    return { total, inStock, lowStock, outOfStock };
  };

  const getCategoryData = () => {
    if (!inventory || inventory.length === 0) {
      return [
        { name: 'Thuốc cảm', value: 0 },
        { name: 'Thuốc đau đầu', value: 0 },
        { name: 'Vitamin', value: 0 },
        { name: 'Thuốc ngoài da', value: 0 },
        { name: 'Khác', value: 0 }
      ];
    }

    // Tạo categories dựa trên tên thuốc
    const categoryMap = {};
    inventory.forEach(item => {
      const name = (item.name || '').toLowerCase();
      let category = 'Khác';

      if (name.includes('cảm') || name.includes('ho') || name.includes('sốt')) {
        category = 'Thuốc cảm';
      } else if (name.includes('đau') || name.includes('paracetamol') || name.includes('ibuprofen')) {
        category = 'Thuốc giảm đau';
      } else if (name.includes('vitamin') || name.includes('canxi') || name.includes('kẽm')) {
        category = 'Vitamin & Bổ sung';
      } else if (name.includes('da') || name.includes('mẩn') || name.includes('kem')) {
        category = 'Thuốc ngoài da';
      } else if (name.includes('dạ dày') || name.includes('tiêu hóa')) {
        category = 'Thuốc tiêu hóa';
      }

      categoryMap[category] = (categoryMap[category] || 0) + item.quantity;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const getStockLevelData = () => {
    if (!inventory || inventory.length === 0) {
      return [];
    }

    return inventory.slice(0, 6).map(item => ({
      name: item.name?.slice(0, 15) + (item.name?.length > 15 ? '...' : '') || 'N/A',
      quantity: item.quantity || 0,
      minStock: Math.max(5, Math.floor(item.quantity * 0.2)), // Giả định minStock là 20% của quantity hiện tại, tối thiểu 5
      maxStock: Math.max(item.quantity, 50) // Giả định maxStock ít nhất bằng quantity hiện tại hoặc 50
    }));
  };

  //debounce search

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const fetchInventory = async () => {
    try {
      const respond = await axiosInstance.get(
        `/MedicalSupply?pageNumber=${currentPage}&pageSize=3${search ? `&search=${search}` : ""
        } `,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = respond.data.data || [];
      console.log("Fetched inventory:", data); // Log toàn bộ dữ liệu
      setInventory(data.items || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to fetch inventory.");
      console.error("Fetch error:", error);
    }
  };

  // Fetch danh sách vật tư y tế
  useEffect(() => {
    fetchInventory();
  }, [currentPage, search]);

  //Mở modal thêm mới
  const handleShowAdd = () => {
    setForm({ id: "", name: "", quantity: "" });
    setShowAddModal(true);
  };

  // Mở modal sửa
  const handleShowEdit = (item) => {
    setForm({ id: item.id, name: item.name, quantity: item.quantity });
    setShowEditModal(true);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      const parsedValue = parseInt(value) || 1; //chuyển đổi thành số mặc định là 1 nếu không hợp lệ
      setForm((prev) => ({
        ...prev,
        [name]: Math.max(1, parsedValue), //đảm bảo không dưới 1
      }));
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //Thêm vật tư
  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.quantity < 1) {
      setError("Số lượng phải lớn hơn hoặc bằng 1.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/MedicalSupply",
        { name: form.name, quantity: form.quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInventory([...inventory, response.data]);
      setShowAddModal(false);
      fetchInventory(); //cập nhật lại danh sách
    } catch (error) {
      setError("Faild to add item.");
      console.log("Add error:", error);
    }
  };

  //Cập nhật vật tư
  const handleUpdate = async (e) => {
    console.log("update 1");
    e.preventDefault();
    console.log("update 2");
    console.log("Số lượng: ", form.quantity);
    if (form.quantity < 1) {
      setError("Số lượng phải lớn hơn hoặc bằng 1.");
      return;
    }

    console.log("update 5");
    try {
      console.log("update 3");
      const response = await axiosInstance.patch(`/MedicalSupply/${form.id}`, {
        name: form.name,
        quantity: form.quantity,
      });
      console.log("update 4");
      setInventory(
        inventory.map((item) =>
          item.id === form.id ? { ...item, ...form } : item
        )
      );

      setForm(response.data);
      setError("");
      setShowEditModal(false);
      fetchInventory(); //cập nhật lại danh sách
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi không xác định khi cập nhật.";
      setError(message);
      console.log("Update error:", error);
    }
  };

  //Xóa vật tư
  const handleDelete = async (id) => {
    // Thêm log để kiểm tra id
    console.log("Received id for delete:", id, "Type:", typeof id); // Log id
    try {
      const response = await axiosInstance.delete(
        `/MedicalSupply/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (error) {
      setError("Failed to delete item.");
      console.log("Delete error:", error);
    }
  };

  //lấy số trang
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    }

    if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleDeleteMedicine = () => {
    if (medicineToDelete) {
      setInventory(inventory.filter((med) => med.id !== medicineToDelete.id));
      handleDelete(medicineToDelete.id);
      setShowDeleteModal(false);
      setMedicineToDelete(null);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ms-1" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterStatus("all");
    setFilterCategory("all");
    setSearch("");
    setShowFilterDropdown(false);
  };

  const handleShowModal = (type, medicine = null) => {
    setModalType(type);
    if (medicine) {
      setForm({
        id: medicine.id,
        name: medicine.name,
        quantity: medicine.quantity,
        // category: medicine.category,

        // minStock: medicine.minStock,
        // maxStock: medicine.maxStock,
        // unit: medicine.unit,
        // price: medicine.price,
        // expiryDate: medicine.expiryDate,
        // location: medicine.location,
        // barcode: medicine.barcode,
      });
    } else {
      setForm({
        id: null,
        name: "",
        quantity: 0,
      });
    }
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Còn hàng": "success",
      "Gần hết": "warning",
      "Hết hàng": "danger",
    };
    const icons = {
      "Còn hàng": <FaCheckCircle className="me-1" />,
      "Gần hết": <FaExclamationTriangle className="me-1" />,
      "Hết hàng": <FaTimesCircle className="me-1" />,
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const getStockProgress = (quantity, minStock, maxStock) => {
    const percentage = Math.min((quantity / maxStock) * 100, 100);
    let variant = "success";
    if (quantity === 0) variant = "danger";
    else if (quantity <= minStock) variant = "warning";

    return (
      <div>
        <ProgressBar
          variant={variant}
          now={percentage}
          style={{ height: "8px" }}
        />
        <small className="text-muted">
          {quantity}/{maxStock}
        </small>
      </div>
    );
  };

  const stats = getInventoryStats();
  const categoryData = getCategoryData();
  const stockLevelData = getStockLevelData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="admin-medicine-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="admin-medicine-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="admin-medicine-title mb-2">
                <FaWarehouse className="me-3" />
                Quản lý kho thuốc
              </h1>
              <p className="admin-medicine-subtitle mb-0">
                Theo dõi và quản lý thuốc, vật tư y tế trong kho với giao diện
                gradient cam tím đẹp mắt
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-3">
                <button
                  className="admin-primary-btn"
                  onClick={() => handleShowModal("add")}
                >
                  <FaPlus className="me-2" />
                  Thêm thuốc
                </button>
                <button className="admin-secondary-btn">
                  <FaDownload className="me-2" />
                  Xuất báo cáo
                </button>
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants} className="admin-medicine-stats">
          <div className="admin-medicine-stat-card">
            <div className="admin-medicine-stat-icon">
              <FaPills />
            </div>
            <div className="admin-medicine-stat-value">{stats?.total}</div>
            <div className="admin-medicine-stat-label">Tổng thuốc</div>
          </div>
          <div className="admin-medicine-stat-card">
            <div className="admin-medicine-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="admin-medicine-stat-value">{stats?.inStock}</div>
            <div className="admin-medicine-stat-label">Còn hàng</div>
          </div>
          <div className="admin-medicine-stat-card">
            <div className="admin-medicine-stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="admin-medicine-stat-value">{stats?.lowStock}</div>
            <div className="admin-medicine-stat-label">Gần hết</div>
          </div>
          <div className="admin-medicine-stat-card">
            <div className="admin-medicine-stat-icon">
              <FaTimesCircle />
            </div>
            <div className="admin-medicine-stat-value">{stats?.outOfStock}</div>
            <div className="admin-medicine-stat-label">Hết hàng</div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-md-6">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaPills />
                  Phân bố theo danh mục
                </h4>
              </div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaChartLine />
                  Mức tồn kho
                </h4>
              </div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stockLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#4ECDC4" name="Hiện tại" />
                    <Bar dataKey="minStock" fill="#26D0CE" name="Tối thiểu" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          variants={itemVariants}
          className="admin-medicine-search-bar d-flex align-items-center gap-2"
        >
          <InputGroup style={{ flex: 0.5 }}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên thuốc, danh mục, mã vạch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ borderRadius: "25px", border: "2px solid #10B981" }}
            />
          </InputGroup>
        </motion.div>

        {/* Medicine Table */}
        <motion.div variants={itemVariants}>
          <div className="admin-medicine-table-container">
            <table className="admin-medicine-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Tên thuốc
                  </th>
                  {/* <th>Danh mục</th> */}
                  <th
                    onClick={() => handleSort("quantity")}
                    style={{ cursor: "pointer" }}
                  >
                    Số lượng
                  </th>
                  {/* <th>Mức tồn kho</th> */}
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {inventory.map((medicine, index) => (
                    <motion.tr
                      key={medicine.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <div className="admin-medicine-item">
                          <div className="admin-medicine-info">
                            <div className="admin-medicine-name">
                              {medicine.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* <td>
                        <div className="admin-medicine-category">
                          {medicine.category}
                        </div>
                      </td> */}

                      <td>
                        <div className="admin-medicine-stock-progress">
                          {/* <div className="admin-medicine-progress-bar">
                            <div
                              className={`admin-medicine-progress-fill ${
                                medicine.quantity === 0
                                  ? "danger"
                                  : medicine.quantity <= medicine.minStock
                                  ? "warning"
                                  : "success"
                              }`}
                            //   style={{
                            //     width: `${Math.min(
                            //       (medicine.quantity / medicine.maxStock) * 100,
                            //       100
                            //     )}%`,
                            //   }}
                            ></div>
                          </div> */}
                          <div className="admin-medicine-stock-text">
                            {medicine.quantity}
                          </div>
                        </div>
                      </td>

                      {/* <td>
                        <div
                          className={`admin-medicine-status ${
                            medicine.status === "Còn hàng"
                              ? "success"
                              : medicine.status === "Gần hết"
                              ? "warning"
                              : "danger"
                          }`}
                        >
                          {medicine.status === "Còn hàng" && <FaCheckCircle />}
                          {medicine.status === "Gần hết" && (
                            <FaExclamationTriangle />
                          )}
                          {medicine.status === "Hết hàng" && <FaTimesCircle />}
                          {medicine.status}
                        </div>
                      </td> */}

                      <td>
                        <div className="admin-medicine-actions">
                          {/* <button
                            className="admin-medicine-action-btn view"
                            title="Xem chi tiết"
                            
                          >
                            <FaEye />
                          </button> */}
                          <button
                            className="admin-medicine-action-btn edit"
                            title="Chỉnh sửa"
                            onClick={() => handleShowModal("edit", medicine)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="admin-medicine-action-btn delete"
                            title="Xóa"
                            onClick={() => {
                              setMedicineToDelete(medicine);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <div style={{ padding: "3rem", color: "#757575" }}>
                        <FaPills
                          style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                            opacity: 0.3,
                          }}
                        />
                        <h5>Không tìm thấy thuốc nào</h5>
                        <p>Thử thay đổi bộ lọc hoặc thêm thuốc mới</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* PaginationBar dưới bảng thuốc */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          className="admin-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="admin-modal-title">
              <FaPills />
              {modalType === "add"
                ? "Thêm thuốc mới"
                : "Chỉnh sửa thông tin thuốc"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Tên thuốc *</label>
                    <input
                      type="text"
                      placeholder="Nhập tên thuốc"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="admin-form-control"
                    />
                  </div>
                </Col>
                {/* <Col md={6}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="admin-form-select"
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Thuốc giảm đau">Thuốc giảm đau</option>
                      <option value="Vitamin">Vitamin</option>
                      <option value="Vật tư y tế">Vật tư y tế</option>
                    </select>
                  </div>
                </Col> */}
              </Row>
              <Row>
                <Col md={6}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Số lượng</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.quantity === 0 ? "" : form.quantity}
                      min={0}
                      onChange={(e) => {
                        const value = e.target.value;

                        // 1. Cho phép rỗng khi đang gõ/xóa
                        if (value === "") {
                          setForm({ ...form, quantity: 0 }); // Có thể giữ là 0 hoặc undefined
                          return;
                        }

                        // 2. Không cho nhập chữ
                        const number = parseInt(value, 10);
                        if (isNaN(number)) return;

                        // 3. Nếu < 0 thì set lại thành 0
                        setForm({ ...form, quantity: number < 0 ? 0 : number });
                      }}
                      className="admin-form-control"
                    />
                  </div>
                </Col>

                {/* <Col md={6}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Đơn vị</label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="admin-form-select"
                    >
                      <option value="Viên">Viên</option>
                      <option value="Gói">Gói</option>
                      <option value="Lọ">Lọ</option>
                      <option value="Hộp">Hộp</option>
                    </select>
                  </div>
                </Col> */}
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="admin-secondary-btn"
              onClick={() => setShowModal(false)}
            >
              Hủy
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                if (modalType === "add") {
                  console.log("add");
                  handleAdd(e);
                } else {
                  console.log("update");
                  handleUpdate(e);
                }
              }}
            >
              {loading && (
                <div className="admin-medicine-loading-spinner"></div>
              )}
              {modalType === "add" ? "Thêm thuốc" : "Cập nhật"}
            </button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          className="admin-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="admin-modal-title">
              <FaExclamationTriangle />
              Xác nhận xóa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center p-4">
              <div className="mb-4">
                <FaTimesCircle style={{ fontSize: "4rem", color: "#dc2626" }} />
              </div>
              <h5 className="mb-3">
                Bạn có chắc chắn muốn xóa thuốc{" "}
                <strong>{medicineToDelete?.name}</strong>?
              </h5>
              <div className="alert alert-warning">
                <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất
                cả dữ liệu liên quan sẽ bị mất.
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="admin-secondary-btn"
              onClick={() => setShowDeleteModal(false)}
            >
              Hủy
            </button>
            <button
              className="admin-primary-btn"
              onClick={handleDeleteMedicine}
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              }}
            >
              <FaTrash className="me-2" />
              Xóa thuốc
            </button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </div>
  );
};

export default MedicineInventory;
