import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Table, Badge } from "react-bootstrap";
import { FaEye, FaCheck, FaTimes, FaPlus, FaFilter, FaSearch, FaFileMedical } from "react-icons/fa";

const declarationsInit = [
  {
    id: "HD001",
    student: "Nguyễn Văn A - Lớp 5A",
    type: "Bệnh truyền nhiễm",
    date: "01/03/2024",
    status: "Chờ xác nhận",
    statusType: "warning",
    reporter: "Phụ huynh",
    desc: "Sốt cao, ho, nghi cúm.",
    solution: "Theo dõi tại nhà, uống thuốc hạ sốt.",
  },
  {
    id: "HD002",
    student: "Trần Thị B - Lớp 6B",
    type: "Dị ứng",
    date: "05/03/2024",
    status: "Đã xác nhận",
    statusType: "success",
    reporter: "Nhân viên y tế",
    desc: "Phát ban sau khi ăn đậu phộng.",
    solution: "Uống thuốc kháng histamin, tránh xa tác nhân gây dị ứng.",
  },
  {
    id: "HD003",
    student: "Lê Văn C - Lớp 7C",
    type: "Chấn thương",
    date: "10/03/2024",
    status: "Đã từ chối",
    statusType: "danger",
    reporter: "Học sinh",
    desc: "Đau cổ tay sau khi chơi thể thao.",
    solution: "Nghỉ ngơi, chườm lạnh.",
  },
  {
    id: "HD004",
    student: "Phạm Thị D - Lớp 8D",
    type: "Bệnh thông thường",
    date: "12/03/2024",
    status: "Chờ xác nhận",
    statusType: "warning",
    reporter: "Phụ huynh",
    desc: "Đau họng, sổ mũi.",
    solution: "Uống nước ấm, súc miệng.",
  },
  {
    id: "HD005",
    student: "Hoàng Văn E - Lớp 9E",
    type: "Kiểm tra định kỳ",
    date: "15/03/2024",
    status: "Đã xác nhận",
    statusType: "success",
    reporter: "Nhà trường",
    desc: "Kiểm tra sức khỏe tổng quát.",
    solution: "Tình trạng sức khỏe tốt.",
  },
  {
    id: "HD006",
    student: "Đỗ Thị F - Lớp 10A",
    type: "Cảm cúm",
    date: "18/03/2024",
    status: "Chờ xác nhận",
    statusType: "warning",
    reporter: "Phụ huynh",
    desc: "Sốt nhẹ, mệt mỏi.",
    solution: "Uống thuốc hạ sốt, nghỉ ngơi.",
  },
  {
    id: "HD007",
    student: "Vũ Văn G - Lớp 11B",
    type: "Đau đầu",
    date: "20/03/2024",
    status: "Đã xác nhận",
    statusType: "success",
    reporter: "Học sinh",
    desc: "Đau đầu do áp lực học tập.",
    solution: "Nghỉ ngơi, thư giãn.",
  },
  {
    id: "HD008",
    student: "Đặng Thị H - Lớp 12C",
    type: "Sổ mũi",
    date: "22/03/2024",
    status: "Đã từ chối",
    statusType: "danger",
    reporter: "Phụ huynh",
    desc: "Sổ mũi kéo dài, không sốt.",
    solution: "Uống thuốc cảm.",
  },
  {
    id: "HD009",
    student: "Bùi Văn I - Lớp 5B",
    type: "Đau bụng",
    date: "25/03/2024",
    status: "Chờ xác nhận",
    statusType: "warning",
    reporter: "Phụ huynh",
    desc: "Đau bụng nhẹ sau khi ăn.",
    solution: "Nghỉ ngơi, uống nước ấm.",
  },
  {
    id: "HD010",
    student: "Ngô Thị K - Lớp 6A",
    type: "Viêm họng",
    date: "28/03/2024",
    status: "Đã xác nhận",
    statusType: "success",
    reporter: "Nhân viên y tế",
    desc: "Viêm họng đỏ, nuốt khó.",
    solution: "Uống kháng sinh, súc miệng nước muối.",
  },
];

const HealthDeclaration = () => {
  const [declarations, setDeclarations] = useState(declarationsInit);
  const [filter, setFilter] = useState("all"); // Default to 'all'
  const [search, setSearch] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeclaration, setNewDeclaration] = useState({
    student: "",
    type: "",
    date: "",
    reporter: "",
    desc: "",
    solution: "",
  });

  const filteredDeclarations = declarations.filter(
    (d) =>
      (filter === "all" ||
        (filter === "pending" && d.statusType === "warning") ||
        (filter === "confirmed" && d.statusType === "success") ||
        (filter === "rejected" && d.statusType === "danger")) &&
      (d.student.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase()) ||
        d.reporter.toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = (d) => {
    setDeclarations(
      declarations.map((item) =>
        item.id === d.id
          ? { ...item, status: "Đã xác nhận", statusType: "success" }
          : item
      )
    );
  };

  const handleReject = (d) => {
    setDeclarations(
      declarations.map((item) =>
        item.id === d.id
          ? { ...item, status: "Đã từ chối", statusType: "danger" }
          : item
      )
    );
  };

  const handleAddDeclaration = (e) => {
    e.preventDefault();
    setDeclarations([
      {
        id: `HD${Math.floor(Math.random() * 1000)}`,
        ...newDeclaration,
        status: "Chờ xác nhận",
        statusType: "warning",
      },
      ...declarations,
    ]);
    setShowAddModal(false);
    setNewDeclaration({
      student: "",
      type: "",
      date: "",
      reporter: "",
      desc: "",
      solution: "",
    });
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <FaFileMedical className="me-2" /> Khai báo Y tế
        </h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Tìm kiếm theo tên, loại khai báo..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <Form.Select
                className="form-control bg-light border-0 small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="rejected">Đã từ chối</option>
              </Form.Select>
            </div>
            <div className="col-md-3 text-md-end">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" /> Thêm khai báo mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Danh sách Khai báo Y tế</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Học sinh</th>
                  <th>Loại khai báo</th>
                  <th>Ngày khai báo</th>
                  <th>Trạng thái</th>
                  <th>Người khai báo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeclarations.length > 0 ? (
                  filteredDeclarations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.student}</td>
                      <td>{d.type}</td>
                      <td>{d.date}</td>
                      <td>
                        <Badge bg={d.statusType}>
                          {d.status}
                        </Badge>
                      </td>
                      <td>{d.reporter}</td>
                      <td>
                        <Button variant="info" size="sm" className="btn-circle me-1" onClick={() => setModalDetail(d)} title="Xem chi tiết">
                          <FaEye />
                        </Button>
                        {d.statusType === "warning" && (
                          <>
                            <Button variant="success" size="sm" className="btn-circle me-1" onClick={() => handleConfirm(d)} title="Xác nhận">
                              <FaCheck />
                            </Button>
                            <Button variant="danger" size="sm" className="btn-circle" onClick={() => handleReject(d)} title="Từ chối">
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">Không có khai báo nào</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal show={modalDetail !== null} onHide={() => setModalDetail(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết khai báo y tế</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalDetail && (
            <>
              <p><strong>Mã khai báo:</strong> {modalDetail.id}</p>
              <p><strong>Ngày khai báo:</strong> {modalDetail.date}</p>
              <p><strong>Học sinh:</strong> {modalDetail.student}</p>
              <p><strong>Người khai báo:</strong> {modalDetail.reporter}</p>
              <p><strong>Loại khai báo:</strong> {modalDetail.type}</p>
              <p><strong>Trạng thái:</strong> <Badge bg={modalDetail.statusType}>{modalDetail.status}</Badge></p>
              <p><strong>Mô tả:</strong> {modalDetail.desc}</p>
              <p><strong>Giải pháp:</strong> {modalDetail.solution}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalDetail(null)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Declaration Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm khai báo mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddDeclaration}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formStudentName">
                <Form.Label>Học sinh</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên học sinh"
                  value={newDeclaration.student}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, student: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formDeclarationType">
                <Form.Label>Loại khai báo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Sốt, Dị ứng, Chấn thương..."
                  value={newDeclaration.type}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, type: e.target.value })}
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formDeclarationDate">
                <Form.Label>Ngày khai báo</Form.Label>
                <Form.Control
                  type="date"
                  value={newDeclaration.date}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, date: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formReporter">
                <Form.Label>Người khai báo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Phụ huynh, Học sinh, Y tá..."
                  value={newDeclaration.reporter}
                  onChange={(e) => setNewDeclaration({ ...newDeclaration, reporter: e.target.value })}
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả chi tiết tình trạng sức khỏe..."
                value={newDeclaration.desc}
                onChange={(e) => setNewDeclaration({ ...newDeclaration, desc: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSolution">
              <Form.Label>Giải pháp</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Giải pháp đã thực hiện hoặc đề xuất..."
                value={newDeclaration.solution}
                onChange={(e) => setNewDeclaration({ ...newDeclaration, solution: e.target.value })}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
              <Button variant="primary" type="submit">Thêm mới</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HealthDeclaration;
