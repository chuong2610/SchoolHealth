import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Button, Table, Modal, Form, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaCalendarCheck, FaClock, FaTimesCircle, FaCheckCircle, FaTimes } from "react-icons/fa";

const ParentConsultationAppointments = () => {
    const { user } = useAuth();
    const parentId = user?.id;
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(`/ConsultationAppointment/parent/${parentId}?pageNumber=1&pageSize=100`);
            setAppointments(res.data.data.items || []);
        } catch (e) {
            setError("Không thể tải lịch hẹn tư vấn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (parentId) fetchAppointments();
    }, [parentId]);

    const handleConfirm = async (id) => {
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/ConsultationAppointment`, {
                consultationAppointmentId: id,
                status: "Confirmed",
                reason: ""
            });
            toast.success("Xác nhận lịch hẹn thành công!");
            fetchAppointments();
        } catch (e) {
            toast.error("Xác nhận thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedId) return;
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/ConsultationAppointment`, {
                consultationAppointmentId: selectedId,
                status: "Rejected",
                reason: rejectReason
            });
            toast.success("Từ chối lịch hẹn thành công!");
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedId(null);
            fetchAppointments();
        } catch (e) {
            toast.error("Từ chối thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    // Helper function to check if appointment is today
    const isToday = (dateString) => {
        const today = new Date();
        const appointmentDate = new Date(dateString);
        return today.toDateString() === appointmentDate.toDateString();
    };

    // Filter appointments by status and date
    const todayAppointments = appointments.filter(item =>
        item.status === "Confirmed" && isToday(item.date)
    );

    const pendingAppointments = appointments.filter(item =>
        item.status === "Pending"
    );

    const rejectedAppointments = appointments.filter(item =>
        item.status === "Rejected"
    );

    // Helper function to render appointment table
    const renderAppointmentTable = (appointments, title, icon, emptyMessage, showActions = false) => (
        <Card className="mb-4" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px 8px 0 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <h5 style={{ margin: 0, fontWeight: '600' }}>{title}</h5>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                    }}>
                        {appointments.length}
                    </span>
                </div>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
                {appointments.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: '#6c757d',
                        fontStyle: 'italic'
                    }}>
                        {emptyMessage}
                    </div>
                ) : (
                    <Table responsive hover style={{ margin: 0 }}>
                        <thead style={{ background: '#f8f9fa' }}>
                            <tr>
                                <th style={{ border: 'none', padding: '12px 16px' }}>STT</th>
                                <th style={{ border: 'none', padding: '12px 16px' }}>Học sinh</th>
                                <th style={{ border: 'none', padding: '12px 16px' }}>Y tá</th>
                                <th style={{ border: 'none', padding: '12px 16px' }}>Ngày/Giờ</th>
                                <th style={{ border: 'none', padding: '12px 16px' }}>Địa điểm</th>
                                <th style={{ border: 'none', padding: '12px 16px' }}>Trạng thái</th>
                                {showActions && (
                                    <th style={{ border: 'none', padding: '12px 16px' }}>Thao tác</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((item, idx) => (
                                <tr key={item.consultationAppointmentId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{idx + 1}</td>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle', fontWeight: '500' }}>
                                        {item.studentName}
                                    </td>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#28a745'
                                            }}></div>
                                            {item.nurseName}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                        {item.date ? (
                                            <div>
                                                <div style={{ fontWeight: '500' }}>
                                                    {new Date(item.date).toLocaleDateString("vi-VN")}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                                    {new Date(item.date).toLocaleTimeString("vi-VN", {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                        <span style={{
                                            background: '#e9ecef',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {item.location || "Chưa xác định"}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                        {item.status === "Confirmed" ? (
                                            <span style={{
                                                background: '#d4edda',
                                                color: '#155724',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <FaCheckCircle size={12} />
                                                Đã xác nhận
                                            </span>
                                        ) : item.status === "Rejected" ? (
                                            <span style={{
                                                background: '#f8d7da',
                                                color: '#721c24',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <FaTimesCircle size={12} />
                                                Đã từ chối
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: '#fff3cd',
                                                color: '#856404',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <FaClock size={12} />
                                                Chờ xác nhận
                                            </span>
                                        )}
                                    </td>
                                    {showActions && (
                                        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    disabled={actionLoading}
                                                    onClick={() => handleConfirm(item.consultationAppointmentId)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <FaCheckCircle size={10} />
                                                    Xác nhận
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    disabled={actionLoading}
                                                    onClick={() => {
                                                        setSelectedId(item.consultationAppointmentId);
                                                        setShowRejectModal(true);
                                                    }}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '0.8rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <FaTimes size={10} />
                                                    Từ chối
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );

    return (
        <div className="parent-container" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                    margin: 0,
                    color: '#2c3e50',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <FaCalendarCheck size={28} style={{ color: '#667eea' }} />
                    Lịch hẹn tư vấn
                </h2>
                <p style={{
                    margin: '8px 0 0 0',
                    color: '#6c757d',
                    fontSize: '1rem'
                }}>
                    Quản lý các lịch hẹn tư vấn sức khỏe cho con em
                </p>
            </div>

            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6c757d'
                }}>
                    <div className="spinner-border" role="status" style={{ marginBottom: '1rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div>Đang tải lịch hẹn...</div>
                </div>
            ) : error ? (
                <div style={{
                    color: '#dc3545',
                    background: '#f8d7da',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            ) : (
                <div>
                    {/* Bảng 1: Lịch hẹn hôm nay */}
                    {renderAppointmentTable(
                        todayAppointments,
                        "Lịch hẹn hôm nay",
                        <FaCalendarCheck size={20} />,
                        "Không có lịch hẹn nào được xác nhận cho hôm nay"
                    )}

                    {/* Bảng 2: Lịch hẹn chờ xác nhận */}
                    {renderAppointmentTable(
                        pendingAppointments,
                        "Lịch hẹn chờ xác nhận",
                        <FaClock size={20} />,
                        "Không có lịch hẹn nào đang chờ xác nhận",
                        true // Show actions
                    )}

                    {/* Bảng 3: Lịch hẹn đã từ chối */}
                    {renderAppointmentTable(
                        rejectedAppointments,
                        "Lịch hẹn đã từ chối",
                        <FaTimesCircle size={20} />,
                        "Không có lịch hẹn nào bị từ chối"
                    )}
                </div>
            )}

            {/* Modal từ chối lịch hẹn */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaTimesCircle />
                        Lý do từ chối lịch hẹn
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '1.5rem' }}>
                    <Form.Group>
                        <Form.Label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                            Vui lòng nhập lý do từ chối lịch hẹn này:
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                            style={{
                                border: '1px solid #ced4da',
                                borderRadius: '8px',
                                resize: 'vertical'
                            }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ border: 'none', padding: '1rem 1.5rem' }}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowRejectModal(false)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px'
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleReject}
                        disabled={actionLoading || !rejectReason.trim()}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {actionLoading ? (
                            <>
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <FaTimesCircle size={14} />
                                Từ chối lịch hẹn
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ParentConsultationAppointments; 