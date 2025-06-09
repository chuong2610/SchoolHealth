import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaCapsules } from 'react-icons/fa';

const ReceiveMedicine = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [searchPending, setSearchPending] = useState("");
  const [searchActive, setSearchActive] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [pendingShowAll, setPendingShowAll] = useState(false);
  const [activeShowAll, setActiveShowAll] = useState(false);
  const [completedShowAll, setCompletedShowAll] = useState(false);
  const ROW_LIMIT = 5;

  // Fetch danh sách đơn thuốc chờ xác nhận
  const fetchPending = async () => {
    const res = await fetch("http://localhost:5182/api/Medication/pending");
    const data = await res.json();
    setPendingRequests((data.data || []).map((item) => {
      const med = item.medications && item.medications[0] ? item.medications[0] : {};
      return {
        id: item.id || item.medicationId || "",
        student: item.studentName || "",
        studentClassName: item.studentClassName || "",
        parent: item.parentName || "",
        medicine: med.medicationName || "",
        dosage: med.dosage  || "",
        date: item.createdDate ? item.createdDate.split("T")[0] : "",
        note: med.note || "",
        days: item.days || "",
      };
    }));
  };

  // Fetch danh sách đơn thuốc đang sử dụng
  const fetchActive = async () => {
    if (!nurseId) return;
    const res = await fetch(`http://localhost:5182/api/Medication/nurse/${nurseId}/Active`);
    const data = await res.json();
    setActiveRequests((data.data || []).map((item) => {
      const med = item.medications && item.medications[0] ? item.medications[0] : {};
      return {
        id: item.id || "",
        student: item.studentName || "",
        studentClassName: item.studentClassName || "",
        medicine: med.medicationName || "",
        dosage: med.dosage || "",
        date: item.createdDate ? item.createdDate.split("T")[0] : "",
        note: med.note || "",
      };
    }));
  };

  // Fetch danh sách đơn thuốc đã hoàn thiện
  const fetchCompleted = async () => {
    if (!nurseId) return;
    const res = await fetch(`http://localhost:5182/api/Medication/nurse/${nurseId}/Completed`);
    const data = await res.json();
    setCompletedRequests((data.data || []).map((item) => {
      const med = item.medications && item.medications[0] ? item.medications[0] : {};
      return {
        id: item.id || "",
        student: item.studentName || "",
        studentClassName: item.studentClassName || "",
        medicine: med.medicationName || "",
        dosage: med.dosage || "",
        date: item.createdDate ? item.createdDate.split("T")[0] : "",
        note: med.note || "",
      };
    }));
  };

  useEffect(() => {
    fetchPending();
    fetchActive();
    fetchCompleted();
    // eslint-disable-next-line
  }, [nurseId]);

  // Xác nhận đơn thuốc
  const handleConfirm = async (req, type) => {
    if (!nurseId) return;
    let nextStatus = "";
    const now = new Date().toISOString();
    let body = {
      medicationId: req.id,
      nurseId: nurseId,
      status: nextStatus,
    };
    if (type === "pending") {
      nextStatus = "Active";
      body = { ...body, status: nextStatus, receivedDate: now };
    }
    if (type === "active") {
      nextStatus = "Completed";
      body = { ...body, status: nextStatus, completedDate: now };
    }
    try {
      const response = await fetch("http://localhost:5182/api/Medication", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Cập nhật trạng thái thất bại!");
      await fetchPending();
      await fetchActive();
      await fetchCompleted();
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi xác nhận!");
    }
  };

  // Từ chối đơn thuốc (nếu có API riêng thì gọi, nếu không thì chỉ xóa local)
  const handleReject = async (req) => {
    // Nếu có API từ chối thì gọi ở đây
    setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  // Lọc tìm kiếm
  const filteredPending = pendingRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.parent || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchPending.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchPending.toLowerCase())
  );
  const filteredActive = activeRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchActive.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchActive.toLowerCase())
  );
  const filteredCompleted = completedRequests.filter(
    (r) =>
      r.id.toString().toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.studentClassName || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.student || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.medicine || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.dosage || "").toLowerCase().includes(searchCompleted.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchCompleted.toLowerCase())
  );

  // Hàm lấy chi tiết đơn thuốc từ API
  const fetchMedicationDetail = async (id) => {
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await fetch(`http://localhost:5182/api/Medication/${id}`);
      const data = await res.json();
      setDetailData(data.data);
    } catch (e) {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Khi mở modal chi tiết, fetch chi tiết đơn thuốc
  useEffect(() => {
    if (modalDetail && modalDetail.data && modalDetail.data.id) {
      fetchMedicationDetail(modalDetail.data.id);
    }
  }, [modalDetail]);

  return (
    <div className="container py-4" style={{ background: 'linear-gradient(120deg, #f6f8fc 60%, #e0e7ff 100%)', minHeight: '100vh' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: 28, color: '#1890ff', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaCapsules style={{ color: '#52c41a', fontSize: 28 }} />
          Nhận Thuốc từ Phụ Huynh
        </h2>
      </div>
      {/* Bảng 1: Đơn thuốc chờ xác nhận */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card vibrant-card shadow-sm border-0" style={{ borderRadius: 18, background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)', minHeight: 350 }}>
            <div className="card-header vibrant-header d-flex align-items-center" style={{ background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)', color: '#1890ff', fontWeight: 700, fontSize: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <FaClock style={{ color: '#faad14', fontSize: 22, marginRight: 8 }} /> Đơn thuốc chờ xác nhận
            </div>
            <div className="card-body">
              <input type="text" className="form-control mb-2 vibrant-input" placeholder="Tìm kiếm..." value={searchPending} onChange={e => setSearchPending(e.target.value)} />
              <div className="table-responsive">
                <table className="table align-middle vibrant-table vibrant-table-1" style={{ borderRadius: 14, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Phụ huynh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày gửi</th><th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pendingShowAll ? filteredPending : filteredPending.slice(0, ROW_LIMIT)).map((req) => (
                      <tr key={req.id} className="vibrant-row">
                        <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.parent}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                        <td>
                          <button className="btn btn-sm vibrant-btn btn-info me-1" title="Xem chi tiết" onClick={() => setModalDetail({ type: "pending", data: req })}><FaEye /></button>
                          <button className="btn btn-sm vibrant-btn btn-success me-1" title="Xác nhận" onClick={() => handleConfirm(req, "pending")}><FaCheckCircle /></button>
                          <button className="btn btn-sm vibrant-btn btn-danger" title="Từ chối" onClick={() => handleReject(req)}><FaTimesCircle /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredPending.length === 0 && <tr><td colSpan={8} className="text-center text-muted">Không có đơn nào</td></tr>}
                  </tbody>
                </table>
                {filteredPending.length > ROW_LIMIT && (
                  <div className="text-center mt-2">
                    <button className="btn btn-link vibrant-btn" onClick={() => setPendingShowAll(v => !v)}>
                      {pendingShowAll ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bảng 2: Đơn thuốc đang sử dụng */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card vibrant-card shadow-sm border-0" style={{ borderRadius: 18, background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)', minHeight: 350 }}>
            <div className="card-header vibrant-header d-flex align-items-center" style={{ background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)', color: '#faad14', fontWeight: 700, fontSize: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <FaCapsules style={{ color: '#faad14', fontSize: 22, marginRight: 8 }} /> Đơn thuốc đang sử dụng
            </div>
            <div className="card-body">
              <input type="text" className="form-control mb-2 vibrant-input" placeholder="Tìm kiếm..." value={searchActive} onChange={e => setSearchActive(e.target.value)} />
              <div className="table-responsive">
                <table className="table align-middle vibrant-table vibrant-table-2" style={{ borderRadius: 14, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày nhận</th><th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeShowAll ? filteredActive : filteredActive.slice(0, ROW_LIMIT)).map((req) => (
                      <tr key={req.id} className="vibrant-row">
                        <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                        <td>
                          <button className="btn btn-sm vibrant-btn btn-info me-1" title="Xem chi tiết" onClick={() => setModalDetail({ type: "active", data: req })}><FaEye /></button>
                          <button className="btn btn-sm vibrant-btn btn-success me-1" title="Xác nhận hoàn thành" onClick={() => handleConfirm(req, "active")}><FaCheckCircle /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredActive.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Không có đơn nào</td></tr>}
                  </tbody>
                </table>
                {filteredActive.length > ROW_LIMIT && (
                  <div className="text-center mt-2">
                    <button className="btn btn-link vibrant-btn" onClick={() => setActiveShowAll(v => !v)}>
                      {activeShowAll ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bảng 3: Đơn thuốc đã hoàn thiện */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card vibrant-card shadow-sm border-0" style={{ borderRadius: 18, background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)', minHeight: 350 }}>
            <div className="card-header vibrant-header d-flex align-items-center" style={{ background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)', color: '#52c41a', fontWeight: 700, fontSize: 18, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <FaCheckCircle style={{ color: '#52c41a', fontSize: 22, marginRight: 8 }} /> Đơn thuốc đã hoàn thiện
            </div>
            <div className="card-body">
              <input type="text" className="form-control mb-2 vibrant-input" placeholder="Tìm kiếm..." value={searchCompleted} onChange={e => setSearchCompleted(e.target.value)} />
              <div className="table-responsive">
                <table className="table align-middle vibrant-table vibrant-table-3" style={{ borderRadius: 14, overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày nhận</th><th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(completedShowAll ? filteredCompleted : filteredCompleted.slice(0, ROW_LIMIT)).map((req) => (
                      <tr key={req.id} className="vibrant-row">
                        <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                        <td>
                          <button className="btn btn-sm vibrant-btn btn-info me-1" title="Xem chi tiết" onClick={() => setModalDetail({ type: "completed", data: req })}><FaEye /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredCompleted.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Không có đơn nào</td></tr>}
                  </tbody>
                </table>
                {filteredCompleted.length > ROW_LIMIT && (
                  <div className="text-center mt-2">
                    <button className="btn btn-link vibrant-btn" onClick={() => setCompletedShowAll(v => !v)}>
                      {completedShowAll ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal chi tiết */}
      {modalDetail && (
        <div className="modal fade show vibrant-modal" style={{ display: "block", background: "rgba(0,0,0,0.2)" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4" style={{ borderRadius: 22, boxShadow: '0 8px 32px 0 rgba(80,120,255,0.16)' }}>
              <div className="modal-header" style={{ background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)', borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
                <h5 className="modal-title" style={{ color: '#1890ff', fontWeight: 700 }}>Chi tiết đơn thuốc</h5>
                <button type="button" className="btn-close vibrant-btn" onClick={() => setModalDetail(null)}></button>
              </div>
              <div className="modal-body">
                {detailLoading ? (<div>Đang tải chi tiết...</div>) : detailData ? (<>
                  <div className="row mb-3"><div className="col-md-6"><label className="form-label fw-bold">Mã lớp:</label><p>{detailData.studentClass || detailData.studentClassName || ""}</p></div></div>
                  <div className="row mb-3"><div className="col-md-6"><label className="form-label fw-bold">Học sinh:</label><p>{detailData.studentName}</p></div><div className="col-md-6"><label className="form-label fw-bold">Phụ huynh:</label><p>{detailData.parentName}</p></div></div>
                  <div className="row mb-3"><div className="col-md-6"><label className="form-label fw-bold">Y tá phụ trách:</label><p>{detailData.nurseName || "-"}</p></div><div className="col-md-6"><label className="form-label fw-bold">Trạng thái:</label><p>{detailData.status === "Active" ? "Đang sử dụng" : detailData.status === "Pending" ? "Chờ xác nhận" : detailData.status}</p></div></div>
                  <div className="row mb-3"><div className="col-md-6"><label className="form-label fw-bold">Ngày gửi:</label><p>{detailData.createdDate ? detailData.createdDate.split("T")[0] : ""}</p></div></div>
                  <div className="mb-3"><label className="form-label fw-bold">Danh sách thuốc:</label><ul>{detailData.medications && detailData.medications.map((med, idx) => (<li key={idx}><b>{med.medicationName}</b> - {med.dosage} <br /><span className="text-muted">{med.note}</span></li>))}</ul></div>
                </>) : (<div className="text-danger">Không lấy được chi tiết đơn thuốc.</div>)}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary vibrant-btn" onClick={() => setModalDetail(null)} style={{ borderRadius: 10 }}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Custom CSS vibrant nâng cấp */}
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
        .vibrant-table-2 tr:hover td {
          background: #f3e8ff !important;
          border-left: 4px solid #faad14;
          box-shadow: 0 2px 12px 0 rgba(250,173,20,0.08);
        }
        .vibrant-table-3 tr:hover td {
          background: #fffbe6 !important;
          border-left: 4px solid #52c41a;
          box-shadow: 0 2px 12px 0 rgba(82,196,26,0.08);
        }
        .vibrant-row {
          transition: background 0.18s, box-shadow 0.18s;
        }
        .vibrant-row:hover {
          background: #f0f9ff !important;
          box-shadow: 0 2px 8px 0 #a8edea44;
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
        .vibrant-btn:active {
          filter: brightness(0.95);
          box-shadow: 0 1px 2px 0 #a8edea22;
        }
        .vibrant-input:focus {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px #a8edea55 !important;
        }
        .vibrant-modal .modal-content {
          border-radius: 22px !important;
          box-shadow: 0 8px 32px 0 rgba(80,120,255,0.16) !important;
        }
        .vibrant-modal .modal-header {
          border-top-left-radius: 22px !important;
          border-top-right-radius: 22px !important;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ReceiveMedicine;
