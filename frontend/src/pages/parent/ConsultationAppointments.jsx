import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Button, Table, Modal, Form, Row, Card } from "react-bootstrap";
import { FaCalendarCheck, FaInfoCircle } from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";

const ParentConsultationAppointments = () => {
  const { user } = useAuth();
  const parentId = user?.id;
  // Phân trang cho bảng hôm nay
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [todayTotalPages, setTodayTotalPages] = useState(1);
  const [todayCurrentPage, setTodayCurrentPage] = useState(1);
  // Phân trang cho bảng tất cả
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Phân trang bảng hôm nay
  const handleTodayPageChange = (page) => {
    if (page > 0 && page <= todayTotalPages) {
      setTodayCurrentPage(page);
    }
  };
  // Phân trang bảng tất cả
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Lấy lịch hẹn hôm nay
  const fetchTodayAppointments = async () => {
    try {
      const res = await axiosInstance.get(
        `/ConsultationAppointment/today/${parentId}?pageNumber=${todayCurrentPage}&pageSize=${pageSize}`
      );
      setTodayAppointments(res.data.data.items || []);
      setTodayTotalPages(res.data.data.totalPages ?? 1);
    } catch (e) {
      setTodayAppointments([]);
      setTodayTotalPages(1);
    }
  };

  // Lấy tất cả lịch hẹn (có phân trang)
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(
        `/ConsultationAppointment/parent/${parentId}?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      setAppointments(res.data.data.items || []);
      setTotalPages(res.data.data.totalPages ?? 1);
    } catch (e) {
      setError("Không thể tải lịch hẹn tư vấn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchTodayAppointments();
    }
    // eslint-disable-next-line
  }, [parentId, todayCurrentPage]);

  useEffect(() => {
    if (parentId) {
      fetchAppointments();
    }
    // eslint-disable-next-line
  }, [parentId, currentPage]);

  // Xử lý xem chi tiết
  const handleShowDetail = async (id) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    setShowRejectInput(false);
    setRejectReason("");
    try {
      const res = await axiosInstance.get(`/ConsultationAppointment/${id}`);
      setDetailData(res.data.data);
    } catch (e) {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Xác nhận lịch hẹn
  const handleConfirm = async () => {
    if (!detailData) return;
    setActionLoading(true);
    try {
      await axiosInstance.patch(`/ConsultationAppointment`, {
        consultationAppointmentId: detailData.consultationAppointmentId,
        status: "Confirmed",
        reason: ""
      });
      setShowDetailModal(false);
      fetchTodayAppointments();
      fetchAppointments();
    } catch (e) {
      alert("Xác nhận thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Từ chối lịch hẹn
  const handleReject = async () => {
    if (!detailData || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await axiosInstance.patch(`/ConsultationAppointment`, {
        consultationAppointmentId: detailData.consultationAppointmentId,
        status: "Rejected",
        reason: rejectReason.trim()
      });
      setShowDetailModal(false);
      setRejectReason("");
      setShowRejectInput(false);
      fetchTodayAppointments();
      fetchAppointments();
    } catch (e) {
      alert("Từ chối thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Render bảng lịch hẹn
  const renderAppointmentTable = (
    appointments,
    title,
    emptyMessage,
    showPagination = false,
    currentPageNum = 1,
    totalPagesNum = 1,
    onPageChangeFunc = null
  ) => (
    <Card
      className="mb-4"
      style={{ border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <Card.Header
        style={{
          background: "linear-gradient(90deg, #2563eb 60%, #4f8cff 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaCalendarCheck size={20} />
          <h5 style={{ margin: 0, fontWeight: "600" }}>{title}</h5>
          {/* <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.8rem",
            }}
          >
            {appointments.length}
          </span> */}
        </div>
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        {appointments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#6c757d",
              fontStyle: "italic",
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          <>
            <Table responsive hover style={{ margin: 0 }}>
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th style={{ border: "none", padding: "12px 16px" }}>STT</th>
                  <th style={{ border: "none", padding: "12px 16px" }}>
                    Học sinh
                  </th>
                  <th style={{ border: "none", padding: "12px 16px" }}>Y tá</th>
                  <th style={{ border: "none", padding: "12px 16px" }}>
                    Ngày/Giờ
                  </th>
                  <th style={{ border: "none", padding: "12px 16px" }}>
                    Địa điểm
                  </th>
                  <th style={{ border: "none", padding: "12px 16px" }}>
                    Trạng thái
                  </th>
                  <th style={{ border: "none", padding: "12px 16px" }}>
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item, idx) => (
                  <tr
                    key={item.consultationAppointmentId}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      {showPagination
                        ? (currentPageNum - 1) * pageSize + idx + 1
                        : idx + 1}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        verticalAlign: "middle",
                        fontWeight: "500",
                      }}
                    >
                      {item.studentName}
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      {item.nurseName}
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      {item.date ? (
                        <div>
                          <div style={{ fontWeight: "500" }}>
                            {new Date(item.date).toLocaleDateString("vi-VN")}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                            {new Date(item.date).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <span
                        style={{
                          background: "#e9ecef",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.location || "Chưa xác định"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      {item.status === "Confirmed"
                        ? "Đã xác nhận"
                        : item.status === "Rejected"
                          ? "Đã từ chối"
                          : "Chờ xác nhận"}
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <Button
                        size="sm"
                        variant="primary"
                        style={{ borderRadius: 20, fontWeight: 500, minWidth: 90, display: 'flex', alignItems: 'center', gap: 6 }}
                        onClick={() => handleShowDetail(item.consultationAppointmentId)}
                      >
                        <FaInfoCircle style={{ marginBottom: 2 }} /> Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {showPagination && totalPagesNum > 1 && onPageChangeFunc && (
              <Row className="mt-3">
                <PaginationBar
                  currentPage={currentPageNum}
                  totalPages={totalPagesNum}
                  onPageChange={onPageChangeFunc}
                />
              </Row>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="parent-container" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            margin: 0,
            color: "#2c3e50",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaCalendarCheck size={28} style={{ color: "#667eea" }} />
          Lịch hẹn tư vấn
        </h2>
        <p
          style={{
            margin: "8px 0 0 0",
            color: "#6c757d",
            fontSize: "1rem",
          }}
        >
          Quản lý các lịch hẹn tư vấn sức khỏe cho con em
        </p>
      </div>
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#6c757d",
          }}
        >
          <div
            className="spinner-border"
            role="status"
            style={{ marginBottom: "1rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>Đang tải lịch hẹn...</div>
        </div>
      ) : error ? (
        <div
          style={{
            color: "#dc3545",
            background: "#f8d7da",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      ) : (
        <div>
          {/* Bảng 1: Lịch hẹn hôm nay */}
          {renderAppointmentTable(
            todayAppointments,
            "Lịch hẹn hôm nay",
            "Không có lịch hẹn nào cho hôm nay",
            true,
            todayCurrentPage,
            todayTotalPages,
            handleTodayPageChange
          )}
          {/* Bảng 2: Tất cả lịch hẹn tư vấn */}
          {renderAppointmentTable(
            appointments,
            "Tất cả lịch hẹn tư vấn",
            "Không có lịch hẹn nào",
            true,
            currentPage,
            totalPages,
            handlePageChange
          )}
        </div>
      )}

      {/* Modal chi tiết lịch hẹn */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(90deg, #2563eb 60%, #4f8cff 100%)",
            color: "white",
            border: "none",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Modal.Title style={{ fontWeight: 600, letterSpacing: 1 }}>
            <FaInfoCircle style={{ marginBottom: 3, marginRight: 6 }} /> Chi tiết lịch hẹn tư vấn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Đang tải chi tiết...</div>
            </div>
          ) : detailData ? (
            <div>
              <p><b>Học sinh:</b> {detailData.studentName}</p>
              {/* <p><b>Mã học sinh:</b> {detailData.studentNumber}</p> */}
              <p><b>Y tá:</b> {detailData.nurseName}</p>
              <p><b>Thời gian:</b> {detailData.date ? new Date(detailData.date).toLocaleString("vi-VN") : "-"}</p>
              <p><b>Địa điểm:</b> {detailData.location}</p>
              <p><b>Mô tả:</b> {detailData.description}</p>
              <p><b>Trạng thái:</b> {detailData.status === "Confirmed" ? "Đã xác nhận" : detailData.status === "Rejected" ? "Đã từ chối" : "Chờ xác nhận"}</p>
              {detailData.status === "Pending" && (
                <div style={{ marginTop: 24 }}>
                  {!showRejectInput ? (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Button
                        variant="success"
                        style={{ borderRadius: 20, fontWeight: 500, minWidth: 100 }}
                        onClick={handleConfirm}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Đang xác nhận...' : 'Xác nhận'}
                      </Button>
                      <Button
                        variant="danger"
                        style={{ borderRadius: 20, fontWeight: 500, minWidth: 100 }}
                        onClick={() => setShowRejectInput(true)}
                        disabled={actionLoading}
                      >
                        Từ chối
                      </Button>
                    </div>
                  ) : (
                    <Form onSubmit={e => { e.preventDefault(); handleReject(); }}>
                      <Form.Group>
                        <Form.Label>Lý do từ chối</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Nhập lý do từ chối..."
                          style={{ borderRadius: 8 }}
                          required
                        />
                      </Form.Group>
                      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <Button
                          variant="secondary"
                          style={{ borderRadius: 20, minWidth: 100 }}
                          onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
                          disabled={actionLoading}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="danger"
                          type="submit"
                          style={{ borderRadius: 20, minWidth: 100 }}
                          disabled={actionLoading || !rejectReason.trim()}
                        >
                          {actionLoading ? 'Đang gửi...' : 'Xác nhận từ chối'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#dc3545" }}>Không thể tải chi tiết lịch hẹn.</div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none' }}>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)} style={{ borderRadius: 20, minWidth: 100 }}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ParentConsultationAppointments;
