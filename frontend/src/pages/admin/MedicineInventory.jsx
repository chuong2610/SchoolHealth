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
    FaBarcode
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
                                <FaWarehouse className="me-3" />
                                Quản lý kho thuốc
                            </h1>
                            <p className="accounts-subtitle mb-0">
                                Theo dõi và quản lý thuốc, vật tư y tế trong kho
                            </p>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="primary"
                                className="btn-primary me-2"
                                onClick={() => handleShowModal("add")}
                            >
                                <FaPlus className="me-2" />
                                Thêm thuốc
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
                                <FaPills size={24} />
                            </div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Tổng thuốc</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="stat-card text-center">
                            <div className="stat-icon text-success mb-2">
                                <FaCheckCircle size={24} />
                            </div>
                            <div className="stat-value">{stats.inStock}</div>
                            <div className="stat-label">Còn hàng</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="stat-card text-center">
                            <div className="stat-icon text-warning mb-2">
                                <FaExclamationTriangle size={24} />
                            </div>
                            <div className="stat-value">{stats.lowStock}</div>
                            <div className="stat-label">Gần hết</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="stat-card text-center">
                            <div className="stat-icon text-danger mb-2">
                                <FaTimesCircle size={24} />
                            </div>
                            <div className="stat-value">{stats.outOfStock}</div>
                            <div className="stat-label">Hết hàng</div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts */}
                <motion.div variants={itemVariants} className="row mb-4">
                    <div className="col-md-6">
                        <Card className="chart-card h-100">
                            <Card.Header>
                                <h5 className="mb-0">Phân bố theo danh mục</h5>
                            </Card.Header>
                            <Card.Body>
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
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card className="chart-card h-100">
                            <Card.Header>
                                <h5 className="mb-0">Mức tồn kho</h5>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={stockLevelData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="quantity" fill="#28a745" name="Hiện tại" />
                                        <Bar dataKey="minStock" fill="#ffc107" name="Tối thiểu" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div variants={itemVariants} className="search-filter-bar mb-4">
                    <Row className="align-items-center">
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm thuốc, mã vạch..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="search-input"
                                />
                            </InputGroup>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="Còn hàng">Còn hàng</option>
                                <option value="Gần hết">Gần hết</option>
                                <option value="Hết hàng">Hết hàng</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">Tất cả danh mục</option>
                                <option value="Thuốc giảm đau">Thuốc giảm đau</option>
                                <option value="Vitamin">Vitamin</option>
                                <option value="Vật tư y tế">Vật tư y tế</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex gap-2">
                                <Button variant="outline-success" className="flex-fill">
                                    <FaUpload className="me-1" />
                                    Nhập kho
                                </Button>
                                <Button variant="outline-info" className="flex-fill">
                                    <FaBarcode className="me-1" />
                                    Quét mã
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </motion.div>

                {/* Medicine Table */}
                <motion.div variants={itemVariants}>
                    <div className="medicine-table-wrapper">
                        <div className="medicine-table-header">
                            <div className="medicine-table-row header-row">
                                <div className="medicine-cell name-cell" onClick={() => handleSort('name')}>
                                    <span>Tên thuốc {getSortIcon('name')}</span>
                                </div>
                                <div className="medicine-cell category-cell">
                                    <span>Danh mục</span>
                                </div>
                                <div className="medicine-cell quantity-cell" onClick={() => handleSort('quantity')}>
                                    <span>Số lượng {getSortIcon('quantity')}</span>
                                </div>
                                <div className="medicine-cell stock-cell">
                                    <span>Mức tồn kho</span>
                                </div>
                                <div className="medicine-cell price-cell">
                                    <span>Giá</span>
                                </div>
                                <div className="medicine-cell location-cell">
                                    <span>Vị trí</span>
                                </div>
                                <div className="medicine-cell status-cell">
                                    <span>Trạng thái</span>
                                </div>
                                <div className="medicine-cell action-cell">
                                    <span>Thao tác</span>
                                </div>
                            </div>
                        </div>

                        <div className="medicine-table-body">
                            <AnimatePresence>
                                {filteredMedicines.map((medicine, index) => (
                                    <motion.div
                                        key={medicine.id}
                                        className="medicine-table-row data-row"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="medicine-cell name-cell">
                                            <div className="medicine-info">
                                                <div className="medicine-icon">
                                                    <FaPills />
                                                </div>
                                                <div className="medicine-details">
                                                    <div className="medicine-name">{medicine.name}</div>
                                                    <div className="medicine-barcode">{medicine.barcode}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="medicine-cell category-cell">
                                            <span className="category-badge">{medicine.category}</span>
                                        </div>

                                        <div className="medicine-cell quantity-cell">
                                            <span className={`quantity-value ${medicine.quantity <= medicine.minStock ? 'low-stock' : 'in-stock'}`}>
                                                {medicine.quantity} {medicine.unit}
                                            </span>
                                        </div>

                                        <div className="medicine-cell stock-cell">
                                            <div className="stock-progress">
                                                <div className="progress-bar-wrapper">
                                                    <div
                                                        className={`progress-bar ${medicine.quantity === 0 ? 'danger' : medicine.quantity <= medicine.minStock ? 'warning' : 'success'}`}
                                                        style={{ width: `${Math.min((medicine.quantity / medicine.maxStock) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="stock-text">{medicine.quantity}/{medicine.maxStock}</div>
                                            </div>
                                        </div>

                                        <div className="medicine-cell price-cell">
                                            <span className="price-value">{medicine.price.toLocaleString('vi-VN')} ₫</span>
                                        </div>

                                        <div className="medicine-cell location-cell">
                                            <span className="location-badge">
                                                <FaBoxes className="location-icon" />
                                                {medicine.location}
                                            </span>
                                        </div>

                                        <div className="medicine-cell status-cell">
                                            <span className={`status-badge ${medicine.status.toLowerCase().replace(' ', '-')}`}>
                                                {medicine.status === "Còn hàng" && <FaCheckCircle />}
                                                {medicine.status === "Gần hết" && <FaExclamationTriangle />}
                                                {medicine.status === "Hết hàng" && <FaTimesCircle />}
                                                {medicine.status}
                                            </span>
                                        </div>

                                        <div className="medicine-cell action-cell">
                                            <div className="action-buttons">
                                                <button className="action-btn view-btn" title="Xem chi tiết">
                                                    <FaEye />
                                                </button>
                                                <button
                                                    className="action-btn edit-btn"
                                                    title="Chỉnh sửa"
                                                    onClick={() => handleShowModal("edit", medicine)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="action-btn delete-btn"
                                                    title="Xóa"
                                                    onClick={() => {
                                                        setMedicineToDelete(medicine);
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

                            {filteredMedicines.length === 0 && (
                                <div className="empty-state">
                                    <FaPills className="empty-icon" />
                                    <h5>Không tìm thấy thuốc nào</h5>
                                    <p>Thử thay đổi bộ lọc hoặc thêm thuốc mới</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Add/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalType === "add" ? "Thêm thuốc mới" : "Chỉnh sửa thông tin thuốc"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên thuốc *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên thuốc"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Danh mục</Form.Label>
                                        <Form.Select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Chọn danh mục</option>
                                            <option value="Thuốc giảm đau">Thuốc giảm đau</option>
                                            <option value="Vitamin">Vitamin</option>
                                            <option value="Vật tư y tế">Vật tư y tế</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số lượng</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tồn kho tối thiểu</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            value={formData.minStock}
                                            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tồn kho tối đa</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            value={formData.maxStock}
                                            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Đơn vị</Form.Label>
                                        <Form.Select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        >
                                            <option value="Viên">Viên</option>
                                            <option value="Gói">Gói</option>
                                            <option value="Lọ">Lọ</option>
                                            <option value="Hộp">Hộp</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Giá (VND)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vị trí</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="VD: Kệ A1"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hạn sử dụng</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Mã vạch</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập mã vạch"
                                    value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveMedicine}
                            disabled={loading}
                        >
                            {loading && <Spinner animation="border" size="sm" className="me-2" />}
                            {modalType === "add" ? "Thêm thuốc" : "Cập nhật"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Bạn có chắc chắn muốn xóa thuốc <strong>{medicineToDelete?.name}</strong>?</p>
                        <Alert variant="warning">
                            <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị mất.
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleDeleteMedicine}>
                            Xóa thuốc
                        </Button>
                    </Modal.Footer>
                </Modal>
            </motion.div>
        </div>
    );
};

export default MedicineInventory;