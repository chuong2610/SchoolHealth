import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const requests = [
  {
    id: 1,
    sender: "Nguyễn Văn A",
    type: "Thuốc",
    typeClass: "badge bg-primary",
    name: "Paracetamol 500mg",
    quantity: "200 viên",
    date: "2024-04-01",
    status: "Chờ duyệt",
    statusClass: "badge bg-warning text-dark",
    approved: false,
    note: "Cần bổ sung cho kho lớp 1A",
  },
  {
    id: 2,
    sender: "Trần Thị B",
    type: "Vật tư",
    typeClass: "badge bg-info text-dark",
    name: "Băng gạc y tế",
    quantity: "50 cuộn",
    date: "2024-03-28",
    status: "Đã duyệt",
    statusClass: "badge bg-success",
    approved: true,
    note: "Dùng cho phòng y tế",
  },
];

const requestTypes = ["Thuốc", "Vật tư"];

const MedicineRequests = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editMode, setEditMode] = useState("add");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form, setForm] = useState({
    sender: "",
    type: requestTypes[0],
    name: "",
    quantity: "",
    date: "",
    note: "",
  });

  // Mở modal thêm mới
  const handleShowAdd = () => {
    setEditMode("add");
    setForm({
      sender: "",
      type: requestTypes[0],
      name: "",
      quantity: "",
      date: "",
      note: "",
    });
    setShowEditModal(true);
  };
  // Mở modal sửa
  const handleShowEdit = (req) => {
    setEditMode("edit");
    setForm({
      sender: req.sender,
      type: req.type,
      name: req.name,
      quantity: req.quantity,
      date: req.date,
      note: req.note || "",
    });
    setSelectedRequest(req);
    setShowEditModal(true);
  };
  // Mở modal chi tiết
  const handleShowDetail = (req) => {
    setSelectedRequest(req);
    setShowDetailModal(true);
  };

  return (
    <div className="container py-4">
      <section className="section">
        <h2 className="mb-4">Yêu cầu thuốc & vật tư</h2>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary" onClick={handleShowAdd}>
                <i className="fas fa-plus"></i> Tạo yêu cầu mới
              </button>
              <div className="d-flex gap-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm..."
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Người gửi</th>
                    <th>Loại</th>
                    <th>Tên thuốc/vật tư</th>
                    <th>Số lượng</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, idx) => (
                    <tr key={req.id}>
                      <td>{idx + 1}</td>
                      <td>{req.sender}</td>
                      <td>
                        <span className={req.typeClass}>{req.type}</span>
                      </td>
                      <td>{req.name}</td>
                      <td>{req.quantity}</td>
                      <td>{req.date.split("-").reverse().join("/")}</td>
                      <td>
                        <span className={req.statusClass}>{req.status}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleShowDetail(req)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handleShowEdit(req)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {req.approved ? (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                          >
                            Đã duyệt
                          </button>
                        ) : (
                          <>
                            <button className="btn btn-sm btn-outline-success me-1">
                              Duyệt
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              Từ chối
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Thêm/Sửa yêu cầu */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode === "add" ? "Tạo yêu cầu mới" : "Chỉnh sửa yêu cầu"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Người gửi</Form.Label>
              <Form.Control
                value={form.sender}
                onChange={(e) => setForm({ ...form, sender: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên thuốc/vật tư</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày gửi</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editMode === "add" ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Chi tiết yêu cầu */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết yêu cầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Người gửi:</strong> {selectedRequest?.sender}
          </div>
          <div className="mb-3">
            <strong>Loại:</strong> {selectedRequest?.type}
          </div>
          <div className="mb-3">
            <strong>Tên thuốc/vật tư:</strong> {selectedRequest?.name}
          </div>
          <div className="mb-3">
            <strong>Số lượng:</strong> {selectedRequest?.quantity}
          </div>
          <div className="mb-3">
            <strong>Ngày gửi:</strong>{" "}
            {selectedRequest?.date
              ? selectedRequest.date.split("-").reverse().join("/")
              : ""}
          </div>
          <div className="mb-3">
            <strong>Ghi chú:</strong> {selectedRequest?.note}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicineRequests;
