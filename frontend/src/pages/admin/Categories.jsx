import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus, FaListUl } from "react-icons/fa";

const initialMedicineCategories = [
  {
    id: "MED101",
    name: "Thuốc giảm đau",
    description: "Các loại thuốc giảm đau thông thường",
    unit: "Viên",
    prescriptionRequired: false,
    count: 15,
    items: [
      { name: "Paracetamol 500mg", type: "Viên" },
      { name: "Ibuprofen 400mg", type: "Viên" },
      { name: "Aspirin 500mg", type: "Viên" },
    ],
  },
  {
    id: "MED102",
    name: "Thuốc kháng sinh",
    description: "Các loại thuốc kháng sinh thông dụng",
    unit: "Viên",
    prescriptionRequired: true,
    count: 8,
    items: [
      { name: "Amoxicillin 500mg", type: "Viên" },
      { name: "Azithromycin 250mg", type: "Viên" },
    ],
  },
  {
    id: "MED103",
    name: "Băng y tế",
    description: "Vật tư y tế dùng để băng bó",
    unit: "Hộp",
    prescriptionRequired: false,
    count: 5,
    items: [
      { name: "Băng gạc vô trùng 10x10cm", type: "Gói" },
      { name: "Băng keo y tế", type: "Cuộn" },
    ],
  },
];

const initialFormCategories = [
  {
    id: "FORM201",
    name: "Phiếu tiêm chủng",
    description: "Phiếu tiêm chủng cho học sinh",
    template: "vaccination",
    requireSignature: false,
    count: 3,
    items: [
      { name: "Phiếu tiêm chủng mũi 1", type: "PDF" },
      { name: "Phiếu tiêm chủng mũi 2", type: "PDF" },
      { name: "Phiếu tiêm chủng mũi 3", type: "PDF" },
    ],
  },
  {
    id: "FORM202",
    name: "Phiếu khám sức khỏe",
    description: "Phiếu khám sức khỏe định kỳ",
    template: "medical_examination",
    requireSignature: true,
    count: 2,
    items: [
      { name: "Phiếu khám sức khỏe học sinh", type: "PDF" },
      { name: "Phiếu khám sức khỏe giáo viên", type: "PDF" },
    ],
  },
  {
    id: "FORM203",
    name: "Phiếu theo dõi bệnh",
    description: "Phiếu theo dõi bệnh mãn tính",
    template: "monitoring",
    requireSignature: false,
    count: 4,
    items: [
      { name: "Phiếu theo dõi huyết áp", type: "PDF" },
      { name: "Phiếu theo dõi tiểu đường", type: "PDF" },
      { name: "Phiếu theo dõi hen suyễn", type: "PDF" },
      { name: "Phiếu theo dõi dị ứng", type: "PDF" },
    ],
  },
];

const formTemplates = [
  { value: "medical_examination", label: "Khám sức khỏe" },
  { value: "vaccination", label: "Tiêm chủng" },
  { value: "medication", label: "Cấp phát thuốc" },
  { value: "monitoring", label: "Theo dõi bệnh" },
  { value: "custom", label: "Tùy chỉnh" },
];

const Categories = () => {
  const [medicineCategories, setMedicineCategories] = useState(
    initialMedicineCategories
  );
  const [formCategories, setFormCategories] = useState(initialFormCategories);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add | edit
  const [categoryType, setCategoryType] = useState("medicine");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    unit: "Viên",
    prescriptionRequired: false,
    template: "medical_examination",
    requireSignature: false,
  });

  // Mở modal thêm mới
  const handleShowAdd = (type) => {
    setModalType("add");
    setCategoryType(type);
    setFormState({
      name: "",
      description: "",
      unit: "Viên",
      prescriptionRequired: false,
      template: "medical_examination",
      requireSignature: false,
    });
    setShowAddEditModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (type, cat) => {
    setModalType("edit");
    setCategoryType(type);
    setSelectedCategory(cat);
    setFormState({
      name: cat.name,
      description: cat.description,
      unit: cat.unit || "Viên",
      prescriptionRequired: cat.prescriptionRequired || false,
      template: cat.template || "medical_examination",
      requireSignature: cat.requireSignature || false,
    });
    setShowAddEditModal(true);
  };

  // Mở modal chi tiết
  const handleShowDetail = (type, cat) => {
    setCategoryType(type);
    setSelectedCategory(cat);
    setShowDetailModal(true);
  };

  // Lưu danh mục
  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    if (categoryType === "medicine") {
      if (modalType === "add") {
        setMedicineCategories([
          ...medicineCategories,
          {
            id: `MED${Math.floor(Math.random() * 900) + 100}`,
            name: formState.name,
            description: formState.description,
            unit: formState.unit,
            prescriptionRequired: formState.prescriptionRequired,
            count: 0,
            items: [],
          },
        ]);
      } else if (modalType === "edit" && selectedCategory) {
        setMedicineCategories(
          medicineCategories.map((cat) =>
            cat.id === selectedCategory.id
              ? {
                  ...cat,
                  name: formState.name,
                  description: formState.description,
                  unit: formState.unit,
                  prescriptionRequired: formState.prescriptionRequired,
                }
              : cat
          )
        );
      }
    } else {
      if (modalType === "add") {
        setFormCategories([
          ...formCategories,
          {
            id: `FORM${Math.floor(Math.random() * 900) + 100}`,
            name: formState.name,
            description: formState.description,
            template: formState.template,
            requireSignature: formState.requireSignature,
            count: 0,
            items: [],
          },
        ]);
      } else if (modalType === "edit" && selectedCategory) {
        setFormCategories(
          formCategories.map((cat) =>
            cat.id === selectedCategory.id
              ? {
                  ...cat,
                  name: formState.name,
                  description: formState.description,
                  template: formState.template,
                  requireSignature: formState.requireSignature,
                }
              : cat
          )
        );
      }
    }
    setShowAddEditModal(false);
  };

  // Xóa danh mục
  const handleDelete = () => {
    if (categoryType === "medicine") {
      setMedicineCategories(
        medicineCategories.filter((cat) => cat.id !== selectedCategory.id)
      );
    } else {
      setFormCategories(
        formCategories.filter((cat) => cat.id !== selectedCategory.id)
      );
    }
    setShowDeleteModal(false);
  };

  // Hiển thị danh sách danh mục
  const renderCategoryList = (type, categories) => (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          {type === "medicine" ? "Loại thuốc & vật tư" : "Mẫu phiếu"}
        </h5>
        <div className="list-group">
          {categories.length === 0 ? (
            <div className="text-muted small text-center p-2">
              Chưa có danh mục
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <span>{cat.name}</span>
                <div>
                  <span
                    className="badge bg-primary rounded-pill me-2"
                    style={{
                      fontSize: 10,
                      minWidth: 32,
                      minHeight: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cat.count || 0}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="btn-view-category"
                      onClick={() => handleShowDetail(type, cat)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="btn-edit-category"
                      onClick={() => handleShowEdit(type, cat)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-delete-category"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryType(type);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Button
          className="btn btn-primary w-100 mt-3"
          onClick={() => handleShowAdd(type)}
        >
          <FaPlus /> Thêm mới
        </Button>
      </div>
    </div>
  );

  // Modal Thêm/Sửa
  const renderAddEditModal = () => (
    <Modal show={showAddEditModal} onHide={() => setShowAddEditModal(false)}>
      <Form onSubmit={handleSave} autoComplete="off">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add"
              ? `Thêm mới ${
                  categoryType === "medicine" ? "Thuốc & Vật tư" : "Mẫu Phiếu"
                }`
              : `Chỉnh sửa ${
                  categoryType === "medicine" ? "Thuốc & Vật tư" : "Mẫu Phiếu"
                }`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          {categoryType === "medicine" ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Đơn vị</Form.Label>
                <Form.Control
                  value={formState.unit}
                  onChange={(e) =>
                    setFormState({ ...formState, unit: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Cần đơn thuốc khi cấp phát"
                  checked={formState.prescriptionRequired}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      prescriptionRequired: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </>
          ) : (
            <>
              <h6 className="mb-3">Thông tin bổ sung cho mẫu phiếu</h6>
              <Form.Group className="mb-3">
                <Form.Label>Mẫu phiếu</Form.Label>
                <Form.Select
                  value={formState.template}
                  onChange={(e) =>
                    setFormState({ ...formState, template: e.target.value })
                  }
                >
                  {formTemplates.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Yêu cầu chữ ký"
                  checked={formState.requireSignature}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      requireSignature: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddEditModal(false)}
          >
            Hủy
          </Button>
          <Button type="submit" variant="success">
            Lưu danh mục
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );

  // Modal Chi tiết
  const renderDetailModal = () => (
    <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Chi tiết{" "}
          {categoryType === "medicine" ? "Thuốc & Vật tư" : "Mẫu Phiếu"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label fw-bold">Tên danh mục</label>
          <div className="form-control-plaintext">{selectedCategory?.name}</div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Mô tả</label>
          <div className="form-control-plaintext">
            {selectedCategory?.description}
          </div>
        </div>
        {categoryType === "medicine" ? (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">Đơn vị</label>
              <div className="form-control-plaintext">
                {selectedCategory?.unit}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">
                Cần đơn thuốc khi cấp phát
              </label>
              <div className="form-control-plaintext">
                {selectedCategory?.prescriptionRequired ? "Có" : "Không"}
              </div>
            </div>
          </>
        ) : (
          <>
            <h6 className="mb-3">Thông tin bổ sung cho mẫu phiếu</h6>
            <div className="mb-3">
              <label className="form-label fw-bold">Mẫu phiếu</label>
              <div className="form-control-plaintext">
                {
                  formTemplates.find(
                    (t) => t.value === selectedCategory?.template
                  )?.label
                }
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Yêu cầu chữ ký</label>
              <div className="form-control-plaintext">
                {selectedCategory?.requireSignature ? "Có" : "Không"}
              </div>
            </div>
          </>
        )}
        <div className="mb-3">
          <h6 className="mb-2">
            Danh sách các mục ({selectedCategory?.items?.length || 0})
          </h6>
          <div className="list-group mb-2">
            {selectedCategory?.items && selectedCategory.items.length > 0 ? (
              selectedCategory.items.map((item, idx) => (
                <div
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name}
                  <Badge bg="info">{item.type || "---"}</Badge>
                </div>
              ))
            ) : (
              <div className="text-muted small text-center p-2">
                Chưa có mục nào trong danh mục này
              </div>
            )}
          </div>
          <Button size="sm" variant="outline-primary" className="mt-2">
            <FaListUl /> Quản lý danh sách
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Modal xác nhận xóa
  const renderDeleteModal = () => (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Bạn có chắc chắn muốn xóa danh mục{" "}
          <strong>{selectedCategory?.name}</strong>?
        </p>
        <p className="text-danger">
          <small>Thao tác này không thể hoàn tác.</small>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Hủy
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div
      style={{ background: "#f8f9fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container py-4">
        <h2 className="mb-4 text-center fw-bold" style={{ fontSize: 36 }}>
          Quản lý danh mục
        </h2>
        <Row className="g-4">
          <Col md={6}>{renderCategoryList("medicine", medicineCategories)}</Col>
          <Col md={6}>{renderCategoryList("form", formCategories)}</Col>
        </Row>
      </div>
      {renderAddEditModal()}
      {renderDetailModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default Categories;
