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
  FaSortDown,
  FaFolder,
  FaFolderOpen,
  FaPills,
  FaMedkit,
  FaCapsules,
  FaBandAid
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// Styles được import từ main.jsx

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Thuốc kháng sinh",
      description: "Các loại thuốc kháng sinh điều trị nhiễm khuẩn",
      status: "Hoạt động",
      items: 15,
      icon: "FaPills",
      color: "#FF5722"
    },
    {
      id: 2,
      name: "Thuốc giảm đau",
      description: "Thuốc giảm đau và hạ sốt cho các bệnh lý thông thường",
      status: "Hoạt động",
      items: 8,
      icon: "FaCapsules",
      color: "#9C27B0"
    },
    {
      id: 3,
      name: "Vitamin",
      description: "Các loại vitamin và khoáng chất bổ sung dinh dưỡng",
      status: "Hoạt động",
      items: 12,
      icon: "FaMedkit",
      color: "#4CAF50"
    },
    {
      id: 4,
      name: "Vật tư y tế",
      description: "Băng gạc, bông y tế và các dụng cụ y tế khác",
      status: "Tạm ngưng",
      items: 5,
      icon: "FaBandAid",
      color: "#FF9500"
    }
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
    status: "Hoạt động",
    icon: "FaTag",
    color: "#FF9500"
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

  // Helper functions
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaPills,
      FaCapsules,
      FaMedkit,
      FaBandAid,
      FaTag,
      FaFolder
    };
    return iconMap[iconName] || FaTag;
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
        status: category.status,
        icon: category.icon || "FaTag",
        color: category.color || "#FF9500"
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        status: "Hoạt động",
        icon: "FaTag",
        color: "#FF9500"
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
    <div className="admin-categories-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="admin-categories-header">
          <Row className="align-items-center">
            <Col>
              <h1 className="admin-categories-title mb-2">
                <FaFolder className="me-3" />
                Quản lý danh mục
              </h1>
              <p className="admin-categories-subtitle mb-0">
                Quản lý các danh mục thuốc và vật tư y tế với giao diện gradient cam tím hiện đại
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-3">
                <button
                  className="admin-primary-btn"
                  onClick={() => handleShowModal("add")}
                >
                  <FaPlus className="me-2" />
                  Thêm danh mục
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
        <motion.div variants={itemVariants} className="admin-categories-search-bar">
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-categories-search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-categories-search-input"
            style={{ flex: '0 0 200px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Tạm ngưng">Tạm ngưng</option>
            <option value="Ngưng hoạt động">Ngưng hoạt động</option>
          </select>
          <button className="admin-medicine-filter-btn">
            <FaFilter />
            Lọc nâng cao
          </button>
        </motion.div>

        {/* Categories Grid */}
        <motion.div variants={itemVariants} className="admin-categories-grid">
          {/* Add Category Card */}
          <div className="admin-add-category-card" onClick={() => handleShowModal("add")}>
            <div className="admin-add-category-icon">
              <FaPlus />
            </div>
            <div className="admin-add-category-text">Thêm danh mục mới</div>
            <div className="admin-add-category-subtext">Tạo danh mục thuốc và vật tư y tế</div>
          </div>

          {/* Category Cards */}
          <AnimatePresence>
            {filteredCategories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <motion.div
                  key={category.id}
                  className="admin-category-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="admin-category-icon-wrapper">
                    <IconComponent className="admin-category-icon" />
                  </div>

                  <div className="admin-category-name">{category.name}</div>
                  <div className="admin-category-description">{category.description}</div>

                  <div className="admin-category-stats">
                    <div className="admin-category-stat">
                      <div className="admin-category-stat-value">{category.items}</div>
                      <div className="admin-category-stat-label">Sản phẩm</div>
                    </div>
                    <div className="admin-category-stat">
                      <div className="admin-category-stat-value" style={{
                        color: category.status === 'Hoạt động' ? '#4CAF50' :
                          category.status === 'Tạm ngưng' ? '#FF9800' : '#F44336'
                      }}>
                        {category.status === 'Hoạt động' ? '✓' :
                          category.status === 'Tạm ngưng' ? '⏸' : '✗'}
                      </div>
                      <div className="admin-category-stat-label">{category.status}</div>
                    </div>
                  </div>

                  <div className="admin-category-actions">
                    <button
                      className="admin-category-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowModal("edit", category);
                      }}
                    >
                      <FaEdit />
                      Chỉnh sửa
                    </button>
                    <button
                      className="admin-category-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryToDelete(category);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                      Xóa
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredCategories.length === 0 && search && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#757575' }}>
              <FaFolder style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }} />
              <h4>Không tìm thấy danh mục nào</h4>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="admin-categories-modal">
          <Modal.Header closeButton>
            <Modal.Title className="admin-categories-modal-title">
              <FaFolder className="me-2" />
              {modalType === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaTag />
                      Tên danh mục *
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên danh mục"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="admin-categories-form-control"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaList />
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="admin-categories-form-control"
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm ngưng">Tạm ngưng</option>
                      <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaEye />
                      Icon danh mục
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="admin-categories-form-control"
                    >
                      <option value="FaPills">💊 Thuốc viên</option>
                      <option value="FaCapsules">💊 Thuốc nang</option>
                      <option value="FaMedkit">🏥 Dụng cụ y tế</option>
                      <option value="FaBandAid">🩹 Băng gạc</option>
                      <option value="FaTag">🏷️ Thẻ gắn</option>
                      <option value="FaFolder">📁 Thư mục</option>
                    </select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-categories-form-group">
                    <label className="admin-categories-form-label">
                      <FaFilter />
                      Màu chủ đạo
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="admin-categories-form-control"
                    >
                      <option value="#FF9500">🟠 Cam</option>
                      <option value="#9C27B0">🟣 Tím</option>
                      <option value="#4CAF50">🟢 Xanh lá</option>
                      <option value="#2196F3">🔵 Xanh dương</option>
                      <option value="#FF5722">🔴 Đỏ cam</option>
                      <option value="#607D8B">⚫ Xám xanh</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <div className="admin-categories-form-group">
                <label className="admin-categories-form-label">
                  <FaEdit />
                  Mô tả danh mục
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết cho danh mục..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-categories-form-control"
                  style={{ resize: 'vertical', minHeight: '100px' }}
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
              onClick={handleSaveCategory}
              disabled={loading}
            >
              {loading && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>}
              {modalType === "add" ? "Thêm danh mục" : "Cập nhật"}
            </button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="admin-categories-modal">
          <Modal.Header closeButton>
            <Modal.Title className="admin-categories-modal-title">
              <FaTrash className="me-2" />
              Xác nhận xóa danh mục
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center py-4">
              <div className="mb-4">
                <FaFolder style={{ fontSize: '5rem', color: '#F44336', opacity: 0.7 }} />
              </div>
              <h4 className="mb-3">Bạn có chắc chắn muốn xóa danh mục</h4>
              <h4 className="mb-4" style={{ color: '#FF9500', fontWeight: 'bold' }}>
                "{categoryToDelete?.name}"?
              </h4>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                border: '2px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '16px',
                color: '#FF9800'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <FaTrash style={{ marginRight: '0.75rem', fontSize: '1.25rem' }} />
                  <strong>Cảnh báo quan trọng!</strong>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  Thao tác này không thể hoàn tác. Tất cả <strong>{categoryToDelete?.items || 0} sản phẩm</strong> trong
                  danh mục này sẽ bị ảnh hưởng và cần được phân loại lại.
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
              onClick={handleDeleteCategory}
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

export default Categories;
