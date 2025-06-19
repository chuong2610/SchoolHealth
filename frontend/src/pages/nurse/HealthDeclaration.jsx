import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Table, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaRedo,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaIdCard,
  FaGraduationCap,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaPhone,
  FaStickyNote,
  FaUserCheck,
  FaClock,
  FaFileMedical
} from "react-icons/fa";

const declarationsInit = [
  {
    id: "HD001",
    studentId: "HS001",
    studentName: "Nguyễn Văn A",
    class: "Lớp 5A",
    date: "2024-03-01",
    status: "pending",
    symptoms: "Sốt cao, ho, nghi cúm.",
    contact: "0123456789",
    notes: "Theo dõi tại nhà, uống thuốc hạ sốt.",
    confirmedBy: null,
    confirmedAt: null
  },
  {
    id: "HD002",
    studentId: "HS002",
    studentName: "Trần Thị B",
    class: "Lớp 6B",
    date: "2024-03-05",
    status: "confirmed",
    symptoms: "Phát ban sau khi ăn đậu phộng.",
    contact: "0987654321",
    notes: "Uống thuốc kháng histamin, tránh xa tác nhân gây dị ứng.",
    confirmedBy: "Y tá Nguyễn Thị C",
    confirmedAt: "2024-03-05T10:30:00"
  },
  {
    id: "HD003",
    studentId: "HS003",
    studentName: "Lê Văn C",
    class: "Lớp 7C",
    date: "2024-03-10",
    status: "rejected",
    symptoms: "Đau cổ tay sau khi chơi thể thao.",
    contact: "0123456789",
    notes: "Nghỉ ngơi, chườm lạnh.",
    confirmedBy: "Y tá Trần Văn D",
    confirmedAt: "2024-03-10T14:20:00"
  },
  {
    id: "HD004",
    studentId: "HS004",
    studentName: "Phạm Thị D",
    class: "Lớp 8D",
    date: "2024-03-12",
    status: "pending",
    symptoms: "Đau họng, sổ mũi.",
    contact: "0987654321",
    notes: "Uống nước ấm, súc miệng.",
    confirmedBy: null,
    confirmedAt: null
  },
  {
    id: "HD005",
    studentId: "HS005",
    studentName: "Hoàng Văn E",
    class: "Lớp 9E",
    date: "2024-03-15",
    status: "confirmed",
    symptoms: "Kiểm tra sức khỏe tổng quát.",
    contact: "0123456789",
    notes: "Tình trạng sức khỏe tốt.",
    confirmedBy: "Y tá Lê Thị F",
    confirmedAt: "2024-03-15T09:15:00"
  }
];

const HealthDeclaration = () => {
  const [declarations, setDeclarations] = useState(declarationsInit);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalDetail, setModalDetail] = useState({
    show: false,
    data: null,
  });
  const [modalAdd, setModalAdd] = useState({
    show: false,
    data: {
      studentId: "",
      studentName: "",
      class: "",
      symptoms: "",
      contact: "",
      notes: "",
    },
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleViewDetail = (declaration) => {
    setModalDetail({
      show: true,
      data: declaration,
    });
  };

  const handleConfirm = (id) => {
    setDeclarations(
      declarations.map((item) =>
        item.id === id
          ? {
            ...item,
            status: "confirmed",
            confirmedBy: "Y tá hiện tại",
            confirmedAt: new Date().toISOString(),
          }
          : item
      )
    );
  };

  const handleReject = (id) => {
    setDeclarations(
      declarations.map((item) =>
        item.id === id
          ? {
            ...item,
            status: "rejected",
            confirmedBy: "Y tá hiện tại",
            confirmedAt: new Date().toISOString(),
          }
          : item
      )
    );
  };

  const handleAddNew = () => {
    setModalAdd({
      show: true,
      data: {
        studentId: "",
        studentName: "",
        class: "",
        symptoms: "",
        contact: "",
        notes: "",
      },
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newDeclaration = {
      id: `HD${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      ...modalAdd.data,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      confirmedBy: null,
      confirmedAt: null,
    };
    setDeclarations([newDeclaration, ...declarations]);
    setModalAdd({ show: false, data: {} });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setModalAdd((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
    }));
  };

  const filteredDeclarations = declarations.filter((declaration) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && declaration.status === "pending") ||
      (filter === "confirmed" && declaration.status === "confirmed") ||
      (filter === "rejected" && declaration.status === "rejected");

    const matchesSearch =
      declaration.studentName.toLowerCase().includes(search.toLowerCase()) ||
      declaration.studentId.toLowerCase().includes(search.toLowerCase()) ||
      declaration.class.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: "warning",
        icon: <FaClock className="me-1" />,
        text: "Chờ xác nhận"
      },
      confirmed: {
        variant: "success",
        icon: <FaCheck className="me-1" />,
        text: "Đã xác nhận"
      },
      rejected: {
        variant: "danger",
        icon: <FaTimes className="me-1" />,
        text: "Đã từ chối"
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge bg={config.variant} className="status-badge">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="health-declaration">
      <div className="search-filter-card">
        <div className="card-header">
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="page-title">
                <FaPlus className="me-2" />
                Khai báo Y tế
              </h2>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Button variant="primary" className="add-btn" onClick={handleAddNew}>
                <FaPlus className="me-2" />
                Thêm mới
              </Button>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <Row className="g-3">
            <Col md={6}>
              <div className="search-group">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã học sinh, lớp..."
                  value={search}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filter}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">Tất cả khai báo</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="rejected">Đã từ chối</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Đặt lại bộ lọc</Tooltip>}
              >
                <Button
                  variant="light"
                  className="reset-btn"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                  disabled={filter === "all" && !search}
                >
                  <FaRedo />
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </div>
      </div>

      <div className="data-table-card">
        <Table className="data-table">
          <thead>
            <tr>
              <th>Mã học sinh</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th>Ngày khai báo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeclarations.length > 0 ? (
              filteredDeclarations.map((declaration) => (
                <tr key={declaration.id} className="table-row">
                  <td>{declaration.studentId}</td>
                  <td>{declaration.studentName}</td>
                  <td>{declaration.class}</td>
                  <td>{new Date(declaration.date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(declaration.status)}</td>
                  <td className="action-cell">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Xem chi tiết</Tooltip>}
                    >
                      <Button
                        variant="info"
                        size="sm"
                        className="action-btn view-btn"
                        onClick={() => handleViewDetail(declaration)}
                      >
                        <FaEye className="me-1" />
                        Xem
                      </Button>
                    </OverlayTrigger>
                    {declaration.status === "pending" && (
                      <>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Xác nhận khai báo</Tooltip>}
                        >
                          <Button
                            variant="success"
                            size="sm"
                            className="action-btn confirm-btn"
                            onClick={() => handleConfirm(declaration.id)}
                          >
                            <FaCheck className="me-1" />
                            Xác nhận
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Từ chối khai báo</Tooltip>}
                        >
                          <Button
                            variant="danger"
                            size="sm"
                            className="action-btn reject-btn"
                            onClick={() => handleReject(declaration.id)}
                          >
                            <FaTimes className="me-1" />
                            Từ chối
                          </Button>
                        </OverlayTrigger>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center no-data">
                  Không tìm thấy khai báo nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Modal
        show={modalDetail.show}
        onHide={() => setModalDetail({ show: false, data: null })}
        centered
        size="lg"
        className="detail-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FaFileMedical className="me-2" />
            Chi tiết khai báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalDetail.data && (
            <div className="detail-content">
              <div className="detail-section">
                <h4 className="section-title">
                  <FaUser className="me-2" />
                  Thông tin học sinh
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaIdCard className="me-2" />
                      Mã học sinh
                    </span>
                    <span className="detail-value">{modalDetail.data.studentId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaUser className="me-2" />
                      Họ tên
                    </span>
                    <span className="detail-value">{modalDetail.data.studentName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaGraduationCap className="me-2" />
                      Lớp
                    </span>
                    <span className="detail-value">{modalDetail.data.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaCalendarAlt className="me-2" />
                      Ngày khai báo
                    </span>
                    <span className="detail-value">
                      {new Date(modalDetail.data.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="section-title">
                  <FaExclamationTriangle className="me-2" />
                  Thông tin sức khỏe
                </h4>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">
                      <FaExclamationTriangle className="me-2" />
                      Triệu chứng
                    </span>
                    <span className="detail-value">{modalDetail.data.symptoms}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaPhone className="me-2" />
                      Liên hệ
                    </span>
                    <span className="detail-value">{modalDetail.data.contact}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">
                      <FaStickyNote className="me-2" />
                      Ghi chú
                    </span>
                    <span className="detail-value">{modalDetail.data.notes}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="section-title">
                  <FaUserCheck className="me-2" />
                  Thông tin xác nhận
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">
                      <FaClock className="me-2" />
                      Trạng thái
                    </span>
                    <span className="detail-value">
                      {getStatusBadge(modalDetail.data.status)}
                    </span>
                  </div>
                  {modalDetail.data.confirmedBy && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <FaUserCheck className="me-2" />
                        Người xác nhận
                      </span>
                      <span className="detail-value">{modalDetail.data.confirmedBy}</span>
                    </div>
                  )}
                  {modalDetail.data.confirmedAt && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <FaCalendarAlt className="me-2" />
                        Thời gian xác nhận
                      </span>
                      <span className="detail-value">
                        {new Date(modalDetail.data.confirmedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="close-btn"
            onClick={() => setModalDetail({ show: false, data: null })}
          >
            <FaTimes className="me-2" />
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Modal */}
      <Modal
        show={modalAdd.show}
        onHide={() => setModalAdd({ show: false, data: {} })}
        centered
        className="add-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm khai báo mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <div className="form-section">
              <h4 className="section-title">Thông tin học sinh</h4>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label">Mã học sinh</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentId"
                      value={modalAdd.data.studentId}
                      onChange={handleAddChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label">Họ tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentName"
                      value={modalAdd.data.studentName}
                      onChange={handleAddChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label">Lớp</Form.Label>
                    <Form.Control
                      type="text"
                      name="class"
                      value={modalAdd.data.class}
                      onChange={handleAddChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section">
              <h4 className="section-title">Thông tin sức khỏe</h4>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label">Triệu chứng</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="symptoms"
                      value={modalAdd.data.symptoms}
                      onChange={handleAddChange}
                      required
                      className="form-textarea"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label">Liên hệ</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={modalAdd.data.contact}
                      onChange={handleAddChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label">Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="notes"
                      value={modalAdd.data.notes}
                      onChange={handleAddChange}
                      className="form-textarea"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                className="cancel-btn"
                onClick={() => setModalAdd({ show: false, data: {} })}
              >
                Hủy
              </Button>
              <Button type="submit" className="submit-btn">
                Thêm mới
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HealthDeclaration;
