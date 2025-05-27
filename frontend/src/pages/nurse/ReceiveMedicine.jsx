import React, { useState } from "react";

const pendingRequestsInit = [
  {
    id: "REQ001",
    student: "Nguyễn Văn A - Lớp 5A",
    parent: "Nguyễn Văn B",
    medicine: "Paracetamol",
    dosage: "1 viên/lần",
    times: "08:00, 13:00",
    date: "01/03/2024",
    note: "Học sinh bị sốt nhẹ, cần uống thuốc hạ sốt.",
    days: 5,
  },
];

const receivedMedicinesInit = [
  {
    id: "MED001",
    student: "Nguyễn Văn A - Lớp 5A",
    medicine: "Paracetamol",
    dosage: "1 viên/lần",
    times: "08:00, 13:00",
    dateStart: "01/03/2024",
    dateEnd: "05/03/2024",
    status: "Đang sử dụng",
    statusType: "success",
    note: "Học sinh bị sốt nhẹ, cần uống thuốc hạ sốt.",
  },
];

const ReceiveMedicine = () => {
  const [pendingRequests, setPendingRequests] = useState(pendingRequestsInit);
  const [receivedMedicines, setReceivedMedicines] = useState(
    receivedMedicinesInit
  );
  const [searchPending, setSearchPending] = useState("");
  const [searchReceived, setSearchReceived] = useState("");
  const [filterReceived, setFilterReceived] = useState("");
  const [modalDetail, setModalDetail] = useState(null); // {type, data}
  const [modalEdit, setModalEdit] = useState(null); // {data}

  // Xác nhận đơn thuốc
  const handleConfirm = (req) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
    setReceivedMedicines([
      ...receivedMedicines,
      {
        id: `MED${Math.floor(Math.random() * 1000)}`,
        student: req.student,
        medicine: req.medicine,
        dosage: req.dosage,
        times: req.times,
        dateStart: req.date,
        dateEnd: "",
        status: "Đang sử dụng",
        statusType: "success",
        note: req.note,
      },
    ]);
  };
  // Từ chối đơn thuốc
  const handleReject = (req) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
  };

  // Lọc tìm kiếm
  const filteredPending = pendingRequests.filter(
    (r) =>
      r.student.toLowerCase().includes(searchPending.toLowerCase()) ||
      r.parent.toLowerCase().includes(searchPending.toLowerCase()) ||
      r.medicine.toLowerCase().includes(searchPending.toLowerCase())
  );
  const filteredReceived = receivedMedicines.filter(
    (m) =>
      (filterReceived === "" ||
        (filterReceived === "active" && m.statusType === "success") ||
        (filterReceived === "completed" && m.statusType === "primary") ||
        (filterReceived === "expired" && m.statusType === "secondary")) &&
      (m.student.toLowerCase().includes(searchReceived.toLowerCase()) ||
        m.medicine.toLowerCase().includes(searchReceived.toLowerCase()))
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: 28 }}>
          Nhận Thuốc từ Phụ Huynh
        </h2>
      </div>
      {/* Đơn thuốc chờ xác nhận */}
      <div className="card mb-4 shadow-sm border-0 rounded-4">
        <div className="card-header bg-white border-0 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-clock text-warning me-2"></i>
              Đơn thuốc chờ xác nhận
            </h5>
            <div style={{ maxWidth: 240 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
                value={searchPending}
                onChange={(e) => setSearchPending(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Học sinh</th>
                  <th>Phụ huynh</th>
                  <th>Loại thuốc</th>
                  <th>Liều lượng</th>
                  <th>Thời gian uống</th>
                  <th>Ngày gửi</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.student}</td>
                    <td>{req.parent}</td>
                    <td>{req.medicine}</td>
                    <td>{req.dosage}</td>
                    <td>{req.times}</td>
                    <td>{req.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="Xem chi tiết"
                        onClick={() =>
                          setModalDetail({ type: "pending", data: req })
                        }
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success me-1"
                        title="Xác nhận"
                        onClick={() => handleConfirm(req)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Từ chối"
                        onClick={() => handleReject(req)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPending.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      Không có đơn nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Thuốc đã nhận */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white border-0 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-check-circle text-success me-2"></i>
              Thuốc đã nhận
            </h5>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select me-2"
                style={{ minWidth: 160 }}
                value={filterReceived}
                onChange={(e) => setFilterReceived(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang sử dụng</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="expired">Đã hết hạn</option>
              </select>
              <div style={{ maxWidth: 240 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm..."
                  value={searchReceived}
                  onChange={(e) => setSearchReceived(e.target.value)}
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
                  <th>Loại thuốc</th>
                  <th>Liều lượng</th>
                  <th>Thời gian uống</th>
                  <th>Ngày nhận</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceived.map((med) => (
                  <tr key={med.id}>
                    <td>{med.id}</td>
                    <td>{med.student}</td>
                    <td>{med.medicine}</td>
                    <td>{med.dosage}</td>
                    <td>{med.times}</td>
                    <td>{med.dateStart}</td>
                    <td>{med.dateEnd}</td>
                    <td>
                      <span className={`badge bg-${med.statusType}`}>
                        {med.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="Xem chi tiết"
                        onClick={() =>
                          setModalDetail({ type: "received", data: med })
                        }
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        title="Chỉnh sửa"
                        onClick={() => setModalEdit({ data: med })}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReceived.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      Không có thuốc nào
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
                <h5 className="modal-title">Chi tiết đơn thuốc</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalDetail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Mã đơn:</label>
                    <p>{modalDetail.data.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ngày gửi:</label>
                    <p>{modalDetail.data.date || modalDetail.data.dateStart}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Học sinh:</label>
                    <p>{modalDetail.data.student}</p>
                  </div>
                  {modalDetail.type === "pending" && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Phụ huynh:</label>
                      <p>{modalDetail.data.parent}</p>
                    </div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Loại thuốc:</label>
                    <p>{modalDetail.data.medicine}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Liều lượng:</label>
                    <p>{modalDetail.data.dosage}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Thời gian uống:
                    </label>
                    <p>{modalDetail.data.times}</p>
                  </div>
                  {modalDetail.type === "pending" && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Số ngày sử dụng:
                      </label>
                      <p>{modalDetail.data.days || "-"}</p>
                    </div>
                  )}
                  {modalDetail.type === "received" && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Ngày kết thúc:
                      </label>
                      <p>{modalDetail.data.dateEnd || "-"}</p>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Ghi chú từ phụ huynh:
                  </label>
                  <p>
                    {modalDetail.data.note || (
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
      {/* Modal chỉnh sửa */}
      {modalEdit && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.2)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa thuốc đã nhận</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalEdit(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Loại thuốc</label>
                  <input
                    className="form-control"
                    value={modalEdit.data.medicine}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Liều lượng</label>
                  <input
                    className="form-control"
                    value={modalEdit.data.dosage}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thời gian uống</label>
                  <input
                    className="form-control"
                    value={modalEdit.data.times}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    value={modalEdit.data.note || ""}
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

export default ReceiveMedicine;
