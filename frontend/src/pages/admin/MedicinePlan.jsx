import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const plans = [
  {
    id: 1,
    name: "Khám sức khỏe định kỳ HK2",
    type: "Khám sức khỏe",
    date: "2024-04-15",
    creator: "Nguyễn Văn A",
    note: "Khám sức khỏe định kỳ cho học sinh",
    status: "Chờ duyệt",
    statusClass: "badge bg-warning text-dark",
    approved: false,
  },
  {
    id: 2,
    name: "Tiêm phòng cúm mùa",
    type: "Tiêm chủng",
    date: "2024-05-20",
    creator: "Trần Thị B",
    note: "Tiêm phòng cúm mùa cho toàn trường",
    status: "Đã duyệt",
    statusClass: "badge bg-success",
    approved: true,
  },
];

const planTypes = ["Khám sức khỏe", "Tiêm chủng", "Tầm soát", "Khác"];

const MedicinePlan = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editMode, setEditMode] = useState("add"); // add | edit
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: planTypes[0],
    date: "",
    creator: "",
    note: "",
  });

  // Mở modal thêm mới
  const handleShowAdd = () => {
    setEditMode("add");
    setForm({ name: "", type: planTypes[0], date: "", creator: "", note: "" });
    setShowEditModal(true);
  };
  // Mở modal sửa
  const handleShowEdit = (plan) => {
    setEditMode("edit");
    setForm({
      name: plan.name,
      type: plan.type,
      date: plan.date,
      creator: plan.creator,
      note: plan.note || "",
    });
    setSelectedPlan(plan);
    setShowEditModal(true);
  };
  // Mở modal chi tiết
  const handleShowDetail = (plan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
  };

  return (
    <div className="container py-4">
      <section className="section">
        <h2 className="mb-4">Kế hoạch kiểm tra & tiêm chủng</h2>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary" onClick={handleShowAdd}>
                <i className="fas fa-plus"></i> Thêm kế hoạch mới
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
                    <th>Tên kế hoạch</th>
                    <th>Loại</th>
                    <th>Ngày dự kiến</th>
                    <th>Người lập</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, idx) => (
                    <tr key={plan.id}>
                      <td>{idx + 1}</td>
                      <td>{plan.name}</td>
                      <td>{plan.type}</td>
                      <td>{plan.date.split("-").reverse().join("/")}</td>
                      <td>{plan.creator}</td>
                      <td>
                        <span className={plan.statusClass}>{plan.status}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleShowDetail(plan)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handleShowEdit(plan)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {plan.approved ? (
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

      {/* Modal Thêm/Sửa kế hoạch */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode === "add" ? "Thêm kế hoạch mới" : "Chỉnh sửa kế hoạch"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên kế hoạch</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {planTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày dự kiến</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Người lập</Form.Label>
              <Form.Control
                value={form.creator}
                onChange={(e) => setForm({ ...form, creator: e.target.value })}
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
              {editMode === "add" ? "Thêm mới" : "Lưu thay đổi"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Chi tiết kế hoạch */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết kế hoạch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Tên kế hoạch:</strong> {selectedPlan?.name}
          </div>
          <div className="mb-3">
            <strong>Loại:</strong> {selectedPlan?.type}
          </div>
          <div className="mb-3">
            <strong>Ngày dự kiến:</strong>{" "}
            {selectedPlan?.date
              ? selectedPlan.date.split("-").reverse().join("/")
              : ""}
          </div>
          <div className="mb-3">
            <strong>Người lập:</strong> {selectedPlan?.creator}
          </div>
          <div className="mb-3">
            <strong>Ghi chú:</strong> {selectedPlan?.note}
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

export default MedicinePlan;
