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
    ProgressBar
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
    FaChartLine
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// Styles được import từ main.jsx
// Styles được import từ main.jsx

const MedicineInventory = () => {
    const [medicines, setMedicines] = useState([
        {
            id: 1,
            name: "Paracetamol 500mg",
            category: "Thuốc giảm đau",
            quantity: 120,
            minStock: 50,
            maxStock: 200,
            unit: "Viên",
            price: 500,
            expiryDate: "2025-12-31",
            status: "Còn hàng",
            location: "Kệ A1",
            barcode: "PMC500001"
        },
        {
            id: 2,
            name: "Ibuprofen 400mg",
            category: "Thuốc giảm đau",
            quantity: 25,
            minStock: 30,
            maxStock: 150,
            unit: "Viên",
            price: 800,
            expiryDate: "2024-08-15",
            status: "Gần hết",
            location: "Kệ A2",
            barcode: "IBU400002"
        },
        {
            id: 3,
            name: "Vitamin C 1000mg",
            category: "Vitamin",
            quantity: 0,
            minStock: 20,
            maxStock: 100,
            unit: "Viên",
            price: 300,
            expiryDate: "2025-06-30",
            status: "Hết hàng",
            location: "Kệ B1",
            barcode: "VTC100003"
        },
        {
            id: 4,
            name: "Băng gạc vô trùng",
            category: "Vật tư y tế",
            quantity: 80,
            minStock: 30,
            maxStock: 120,
            unit: "Gói",
            price: 2000,
            expiryDate: "2026-01-15",
            status: "Còn hàng",
            location: "Kệ C1",
            barcode: "BG001004"
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");

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
        barcode: ""
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

    // Data processing for charts
    const getInventoryStats = () => {
        const total = medicines.length;
        const inStock = medicines.filter(m => m.status === "Còn hàng").length;
        const lowStock = medicines.filter(m => m.status === "Gần hết").length;
        const outOfStock = medicines.filter(m => m.status === "Hết hàng").length;

        return { total, inStock, lowStock, outOfStock };
    };

    const getCategoryData = () => {
        const categoryCount = {};
        medicines.forEach(medicine => {
            categoryCount[medicine.category] = (categoryCount[medicine.category] || 0) + 1;
        });

        return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    };

    const getStockLevelData = () => {
        return medicines.map(medicine => ({
            name: medicine.name.substring(0, 15) + (medicine.name.length > 15 ? '...' : ''),
            quantity: medicine.quantity,
            minStock: medicine.minStock,
            maxStock: medicine.maxStock
        }));
    };

    const COLORS = ['#28a745', '#ffc107', '#dc3545', '#6c757d'];

    // Filter và sort medicines
    const filteredMedicines = medicines
        .filter(medicine => {
            const matchesSearch = medicine.name.toLowerCase().includes(search.toLowerCase()) ||
                medicine.category.toLowerCase().includes(search.toLowerCase()) ||
                medicine.barcode.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === "all" || medicine.status === filterStatus;
            const matchesCategory = filterCategory === "all" || medicine.category === filterCategory;
            return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            const modifier = sortDirection === "asc" ? 1 : -1;

            if (typeof aValue === 'string') {
                return aValue.localeCompare(bValue) * modifier;
            }
            return (aValue - bValue) * modifier;
        });

    const handleShowModal = (type, medicine = null) => {
        setModalType(type);
        if (medicine) {
            setFormData({
                id: medicine.id,
                name: medicine.name,
                category: medicine.category,
                quantity: medicine.quantity,
                minStock: medicine.minStock,
                maxStock: medicine.maxStock,
                unit: medicine.unit,
                price: medicine.price,
                expiryDate: medicine.expiryDate,
                location: medicine.location,
                barcode: medicine.barcode
            });
        } else {
            setFormData({
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
                barcode: ""
            });
        }
        setShowModal(true);
    };

    const handleSaveMedicine = () => {
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên thuốc!");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            if (modalType === "add") {
                const newMedicine = {
                    ...formData,
                    id: Date.now(),
                    status: getStockStatus(formData.quantity, formData.minStock)
                };
                setMedicines([...medicines, newMedicine]);
            } else {
                setMedicines(medicines.map(med =>
                    med.id === formData.id
                        ? { ...med, ...formData, status: getStockStatus(formData.quantity, formData.minStock) }
                        : med
                ));
            }

            setShowModal(false);
            setLoading(false);
        }, 1000);
    };

    const getStockStatus = (quantity, minStock) => {
        if (quantity === 0) return "Hết hàng";
        if (quantity <= minStock) return "Gần hết";
        return "Còn hàng";
    };

    const handleDeleteMedicine = () => {
        if (medicineToDelete) {
            setMedicines(medicines.filter(med => med.id !== medicineToDelete.id));
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
        return sortDirection === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    };

    const getStatusBadge = (status) => {
        const variants = {
            "Còn hàng": "success",
            "Gần hết": "warning",
            "Hết hàng": "danger"
        };
        const icons = {
            "Còn hàng": <FaCheckCircle className="me-1" />,
            "Gần hết": <FaExclamationTriangle className="me-1" />,
            "Hết hàng": <FaTimesCircle className="me-1" />
        };
        return (
            <Badge bg={variants[status] || "secondary"}>
                {icons[status]}{status}
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
                    style={{ height: '8px' }}
                />
                <small className="text-muted">{quantity}/{maxStock}</small>
            </div>
        );
    };

    const stats = getInventoryStats();
    const categoryData = getCategoryData();
    const stockLevelData = getStockLevelData().slice(0, 6);

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
                                Theo dõi và quản lý thuốc, vật tư y tế trong kho với giao diện gradient cam tím đẹp mắt
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
                        <div className="admin-medicine-stat-value">{stats.total}</div>
                        <div className="admin-medicine-stat-label">Tổng thuốc</div>
                    </div>
                    <div className="admin-medicine-stat-card">
                        <div className="admin-medicine-stat-icon">
                            <FaCheckCircle />
                        </div>
                        <div className="admin-medicine-stat-value">{stats.inStock}</div>
                        <div className="admin-medicine-stat-label">Còn hàng</div>
                    </div>
                    <div className="admin-medicine-stat-card">
                        <div className="admin-medicine-stat-icon">
                            <FaExclamationTriangle />
                        </div>
                        <div className="admin-medicine-stat-value">{stats.lowStock}</div>
                        <div className="admin-medicine-stat-label">Gần hết</div>
                    </div>
                    <div className="admin-medicine-stat-card">
                        <div className="admin-medicine-stat-icon">
                            <FaTimesCircle />
                        </div>
                        <div className="admin-medicine-stat-value">{stats.outOfStock}</div>
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
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
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

                {/* Controls */}
                <motion.div variants={itemVariants} className="admin-medicine-search-bar">
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm thuốc, mã vạch..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="admin-medicine-search-input"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="admin-medicine-search-input"
                        style={{ flex: '0 0 200px' }}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Gần hết">Gần hết</option>
                        <option value="Hết hàng">Hết hàng</option>
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="admin-medicine-search-input"
                        style={{ flex: '0 0 200px' }}
                    >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Thuốc giảm đau">Thuốc giảm đau</option>
                        <option value="Vitamin">Vitamin</option>
                        <option value="Vật tư y tế">Vật tư y tế</option>
                    </select>
                    <button className="admin-medicine-filter-btn">
                        <FaFilter />
                        Lọc nâng cao
                    </button>
                </motion.div>

                {/* Medicine Table */}
                <motion.div variants={itemVariants}>
                    <div className="admin-medicine-table-container">
                        <table className="admin-medicine-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                        Tên thuốc {getSortIcon('name')}
                                    </th>
                                    <th>Danh mục</th>
                                    <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                                        Số lượng {getSortIcon('quantity')}
                                    </th>
                                    <th>Mức tồn kho</th>
                                    <th>Giá</th>
                                    <th>Vị trí</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredMedicines.map((medicine, index) => (
                                        <motion.tr
                                            key={medicine.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td>
                                                <div className="admin-medicine-item">
                                                    <div className="admin-medicine-image">
                                                        {medicine.name?.charAt(0)?.toUpperCase() || 'M'}
                                                    </div>
                                                    <div className="admin-medicine-info">
                                                        <div className="admin-medicine-name">{medicine.name}</div>
                                                        <div className="admin-medicine-type">{medicine.barcode}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span style={{
                                                    padding: '0.375rem 0.875rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    background: 'linear-gradient(135deg, #4ECDC4, #26D0CE)',
                                                    color: 'white',
                                                    display: 'inline-block'
                                                }}>
                                                    {medicine.category}
                                                </span>
                                            </td>

                                            <td>
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: medicine.quantity <= medicine.minStock ? '#F44336' : '#4CAF50'
                                                }}>
                                                    {medicine.quantity} {medicine.unit}
                                                </span>
                                            </td>

                                            <td>
                                                <div style={{ width: '100%', maxWidth: '120px' }}>
                                                    <div style={{
                                                        width: '100%',
                                                        height: '8px',
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        <div style={{
                                                            width: `${Math.min((medicine.quantity / medicine.maxStock) * 100, 100)}%`,
                                                            height: '100%',
                                                            background: medicine.quantity === 0
                                                                ? 'linear-gradient(135deg, #F44336, #EF5350)'
                                                                : medicine.quantity <= medicine.minStock
                                                                    ? 'linear-gradient(135deg, #FF9800, #FFB74D)'
                                                                    : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                                                            transition: 'width 0.3s ease'
                                                        }}></div>
                                                    </div>
                                                    <small style={{ color: '#757575', fontSize: '0.75rem' }}>
                                                        {medicine.quantity}/{medicine.maxStock}
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                <span style={{ fontWeight: '600', color: '#424242' }}>
                                                    {medicine.price.toLocaleString('vi-VN')} ₫
                                                </span>
                                            </td>

                                            <td>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                    padding: '0.375rem 0.75rem',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F5F5F5',
                                                    color: '#757575',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <FaBoxes />
                                                    {medicine.location}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`admin-stock-badge ${medicine.status === 'Còn hàng' ? 'in-stock' :
                                                    medicine.status === 'Gần hết' ? 'low-stock' : 'out-of-stock'
                                                    }`}>
                                                    {medicine.status === "Còn hàng" && <FaCheckCircle />}
                                                    {medicine.status === "Gần hết" && <FaExclamationTriangle />}
                                                    {medicine.status === "Hết hàng" && <FaTimesCircle />}
                                                    {medicine.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-medicine-actions">
                                                    <button className="admin-medicine-btn view" title="Xem chi tiết">
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="admin-medicine-btn edit"
                                                        title="Chỉnh sửa"
                                                        onClick={() => handleShowModal("edit", medicine)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="admin-medicine-btn delete"
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

                                {filteredMedicines.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <div style={{ padding: '3rem', color: '#757575' }}>
                                                <FaPills style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                                                <h5>Không tìm thấy thuốc nào</h5>
                                                <p>Thử thay đổi bộ lọc hoặc thêm thuốc mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Add/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="admin-medicine-modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="admin-medicine-modal-title">
                            <FaPills />
                            {modalType === "add" ? "Thêm thuốc mới" : "Chỉnh sửa thông tin thuốc"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Tên thuốc *</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên thuốc"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Danh mục</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="admin-medicine-form-control"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            <option value="Thuốc giảm đau">Thuốc giảm đau</option>
                                            <option value="Vitamin">Vitamin</option>
                                            <option value="Vật tư y tế">Vật tư y tế</option>
                                        </select>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Số lượng</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Tồn kho tối thiểu</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.minStock}
                                            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Tồn kho tối đa</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.maxStock}
                                            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Đơn vị</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="admin-medicine-form-control"
                                        >
                                            <option value="Viên">Viên</option>
                                            <option value="Gói">Gói</option>
                                            <option value="Lọ">Lọ</option>
                                            <option value="Hộp">Hộp</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Giá (VND)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Vị trí</label>
                                        <input
                                            type="text"
                                            placeholder="VD: Kệ A1"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="admin-medicine-form-group">
                                        <label className="admin-medicine-form-label">Hạn sử dụng</label>
                                        <input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="admin-medicine-form-control"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div className="admin-medicine-form-group">
                                <label className="admin-medicine-form-label">Mã vạch</label>
                                <input
                                    type="text"
                                    placeholder="Nhập mã vạch"
                                    value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                    className="admin-medicine-form-control"
                                />
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="admin-secondary-btn" onClick={() => setShowModal(false)}>
                            Hủy
                        </button>
                        <button
                            className="admin-primary-btn"
                            onClick={handleSaveMedicine}
                            disabled={loading}
                        >
                            {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>}
                            {modalType === "add" ? "Thêm thuốc" : "Cập nhật"}
                        </button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="admin-medicine-modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="admin-medicine-modal-title">
                            <FaExclamationTriangle />
                            Xác nhận xóa
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center p-4">
                            <div className="mb-4">
                                <FaTimesCircle style={{ fontSize: '4rem', color: '#F44336' }} />
                            </div>
                            <h5 className="mb-3">Bạn có chắc chắn muốn xóa thuốc <strong>{medicineToDelete?.name}</strong>?</h5>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                border: '1px solid rgba(255, 152, 0, 0.3)',
                                borderRadius: '12px',
                                color: '#FF9800'
                            }}>
                                <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị mất.
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="admin-secondary-btn" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </button>
                        <button className="admin-medicine-btn delete" onClick={handleDeleteMedicine} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', width: 'auto', height: 'auto' }}>
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
