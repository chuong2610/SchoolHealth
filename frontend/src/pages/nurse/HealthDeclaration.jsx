import React, { useState } from "react";

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
];

const HealthDeclaration = () => {
  const [declarations, setDeclarations] = useState(declarationsInit);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modalDetail, setModalDetail] = useState(null); // data
  const [modalAdd, setModalAdd] = useState(false);
  const [form, setForm] = useState({
    student: "",
    type: "",
    date: "",
    reporter: "",
    desc: "",
    solution: "",
  });

  // Lọc
  const filtered = declarations.filter(
    (d) =>
      (filter === "" ||
        (filter === "pending" && d.statusType === "warning") ||
        (filter === "confirmed" && d.statusType === "success") ||
        (filter === "rejected" && d.statusType === "danger")) &&
      (d.student.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase()) ||
        d.reporter.toLowerCase().includes(search.toLowerCase()))
  );

  // Thao tác
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
  // Thêm mới
  const handleAdd = (e) => {
    e.preventDefault();
    setDeclarations([
      {
        id: `HD${Math.floor(Math.random() * 1000)}`,
        student: form.student,
        type: form.type,
        date: form.date,
        status: "Chờ xác nhận",
        statusType: "warning",
        reporter: form.reporter,
        desc: form.desc,
        solution: form.solution,
      },
      ...declarations,
    ]);
    setModalAdd(false);
    setForm({
      student: "",
      type: "",
      date: "",
      reporter: "",
      desc: "",
      solution: "",
    });
  };

  // Thêm các style header bảng
  const tableHeaderStyle1 = {
    background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)',
    color: '#1890ff',
    fontWeight: 700,
    fontSize: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 24px 10px 24px',
    letterSpacing: 0.5,
    animation: 'fadeInDown 0.7s',
  };

  return (
    <div className="container py-4" style={{ background: 'linear-gradient(120deg, #f6f8fc 60%, #e0e7ff 100%)', minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: 28, color: '#1890ff', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fas fa-file-medical" style={{ color: '#faad14', fontSize: 28 }}></i>
          Khai Báo Y Tế
        </h2>
      </div>
      {/* Card/table chính */}
      <div className="card mb-4 shadow-sm border-0 vibrant-card" style={{ borderRadius: 18, background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)', boxShadow: '0 4px 24px 0 rgba(168,237,234,0.12)' }}>
        <div style={tableHeaderStyle1} className="vibrant-header">
          <i className="fas fa-file-medical" style={{ color: '#faad14', fontSize: 22 }}></i>
          Danh sách khai báo y tế
          <div style={{ flex: 1 }}></div>
          <div style={{ maxWidth: 240 }}>
            <input
              type="text"
              className="form-control vibrant-input"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 8, border: '1.5px solid #a8edea' }}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle vibrant-table vibrant-table-1" style={{ borderRadius: 14, overflow: 'hidden' }}>
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
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.student}</td>
                    <td>{d.type}</td>
                    <td>{d.date}</td>
                    <td>
                      <span className={`badge bg-${d.statusType}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{d.reporter}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="Xem chi tiết"
                        onClick={() => setModalDetail(d)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {d.statusType === "warning" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-1"
                            title="Xác nhận"
                            onClick={() => handleConfirm(d)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Từ chối"
                            onClick={() => handleReject(d)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      Không có khai báo nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal chi tiết */}
      {modalDetail && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg vibrant-modal">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết khai báo y tế</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalDetail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Mã khai báo:</label>
                    <p>{modalDetail.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ngày khai báo:</label>
                    <p>{modalDetail.date}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Học sinh:</label>
                    <p>{modalDetail.student}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Người khai báo:
                    </label>
                    <p>{modalDetail.reporter}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Loại khai báo:</label>
                    <p>{modalDetail.type}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Trạng thái:</label>
                    <span className={`badge bg-${modalDetail.statusType}`}>
                      {modalDetail.status}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Mô tả chi tiết:</label>
                  <p>
                    {modalDetail.desc || (
                      <span className="text-muted">Không có</span>
                    )}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Đề xuất xử lý:</label>
                  <p>
                    {modalDetail.solution || (
                      <span className="text-muted">Không có</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalDetail(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal thêm mới */}
      {modalAdd && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg vibrant-modal">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Thêm Khai Báo Y Tế Mới</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalAdd(false)}
                ></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Học sinh</label>
                      <select
                        className="form-select"
                        required
                        value={form.student}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, student: e.target.value }))
                        }
                      >
                        <option value="">Chọn học sinh...</option>
                        <option value="Nguyễn Văn A - Lớp 5A">
                          Nguyễn Văn A - Lớp 5A
                        </option>
                        <option value="Trần Thị B - Lớp 4B">
                          Trần Thị B - Lớp 4B
                        </option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loại khai báo</label>
                      <select
                        className="form-select"
                        required
                        value={form.type}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, type: e.target.value }))
                        }
                      >
                        <option value="">Chọn loại...</option>
                        <option value="Bệnh truyền nhiễm">
                          Bệnh truyền nhiễm
                        </option>
                        <option value="Chấn thương">Chấn thương</option>
                        <option value="Dị ứng">Dị ứng</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Ngày khai báo</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Người khai báo</label>
                      <select
                        className="form-select"
                        required
                        value={form.reporter}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, reporter: e.target.value }))
                        }
                      >
                        <option value="">Chọn người khai báo...</option>
                        <option value="Phụ huynh">Phụ huynh</option>
                        <option value="Giáo viên">Giáo viên</option>
                        <option value="Học sinh">Học sinh</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      required
                      value={form.desc}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, desc: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Đề xuất xử lý</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.solution}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, solution: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalAdd(false)}
                  >
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .vibrant-card {
          border-radius: 18px !important;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .vibrant-card:hover {
          box-shadow: 0 8px 32px 0 rgba(80,120,255,0.16);
          transform: scale(1.015);
        }
        .vibrant-header {
          letter-spacing: 0.5px;
          animation: fadeInDown 0.7s;
        }
        .vibrant-table tr {
          transition: background 0.18s, box-shadow 0.18s, border-left 0.18s;
        }
        .vibrant-table-1 tr:hover td {
          background: #e0f7fa !important;
          border-left: 4px solid #1890ff;
          box-shadow: 0 2px 12px 0 rgba(24,144,255,0.08);
        }
        .vibrant-btn {
          border-radius: 8px !important;
          transition: background 0.18s, box-shadow 0.18s, color 0.18s;
          font-weight: 600;
        }
        .vibrant-btn.btn-info:hover {
          background: #e0f7fa !important;
          color: #1890ff !important;
          box-shadow: 0 2px 8px 0 #a8edea44;
        }
        .vibrant-btn.btn-success:hover {
          background: #e6fffb !important;
          color: #52c41a !important;
          box-shadow: 0 2px 8px 0 #52c41a44;
        }
        .vibrant-btn.btn-danger:hover {
          background: #fff1f0 !important;
          color: #ff4d4f !important;
          box-shadow: 0 2px 8px 0 #ff4d4f44;
        }
        .vibrant-input:focus {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px #a8edea55 !important;
        }
        .vibrant-modal .modal-content {
          border-radius: 18px !important;
          box-shadow: 0 8px 32px 0 rgba(80,120,255,0.16) !important;
        }
        .vibrant-modal .modal-header {
          border-top-left-radius: 18px !important;
          border-top-right-radius: 18px !important;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HealthDeclaration;
