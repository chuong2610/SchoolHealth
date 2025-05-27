import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const reports = [
  {
    id: 1,
    name: "Báo cáo sức khỏe học sinh tháng 3/2024",
    type: "Sức khỏe",
    date: "2024-04-01",
    creator: "Admin",
    note: "Tổng hợp sức khỏe học sinh tháng 3",
  },
  {
    id: 2,
    name: "Thống kê thuốc & vật tư Q1/2024",
    type: "Thuốc & vật tư",
    date: "2024-03-31",
    creator: "Admin",
    note: "Thống kê sử dụng thuốc và vật tư quý 1",
  },
];

const reportTypes = ["Sức khỏe", "Thuốc & vật tư", "Sự kiện y tế", "Khác"];

const summary1 = [
  { label: "Tổng số học sinh", value: "1,500" },
  { label: "Học sinh đã tiêm chủng", value: "1,250" },
  { label: "Học sinh đã khám sức khỏe", value: "1,100" },
];
const summary2 = [
  { label: "Số sự kiện y tế", value: "35" },
  { label: "Số thuốc đã sử dụng", value: "2,000 viên" },
  { label: "Số vật tư đã sử dụng", value: "500 đơn vị" },
];

const Reports = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editMode, setEditMode] = useState("add");
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: reportTypes[0],
    date: "",
    creator: "",
    note: "",
  });

  // Mở modal tạo mới
  const handleShowAdd = () => {
    setEditMode("add");
    setForm({
      name: "",
      type: reportTypes[0],
      date: "",
      creator: "",
      note: "",
    });
    setShowEditModal(true);
  };
  // Mở modal sửa
  const handleShowEdit = (report) => {
    setEditMode("edit");
    setForm({
      name: report.name,
      type: report.type,
      date: report.date,
      creator: report.creator,
      note: report.note || "",
    });
    setSelectedReport(report);
    setShowEditModal(true);
  };
  // Mở modal chi tiết
  const handleShowDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  return (
    <div className="container py-4">
      <section className="section">
        <h2 className="mb-4">Báo cáo & xuất dữ liệu</h2>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary" onClick={handleShowAdd}>
                <i className="fas fa-plus"></i> Tạo báo cáo mới
              </button>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-file-csv"></i> Xuất CSV
                </button>
                <button className="btn btn-outline-danger">
                  <i className="fas fa-file-pdf"></i> Xuất PDF
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Tên báo cáo</th>
                    <th>Loại</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.type}</td>
                      <td>{r.date.split("-").reverse().join("/")}</td>
                      <td>{r.creator}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleShowDetail(r)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handleShowEdit(r)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success me-1">
                          <i className="fas fa-download"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">
              Tổng hợp dữ liệu y tế trường học
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      {summary1.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.label}</td>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      {summary2.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.label}</td>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Tạo/Sửa báo cáo */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode === "add" ? "Tạo báo cáo mới" : "Chỉnh sửa báo cáo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên báo cáo</Form.Label>
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
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày tạo</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Người tạo</Form.Label>
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
              {editMode === "add" ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Chi tiết báo cáo */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Tên báo cáo:</strong> {selectedReport?.name}
          </div>
          <div className="mb-3">
            <strong>Loại:</strong> {selectedReport?.type}
          </div>
          <div className="mb-3">
            <strong>Ngày tạo:</strong>{" "}
            {selectedReport?.date
              ? selectedReport.date.split("-").reverse().join("/")
              : ""}
          </div>
          <div className="mb-3">
            <strong>Người tạo:</strong> {selectedReport?.creator}
          </div>
          <div className="mb-3">
            <strong>Ghi chú:</strong> {selectedReport?.note}
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

export default Reports;
