import React, { useState } from "react";

const eventsInit = [
  {
    id: "EV001",
    name: "Khám sức khỏe định kỳ",
    type: "Khám sức khỏe",
    typeValue: "checkup",
    dateStart: "01/03/2024",
    dateEnd: "05/03/2024",
    location: "Phòng y tế",
    participants: 120,
    status: "Đang diễn ra",
    statusType: "success",
    desc: "Khám sức khỏe định kỳ cho toàn trường.",
    note: "Mang theo sổ khám bệnh.",
  },
];

const HealthEvents = () => {
  const [events, setEvents] = useState(eventsInit);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modalDetail, setModalDetail] = useState(null); // data
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(null); // data
  const [form, setForm] = useState({
    name: "",
    type: "",
    dateStart: "",
    dateEnd: "",
    location: "",
    participants: "",
    desc: "",
    note: "",
  });

  // Lọc
  const filtered = events.filter(
    (e) =>
      (filter === "" || e.typeValue === filter) &&
      (e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Thao tác
  const handleDelete = (e) => {
    setEvents(events.filter((item) => item.id !== e.id));
  };
  // Thêm mới
  const handleAdd = (ev) => {
    ev.preventDefault();
    setEvents([
      {
        id: `EV${Math.floor(Math.random() * 1000)}`,
        name: form.name,
        type:
          form.type === "checkup"
            ? "Khám sức khỏe"
            : form.type === "vaccination"
            ? "Tiêm chủng"
            : form.type === "training"
            ? "Đào tạo"
            : "Khác",
        typeValue: form.type,
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
        location: form.location,
        participants: form.participants,
        status: "Sắp diễn ra",
        statusType: "primary",
        desc: form.desc,
        note: form.note,
      },
      ...events,
    ]);
    setModalAdd(false);
    setForm({
      name: "",
      type: "",
      dateStart: "",
      dateEnd: "",
      location: "",
      participants: "",
      desc: "",
      note: "",
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0" style={{ fontSize: 28 }}>
          Quản lý Sự kiện Y tế
        </h2>
        <button className="btn btn-primary" onClick={() => setModalAdd(true)}>
          <i className="fas fa-plus me-2"></i> Thêm Sự kiện Mới
        </button>
      </div>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white border-0 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">Danh sách sự kiện y tế</h5>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select me-2"
                style={{ minWidth: 160 }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                <option value="checkup">Khám sức khỏe</option>
                <option value="vaccination">Tiêm chủng</option>
                <option value="training">Đào tạo</option>
                <option value="other">Khác</option>
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
                  <th>Tên sự kiện</th>
                  <th>Loại</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Địa điểm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.name}</td>
                    <td>{e.type}</td>
                    <td>{e.dateStart}</td>
                    <td>{e.dateEnd}</td>
                    <td>{e.location}</td>
                    <td>
                      <span className={`badge bg-${e.statusType}`}>
                        {e.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="Xem chi tiết"
                        onClick={() => setModalDetail(e)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        title="Chỉnh sửa"
                        onClick={() => setModalEdit(e)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Xóa"
                        onClick={() => handleDelete(e)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      Không có sự kiện nào
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
                <h5 className="modal-title">Chi tiết sự kiện y tế</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalDetail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Mã sự kiện:</label>
                    <p>{modalDetail.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tên sự kiện:</label>
                    <p>{modalDetail.name}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Loại sự kiện:</label>
                    <p>{modalDetail.type}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Trạng thái:</label>
                    <span className={`badge bg-${modalDetail.statusType}`}>
                      {modalDetail.status}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ngày bắt đầu:</label>
                    <p>{modalDetail.dateStart}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ngày kết thúc:</label>
                    <p>{modalDetail.dateEnd}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Địa điểm:</label>
                    <p>{modalDetail.location}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Số lượng tham gia:
                    </label>
                    <p>{modalDetail.participants}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Mô tả:</label>
                  <p>
                    {modalDetail.desc || (
                      <span className="text-muted">Không có</span>
                    )}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Ghi chú:</label>
                  <p>
                    {modalDetail.note || (
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
                <h5 className="modal-title">Thêm Sự kiện Y tế Mới</h5>
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
                      <label className="form-label">Tên sự kiện</label>
                      <input
                        className="form-control"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loại sự kiện</label>
                      <select
                        className="form-select"
                        required
                        value={form.type}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, type: e.target.value }))
                        }
                      >
                        <option value="">Chọn loại...</option>
                        <option value="checkup">Khám sức khỏe</option>
                        <option value="vaccination">Tiêm chủng</option>
                        <option value="training">Đào tạo</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Ngày bắt đầu</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.dateStart}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dateStart: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ngày kết thúc</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.dateEnd}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dateEnd: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Địa điểm</label>
                      <input
                        className="form-control"
                        required
                        value={form.location}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, location: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số lượng tham gia</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={form.participants}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            participants: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
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
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.note}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, note: e.target.value }))
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
      {/* Modal sửa (demo) */}
      {modalEdit && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa sự kiện (demo)</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalEdit(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên sự kiện</label>
                  <input
                    className="form-control"
                    value={modalEdit.name}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Loại sự kiện</label>
                  <input
                    className="form-control"
                    value={modalEdit.type}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày bắt đầu</label>
                  <input
                    className="form-control"
                    value={modalEdit.dateStart}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày kết thúc</label>
                  <input
                    className="form-control"
                    value={modalEdit.dateEnd}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa điểm</label>
                  <input
                    className="form-control"
                    value={modalEdit.location}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng tham gia</label>
                  <input
                    className="form-control"
                    value={modalEdit.participants}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={modalEdit.desc}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    value={modalEdit.note}
                    disabled
                  />
                </div>
                <div className="alert alert-info small">
                  * Demo: Chỉ xem, chưa cho phép chỉnh sửa thực tế.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalEdit(null)}
                >
                  Đóng
                </button>
              </div>
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

export default HealthEvents;
