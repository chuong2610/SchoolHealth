import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Button, Table, Modal, Form, Row, Card } from "react-bootstrap";
import { FaCalendarCheck, FaInfoCircle } from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import ConfirmModal from "../../components/common/ConfirmModal"; // Thêm dòng này
import styles from "./ConsultationAppointments.module.css";

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
  const pageSize = 10;

  // Modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState(false); // Thêm dòng này

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
        reason: "",
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
        reason: rejectReason.trim(),
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
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <FaCalendarCheck size={20} />
        <h5 className={styles.cardTitle}>{title}</h5>
      </div>
      <div className={styles.cardBody}>
        {appointments.length === 0 ? (
          <div className={styles.emptyBox}>{emptyMessage}</div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Học sinh</th>
                    <th>Y tá</th>
                    <th>Ngày/Giờ</th>
                    <th>Địa điểm</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item, idx) => (
                    <tr key={item.consultationAppointmentId}>
                      <td>
                        {showPagination
                          ? (currentPageNum - 1) * pageSize + idx + 1
                          : idx + 1}
                      </td>
                      <td>{item.studentName}</td>
                      <td>{item.nurseName}</td>
                      <td>
                        {item.date ? (
                          <>
                            <div>
                              {new Date(item.date).toLocaleDateString("vi-VN")}
                            </div>
                            <div className={styles.timeText}>
                              {new Date(item.date).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <span className={styles.locationText}>
                          {item.location || "Chưa xác định"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            item.status === "Confirmed"
                              ? styles.badgeConfirmed
                              : item.status === "Rejected"
                              ? styles.badgeRejected
                              : styles.badgePending
                          }
                        >
                          {item.status === "Confirmed"
                            ? "Đã xác nhận"
                            : item.status === "Rejected"
                            ? "Đã từ chối"
                            : "Chờ xác nhận"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.detailBtn}
                          onClick={() =>
                            handleShowDetail(item.consultationAppointmentId)
                          }
                          type="button"
                        >
                          <FaInfoCircle style={{ marginBottom: 2 }} /> Xem chi
                          tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showPagination && totalPagesNum > 1 && onPageChangeFunc && (
              <div className={styles.paginationRow}>
                <PaginationBar
                  currentPage={currentPageNum}
                  totalPages={totalPagesNum}
                  onPageChange={onPageChangeFunc}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.consultationContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            <FaCalendarCheck className={styles.headerIcon} />
            Lịch hẹn tư vấn
          </h1>
        </div>
      </div>
      {loading ? (
        <div>
          <div role="status">
            <span>Loading...</span>
          </div>
          <div>Đang tải lịch hẹn...</div>
        </div>
      ) : error ? (
        <div>{error}</div>
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
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaInfoCircle /> Chi tiết lịch hẹn tư vấn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {detailLoading ? (
            <div className={styles.loadingBox}>
              <div className={styles.loadingSpinner} role="status">
                <span>Loading...</span>
              </div>
              <div>Đang tải chi tiết...</div>
            </div>
          ) : detailData ? (
            <div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Học sinh:</div>
                <div className={styles.modalValue}>
                  {detailData.studentName}
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Y tá:</div>
                <div className={styles.modalValue}>{detailData.nurseName}</div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Thời gian:</div>
                <div className={styles.modalValue}>
                  {detailData.date
                    ? new Date(detailData.date).toLocaleString("vi-VN")
                    : "-"}
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Địa điểm:</div>
                <div className={styles.modalValue}>{detailData.location}</div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Mô tả:</div>
                <div className={styles.modalValue}>
                  {detailData.description}
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalLabel}>Trạng thái:</div>
                <div className={styles.modalValue}>
                  <span
                    className={
                      detailData.status === "Confirmed"
                        ? styles.badgeConfirmed
                        : detailData.status === "Rejected"
                        ? styles.badgeRejected
                        : styles.badgePending
                    }
                  >
                    {detailData.status === "Confirmed"
                      ? "Đã xác nhận"
                      : detailData.status === "Rejected"
                      ? "Đã từ chối"
                      : "Chờ xác nhận"}
                  </span>
                </div>
              </div>
              {detailData.status === "Pending" && (
                <div className={styles.modalSection}>
                  {!showRejectInput ? (
                    <div className={styles.actionButtons}>
                      <Button
                        variant="success"
                        className={styles.confirmBtn}
                        onClick={() => {
                          setConfirmModal(true);
                          setShowDetailModal(false);
                        }}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Đang xác nhận..." : "Xác nhận"}
                      </Button>
                      <Button
                        variant="danger"
                        className={styles.rejectBtn}
                        onClick={() => setShowRejectInput(true)}
                        disabled={actionLoading}
                      >
                        Từ chối
                      </Button>
                    </div>
                  ) : (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReject();
                      }}
                    >
                      <Form.Group>
                        <Form.Label className={styles.modalLabel}>
                          Lý do từ chối
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Nhập lý do từ chối..."
                          className={styles.textarea}
                          required
                        />
                      </Form.Group>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="secondary"
                          className={styles.cancelBtn}
                          onClick={() => {
                            setShowRejectInput(false);
                            setRejectReason("");
                          }}
                          disabled={actionLoading}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="danger"
                          type="submit"
                          className={styles.rejectBtn}
                          disabled={actionLoading || !rejectReason.trim()}
                        >
                          {actionLoading ? "Đang gửi..." : "Xác nhận từ chối"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.errorBox}>
              Không thể tải chi tiết lịch hẹn.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={confirmModal}
        onHide={() => {
          setConfirmModal(false);
          setShowDetailModal(true);
        }}
        onConfirm={async () => {
          await handleConfirm();
          setConfirmModal(false);
        }}
        title="Xác nhận lịch hẹn"
        message="Bạn có chắc chắn muốn xác nhận lịch hẹn tư vấn này không?"
        confirmText="Xác nhận"
        confirmVariant="success"
      />
    </div>
  );
};

export default ParentConsultationAppointments;
