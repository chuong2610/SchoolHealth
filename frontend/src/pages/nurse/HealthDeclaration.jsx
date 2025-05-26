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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0" style={{ fontSize: 28 }}>
          Khai Báo Y Tế
        </h2>
        <button className="btn btn-primary" onClick={() => setModalAdd(true)}>
          <i className="fas fa-plus me-2"></i> Thêm Khai Báo Mới
        </button>
      </div>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white border-0 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Danh sách khai báo y tế</h5>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select me-2"
                style={{ minWidth: 160 }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
              <div style={{ maxWidth: 240 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
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
          <div className="modal-dialog modal-lg">
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
          <div className="modal-dialog modal-lg">
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
      {/* Custom CSS cho giống bản gốc */}
      <style>{`
        .card { border-radius: 18px !important; }
        .card-header { border-radius: 18px 18px 0 0 !important; }
        .table th, .table td { vertical-align: middle !important; }
        .badge { font-size: 15px; padding: 7px 16px; border-radius: 8px; }
        .form-select, .form-control { border-radius: 8px; }
        .modal-backdrop { display: none; }
      `}</style>
    </div>
  );
};

export default HealthDeclaration;
