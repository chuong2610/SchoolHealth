import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Modal, Button, Form, Table, Badge } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaCapsules, FaSearch } from 'react-icons/fa';

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
        dosage: med.dosage || "",
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
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <FaCapsules className="me-2" /> Nhận Thuốc từ Phụ Huynh
        </h1>
      </div>

      {/* Pending Requests Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Đơn thuốc chờ xác nhận</h6>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="Tìm kiếm..."
              value={searchPending}
              onChange={e => setSearchPending(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button"><FaSearch /></button>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="table table-bordered" id="dataTablePending" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Phụ huynh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày gửi</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(pendingShowAll ? filteredPending : filteredPending.slice(0, ROW_LIMIT)).map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.parent}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                    <td>
                      <Button variant="info" size="sm" className="btn-circle me-1" onClick={() => setModalDetail({ type: "pending", data: req })} title="Xem chi tiết"><FaEye /></Button>
                      <Button variant="success" size="sm" className="btn-circle me-1" onClick={() => handleConfirm(req, "pending")} title="Xác nhận"><FaCheckCircle /></Button>
                      <Button variant="danger" size="sm" className="btn-circle" onClick={() => handleReject(req)} title="Từ chối"><FaTimesCircle /></Button>
                    </td>
                  </tr>
                ))}
                {filteredPending.length === 0 && <tr><td colSpan={8} className="text-center text-muted">Không có đơn nào</td></tr>}
              </tbody>
            </Table>
            {filteredPending.length > ROW_LIMIT && (
              <div className="text-center mt-2">
                <button className="btn btn-link" onClick={() => setPendingShowAll(v => !v)}>
                  {pendingShowAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Requests Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-warning">Đơn thuốc đang sử dụng</h6>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="Tìm kiếm..."
              value={searchActive}
              onChange={e => setSearchActive(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-warning" type="button"><FaSearch /></button>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="table table-bordered" id="dataTableActive" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày nhận</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(activeShowAll ? filteredActive : filteredActive.slice(0, ROW_LIMIT)).map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                    <td>
                      <Button variant="info" size="sm" className="btn-circle me-1" onClick={() => setModalDetail({ type: "active", data: req })} title="Xem chi tiết"><FaEye /></Button>
                      <Button variant="success" size="sm" className="btn-circle" onClick={() => handleConfirm(req, "active")} title="Xác nhận hoàn thành"><FaCheckCircle /></Button>
                    </td>
                  </tr>
                ))}
                {filteredActive.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Không có đơn nào</td></tr>}
              </tbody>
            </Table>
            {filteredActive.length > ROW_LIMIT && (
              <div className="text-center mt-2">
                <button className="btn btn-link" onClick={() => setActiveShowAll(v => !v)}>
                  {activeShowAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed Requests Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-success">Đơn thuốc đã hoàn thành</h6>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="Tìm kiếm..."
              value={searchCompleted}
              onChange={e => setSearchCompleted(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-success" type="button"><FaSearch /></button>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="table table-bordered" id="dataTableCompleted" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Mã đơn</th><th>Mã lớp</th><th>Học sinh</th><th>Loại thuốc</th><th>Liều lượng</th><th>Ngày nhận</th>
                </tr>
              </thead>
              <tbody>
                {(completedShowAll ? filteredCompleted : filteredCompleted.slice(0, ROW_LIMIT)).map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td><td>{req.studentClassName}</td><td>{req.student}</td><td>{req.medicine}</td><td>{req.dosage}</td><td>{req.date}</td>
                  </tr>
                ))}
                {filteredCompleted.length === 0 && <tr><td colSpan={6} className="text-center text-muted">Không có đơn nào</td></tr>}
              </tbody>
            </Table>
            {filteredCompleted.length > ROW_LIMIT && (
              <div className="text-center mt-2">
                <button className="btn btn-link" onClick={() => setCompletedShowAll(v => !v)}>
                  {completedShowAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chi tiết */}
      <Modal show={modalDetail !== null} onHide={() => setModalDetail(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading && <p>Đang tải chi tiết...</p>}
          {!detailLoading && !detailData && <p>Không tìm thấy chi tiết.</p>}
          {!detailLoading && detailData && (
            <>
              <p><strong>Mã đơn:</strong> {detailData.id}</p>
              <p><strong>Học sinh:</strong> {detailData.studentName} ({detailData.studentClassName})</p>
              <p><strong>Phụ huynh:</strong> {detailData.parentName}</p>
              <p><strong>Loại thuốc:</strong> {detailData.medications?.[0]?.medicationName}</p>
              <p><strong>Liều lượng:</strong> {detailData.medications?.[0]?.dosage}</p>
              <p><strong>Số ngày:</strong> {detailData.days}</p>
              <p><strong>Ghi chú:</strong> {detailData.medications?.[0]?.note || "Không có"}</p>
              <p><strong>Ngày gửi:</strong> {detailData.createdDate?.split("T")[0]}</p>
              <p><strong>Trạng thái:</strong> 
                <Badge bg={detailData.status === "Pending" ? "primary" : detailData.status === "Active" ? "warning" : "success"}>
                  {detailData.status === "Pending" ? "Chờ xác nhận" : detailData.status === "Active" ? "Đang sử dụng" : "Đã hoàn thành"}
                </Badge>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalDetail(null)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceiveMedicine;
