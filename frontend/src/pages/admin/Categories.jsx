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
  Spinner
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaList,
  FaTag,
  FaFilter,
  FaDownload,
  FaUpload,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// Styles được import từ main.jsx

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Thuốc kháng sinh", description: "Các loại thuốc kháng sinh", status: "Hoạt động", items: 15 },
    { id: 2, name: "Thuốc giảm đau", description: "Thuốc giảm đau và hạ sốt", status: "Hoạt động", items: 8 },
    { id: 3, name: "Vitamin", description: "Các loại vitamin và khoáng chất", status: "Hoạt động", items: 12 },
    { id: 4, name: "Vật tư y tế", description: "Băng gạc, bông y tế", status: "Tạm ngưng", items: 5 }
  ]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "Hoạt động"
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

  // Filter và sort categories
  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || category.status === filterStatus;
      return matchesSearch && matchesStatus;
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

  const handleShowModal = (type, category = null) => {
    setModalType(type);
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        status: "Hoạt động"
      });
    }
    setShowModal(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (modalType === "add") {
        const newCategory = {
          ...formData,
          id: Date.now(),
          items: 0
        };
        setCategories([...categories, newCategory]);
      } else {
        setCategories(categories.map(cat =>
          cat.id === formData.id ? { ...cat, ...formData } : cat
        ));
      }

      setShowModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
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
      "Hoạt động": "success",
      "Tạm ngưng": "warning",
      "Ngưng hoạt động": "danger"
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

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
                <FaList className="me-3" />
                Quản lý danh mục
              </h1>
              <p className="accounts-subtitle mb-0">
                Quản lý các danh mục thuốc và vật tư y tế trong hệ thống
              </p>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="btn-primary"
                onClick={() => handleShowModal("add")}
              >
                <FaPlus className="me-2" />
                Thêm danh mục
              </Button>
            </Col>
          </Row>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants} className="search-filter-bar mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
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
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm ngưng">Tạm ngưng</option>
                <option value="Ngưng hoạt động">Ngưng hoạt động</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" className="w-100">
                  <FaFilter className="me-2" />
                  Tùy chọn
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <FaDownload className="me-2" />
                    Xuất Excel
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <FaUpload className="me-2" />
                    Nhập Excel
                  </Dropdown.Item>
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
                <FaList size={24} />
              </div>
              <div className="stat-value">{categories.length}</div>
              <div className="stat-label">Tổng danh mục</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-success mb-2">
                <FaTag size={24} />
              </div>
              <div className="stat-value">
                {categories.filter(c => c.status === "Hoạt động").length}
              </div>
              <div className="stat-label">Đang hoạt động</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-warning mb-2">
                <FaTag size={24} />
              </div>
              <div className="stat-value">
                {categories.filter(c => c.status === "Tạm ngưng").length}
              </div>
              <div className="stat-label">Tạm ngưng</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div className="stat-icon text-info mb-2">
                <FaTag size={24} />
              </div>
              <div className="stat-value">
                {categories.reduce((sum, c) => sum + c.items, 0)}
              </div>
              <div className="stat-label">Tổng sản phẩm</div>
            </div>
          </div>
        </motion.div>

        {/* Categories Table */}
        <motion.div variants={itemVariants}>
          <div className="category-table-wrapper">
            <div className="category-table-header">
              <div className="category-table-row header-row">
                <div className="category-cell name-cell" onClick={() => handleSort('name')}>
                  <span>Tên danh mục {getSortIcon('name')}</span>
                </div>
                <div className="category-cell description-cell">
                  <span>Mô tả</span>
                </div>
                <div className="category-cell items-cell" onClick={() => handleSort('items')}>
                  <span>Số sản phẩm {getSortIcon('items')}</span>
                </div>
                <div className="category-cell status-cell">
                  <span>Trạng thái</span>
                </div>
                <div className="category-cell action-cell">
                  <span>Thao tác</span>
                </div>
              </div>
            </div>

            <div className="category-table-body">
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="category-table-row data-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="category-cell name-cell">
                      <div className="category-info">
                        <div className="category-icon">
                          <FaTag />
                        </div>
                        <div className="category-details">
                          <div className="category-name">{category.name}</div>
                          <div className="category-id">ID: {category.id}</div>
                        </div>
                      </div>
                    </div>

                    <div className="category-cell description-cell">
                      <div className="category-description">{category.description}</div>
                    </div>

                    <div className="category-cell items-cell">
                      <div className="items-info">
                        <div className="items-count">{category.items}</div>
                        <div className="items-label">sản phẩm</div>
                      </div>
                    </div>

                    <div className="category-cell status-cell">
                      <span className={`status-badge ${category.status.toLowerCase().replace(' ', '-')}`}>
                        {category.status}
                      </span>
                    </div>

                    <div className="category-cell action-cell">
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="Xem chi tiết">
                          <FaEye />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          title="Chỉnh sửa"
                          onClick={() => handleShowModal("edit", category)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Xóa"
                          onClick={() => {
                            setCategoryToDelete(category);
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

              {filteredCategories.length === 0 && (
                <div className="empty-state">
                  <FaTag className="empty-icon" />
                  <h5>Không tìm thấy danh mục nào</h5>
                  <p>Thử thay đổi bộ lọc hoặc thêm danh mục mới</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaTag className="me-2" />
              {modalType === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên danh mục *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên danh mục"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm ngưng">Tạm ngưng</option>
                      <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả danh mục"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              onClick={handleSaveCategory}
              disabled={loading}
            >
              {loading && <Spinner animation="border" size="sm" className="me-2" />}
              {modalType === "add" ? "Thêm danh mục" : "Cập nhật"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaTrash className="me-2 text-danger" />
              Xác nhận xóa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center py-3">
              <div className="text-danger mb-3">
                <FaTrash size={48} />
              </div>
              <h5>Bạn có chắc chắn muốn xóa danh mục</h5>
              <h5 className="text-primary">"{categoryToDelete?.name}"?</h5>
              <Alert variant="warning" className="mt-3">
                <strong>Cảnh báo:</strong> Thao tác này không thể hoàn tác. Tất cả sản phẩm trong danh mục này sẽ bị ảnh hưởng.
              </Alert>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteCategory}>
              <FaTrash className="me-2" />
              Xóa danh mục
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </div>
  );
};

export default Categories;
