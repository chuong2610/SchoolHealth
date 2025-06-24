import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import {
  formatDateTime,
  formatDDMMYYYY,
  formatTime,
} from "../../utils/dateFormatter";
import "../../styles/admin/notifications-management.css";
import { exportExcelFile, importExcelFile } from "../../api/admin/excelApi";
import { toast } from "react-toastify";
import PaginationBar from "../../components/common/PaginationBar";
import { usePagination } from "../../hooks/usePagination";
import {
  getClassList,
  getHealthCheckResultDeltail,
  getNotificationDetail,
  getNotifications,
  getNurseList,
  getVaccinationResultDeltail,
  postNotification,
} from "../../api/admin/notification";

const icons = [
  {
    id: 1,
    type: "Vaccination",
    icon: "fas fa-syringe",
    badgeClass: "bg-primary",
  },
  {
    id: 2,
    type: "HealthCheck",
    icon: "fas fa-stethoscope",
    badgeClass: "bg-success",
  },
  {
    id: 3,
    type: "date",
    icon: "fas fa-calendar",
    badgeClass: "bg-primary",
  },
  {
    id: 4,
    type: "time",
    icon: "fas fa-clock",
    badgeClass: "bg-primary",
  },
  {
    id: 5,
    type: "address",
    icon: "fas fa-map-marker-alt",
    badgeClass: "bg-primary",
  },
  {
    id: 6,
    type: "hospital",
    icon: "fas fa-syringe",
    badgeClass: "bg-primary",
  },
];

const resultDefault = {
  id: "",
  height: "",
  weight: "",
  bmi: "",
  conclusion: "",
  nurseName: "",
  studentName: "",
  date: "",
};

const NotificationsManagement = () => {
  const [validated, setValidated] = useState(false);
  const [reload, setReload] = useState(false);
  const [classList, setClassList] = useState([]);
  const [nurseList, setNurseList] = useState([]);
  const [datetime, setDatetime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [modalAdd, setModalAdd] = useState({
    status: false,
    notification: {
      classId: null,
      location: "",
      type: "",
      vaccineName: "",
      title: "",
      date: "",
      message: "",
      note: "",
      assignedToId: null,
    },
  });
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 2;
  const [modalDetail, setModalDetail] = useState({
    status: false,
    notificationDetail: {},
  });
  const [modalResultDetail, setModalResultDetail] = useState({
    status: false,
    healthCheck: {},
    vaccination: {},
  });
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [importFile, setImportFile] = useState();
  const fileInputRef = useRef(null);

  const {
    currentPage: modalDetailCurrentPage,
    totalPages: modalDetailTotalPages,
    currentItems: modalDetailCurrentItems,
    handlePageChange: modalDetailHandlePageChange,
  } = usePagination(modalDetail?.notificationDetail?.results);

  const {
    currentPage: notificationCurrentPage,
    totalPages: notificationTotalPages,
    currentItems: notificationsCurrentItems,
    handlePageChange: notificationHandlePageChange,
  } = usePagination(notifications, 8);

  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    setDatetime(getMinDateTime());
  }, [modalAdd?.status]);

  const fetchClassList = async () => {
    try {
      const res = await getClassList();
      if (res) {
        setClassList([...res]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNurseList = async () => {
    try {
      const res = await getNurseList();
      if (res) {
        setNurseList([...res]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [classList]);

  const handleSubmitModalAdd = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const notificationData = { ...modalAdd?.notification };
    try {
      const res = await postNotification(notificationData);
      toast.success("Tạo và gửi thông báo thành công");
      setReload(!reload);
      setModalAdd({
        notification: {
          classId: null,
          location: "",
          type: "",
          vaccineName: "",
          title: "",
          date: "",
          message: "",
          note: "",
          assignedToId: null,
        },
        status: false,
      });
      setValidated(false);
    } catch (error) {
      toast.error("Tạo và gửi thông báo thất bại");
      console.error(error);
    }
  };

  const handleClickImport = () => {
    fileInputRef.current.click();
  };

  const handleImport = async (e, notificationId) => {
    const file = e.target.files[0];
    try {
      await importExcelFile(notificationId, file);
      toast.success("Thêm tệp kết quả thành công");
      fetchNotificationDetail(notificationId);
    } catch (error) {
      toast.error("Thêm tệp kết quả thất bại");
    }
  };

  const handleExport = async (notificationId) => {
    try {
      await exportExcelFile(notificationId);
    } catch (error) {
      toast.error("Lấy tệp mẫu thất bại");
    }
  };

  const fetchNotificationDetail = async (notificationId) => {
    try {
      const res = await getNotificationDetail(notificationId);
      if (res) {
        setModalDetail({ notificationDetail: { ...res }, status: true });
      }
    } catch (error) {}
  };

  useEffect(() => {}, [modalDetail]);

  const fetchHealthCheckResultDetail = async (healthCheckId) => {
    try {
      const res = await getHealthCheckResultDeltail(healthCheckId);
      if (res) {
        setModalDetail({ ...modalDetail, status: false });
        setModalResultDetail({
          healthCheck: { ...res },
          vaccination: {},
          status: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {}, [modalResultDetail]);

  const fetchVaccinationResultDetail = async (vaccinationId) => {
    try {
      const res = await getVaccinationResultDeltail(vaccinationId);
      if (res) {
        setModalDetail({ ...modalDetail, status: false });
        setModalResultDetail({
          healthCheck: {},
          vaccination: { ...res },
          status: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {}, [modalResultDetail]);

  const fetchNotification = async (pageNumber = 1) => {
    try {
      const res = await getNotifications(pageNumber, pageSize); // truyền page, pageSize vào API
      if (res && res.data) {
        setNotifications(res.data.items || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      } else {
        setNotifications([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      setNotifications([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotification(currentPage);
  }, [reload, currentPage]);

  return (
    <div className="admin-notifications-container">
      {/* Modern Header */}
      <div className="admin-notifications-header">
        <h1 className="admin-notifications-title">
          <i className="fas fa-bell"></i>
          Quản lý thông báo
        </h1>
        <p className="admin-notifications-subtitle">
          Tạo và quản lý thông báo cho học sinh và phụ huynh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-notifications-stats">
        <div className="admin-notifications-stat-card">
          <div className="admin-notifications-stat-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="admin-notifications-stat-value">{notifications.length}</div>
          <div className="admin-notifications-stat-label">Tổng thông báo</div>
        </div>
        <div className="admin-notifications-stat-card">
          <div className="admin-notifications-stat-icon">
            <i className="fas fa-syringe"></i>
          </div>
          <div className="admin-notifications-stat-value">
            {notifications.filter(n => n.type === 'Vaccination').length}
          </div>
          <div className="admin-notifications-stat-label">Tiêm chủng</div>
        </div>
        <div className="admin-notifications-stat-card">
          <div className="admin-notifications-stat-icon">
            <i className="fas fa-stethoscope"></i>
          </div>
          <div className="admin-notifications-stat-value">
            {notifications.filter(n => n.type === 'HealthCheck').length}
          </div>
          <div className="admin-notifications-stat-label">Kiểm tra sức khỏe</div>
        </div>
        <div className="admin-notifications-stat-card">
          <div className="admin-notifications-stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="admin-notifications-stat-value">0</div>
          <div className="admin-notifications-stat-label">Hôm nay</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-notifications-tabs">
        <button
          className={`admin-notifications-tab ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          <i className="fas fa-list me-2"></i>
          Tất cả
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'vaccination' ? 'active' : ''}`}
          onClick={() => setSelectedTab('vaccination')}
        >
          <i className="fas fa-syringe me-2"></i>
          Tiêm chủng
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'healthcheck' ? 'active' : ''}`}
          onClick={() => setSelectedTab('healthcheck')}
        >
          <i className="fas fa-stethoscope me-2"></i>
          Kiểm tra sức khỏe
        </button>
        <button
          className={`admin-notifications-tab ${selectedTab === 'today' ? 'active' : ''}`}
          onClick={() => setSelectedTab('today')}
        >
          <i className="fas fa-calendar-day me-2"></i>
          Hôm nay
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="admin-notifications-controls d-flex align-items-center gap-2">
        <div style={{ flex: 0.5 }}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
            style={{ borderRadius: '25px', border: '2px solid #10B981' }}
          />
        </div>

        {/* Filter Dropdown */}


        <button
          className="admin-notifications-btn-primary"
          onClick={() => {
            fetchClassList();
            fetchNurseList();
            setModalAdd({ ...modalAdd, status: true });
          }}
        >
          <i className="fas fa-plus"></i>
          Tạo thông báo
        </button>
      </div>

      {/* Notifications Table */}
      <div className="admin-notifications-table-container">
        {notifications.length === 0 ? (
          <div className="admin-notifications-empty">
            <div className="admin-notifications-empty-icon">
              <i className="fas fa-bell-slash"></i>
            </div>
            <h3 className="admin-notifications-empty-title">Không có thông báo</h3>
            <p className="admin-notifications-empty-description">
              Chưa có thông báo nào phù hợp với tiêu chí tìm kiếm
            </p>
            <button
              className="admin-notifications-btn-primary"
              onClick={() => {
                fetchClassList();
                fetchNurseList();
                setModalAdd({ ...modalAdd, status: true });
              }}
            >
              <i className="fas fa-plus"></i>
              Tạo thông báo đầu tiên
            </button>
          </div>
        ) : (
          <Table className="admin-notifications-table" responsive hover>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Nội dung</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>

                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {notificationsCurrentItems?.map((notification, idx) => (
                <tr key={notification.id || idx}>
                  <td>{(notificationCurrentPage - 1) * 8 + idx + 1}</td>
                  <td>
                    <div className="admin-table-title">
                      {notification.title}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-notification-type ${notification.type === 'Vaccination' ? 'health' : 'event'}`}>
                      <i className={notification.type === 'Vaccination' ? 'fas fa-syringe' : 'fas fa-stethoscope'}></i>
                      {notification.type === 'Vaccination' ? 'Tiêm chủng' : 'Kiểm tra sức khỏe'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-content">
                      {notification.message && notification.message.length > 80
                        ? `${notification.message.substring(0, 80)}...`
                        : notification.message}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-date">
                      {formatDateTime(notification.createdAt)}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-notification-status ${notification.status || 'sent'}`}>
                      <i className="fas fa-check-circle"></i>
                      Đã gửi
                    </span>
                  </td>

                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-notification-action-btn view"
                        onClick={() => fetchNotificationDetail(notification.id)}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin-notification-action-btn edit"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin-notification-action-btn delete"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>



      {/* Pagination */}
      <div
        style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}
      >
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Notification Modal */}
      <Modal
        show={modalAdd.status}
        onHide={() => setModalAdd({ ...modalAdd, status: false })}
        size="xl"
        className="admin-modal"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: 'white',
            borderBottom: 'none',
            padding: '2rem 2.5rem 1.5rem'
          }}
        >
          <Modal.Title style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 0
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <i className="fas fa-bell"></i>
            </div>
            Tạo thông báo mới
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '2.5rem', background: '#fafafa' }}>
          <Form noValidate validated={validated} onSubmit={handleSubmitModalAdd}>
            {/* Section 1: Basic Information */}
            <fieldset className="admin-form-section" style={{
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <legend style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'auto',
                margin: '0 0 1.5rem 0'
              }}>
                <i className="fas fa-info-circle"></i>
                Thông tin cơ bản
              </legend>

              <Row>
                <Col md={6}>
                  <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-form-label" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <i className="fas fa-tag" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                      Loại thông báo
                    </label>
                    <Form.Select
                      className="admin-form-control"
                      required
                      value={modalAdd.notification.type}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            type: e.target.value,
                          },
                        })
                      }
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                    >
                      <option value="">Chọn loại thông báo</option>
                      <option value="Vaccination">💉 Tiêm chủng</option>
                      <option value="HealthCheck">🩺 Kiểm tra sức khỏe</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-form-label" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <i className="fas fa-graduation-cap" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                      Lớp học
                    </label>
                    <Form.Select
                      className="admin-form-control"
                      required
                      value={modalAdd.notification.classId || ""}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            classId: e.target.value,
                          },
                        })
                      }
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                    >
                      <option style={{ color: 'blackhay' }} value="">Chọn lớp học</option>
                      {classList.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          🎓 {cls.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
              </Row>

              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="admin-form-label" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <i className="fas fa-heading" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                  Tiêu đề thông báo
                </label>
                <Form.Control
                  type="text"
                  className="admin-form-control"
                  placeholder="Nhập tiêu đề thông báo rõ ràng, dễ hiểu..."
                  required
                  value={modalAdd.notification.title}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        title: e.target.value,
                      },
                    })
                  }
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: '0' }}>
                <label className="admin-form-label" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <i className="fas fa-syringe" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                  Tên Vắc Xin
                </label>
                <Form.Control
                  type="text"
                  className="admin-form-control"
                  placeholder="Nhập tên vắc xin cụ thể (ví dụ: Vaccine COVID-19, Vaccine cúm mùa)..."
                  value={modalAdd.notification.vaccineName}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        vaccineName: e.target.value,
                      },
                    })
                  }
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                />
              </div>
            </fieldset>

            {/* Section 2: Notification Details */}
            <fieldset className="admin-form-section" style={{
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <legend style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'auto',
                margin: '0 0 1.5rem 0'
              }}>
                <i className="fas fa-file-text"></i>
                Chi tiết thông báo
              </legend>

              <Row>
                <Col md={6}>
                  <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-form-label" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                      Ngày và giờ thực hiện
                    </label>
                    <Form.Control
                      type="datetime-local"
                      className="admin-form-control"
                      required
                      min={datetime}
                      value={modalAdd.notification.date}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            date: e.target.value,
                          },
                        })
                      }
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="admin-form-label" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                      Địa điểm thực hiện
                    </label>
                    <Form.Control
                      type="text"
                      className="admin-form-control"
                      placeholder="Ví dụ: Phòng y tế trường, Sân trường..."
                      required
                      value={modalAdd.notification.location}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            location: e.target.value,
                          },
                        })
                      }
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                    />
                  </div>
                </Col>
              </Row>



              <div className="admin-form-group" style={{ marginBottom: '0' }}>
                <label className="admin-form-label" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <i className="fas fa-edit" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                  Nội dung thông báo
                </label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className="admin-form-control"
                  placeholder="Nhập nội dung chi tiết của thông báo để phụ huynh và học sinh hiểu rõ về hoạt động..."
                  required
                  value={modalAdd.notification.message}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        message: e.target.value,
                      },
                    })
                  }
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
              </div>
            </fieldset>

            {/* Section 3: Nurse Assignment */}
            <fieldset className="admin-form-section" style={{
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <legend style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'auto',
                margin: '0 0 1.5rem 0'
              }}>
                <i className="fas fa-user-nurse"></i>
                Phân công y tá
              </legend>

              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="admin-form-label" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <i className="fas fa-user-md" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                  Y tá phụ trách
                </label>
                <Form.Select
                  className="admin-form-control"
                  required
                  value={modalAdd.notification.assignedToId || ""}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        assignedToId: e.target.value,
                      },
                    })
                  }
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                >
                  <option value="">Chọn y tá phụ trách</option>
                  {nurseList.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      👩‍⚕️ {nurse.fullName}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '0' }}>
                <label className="admin-form-label" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <i className="fas fa-sticky-note" style={{ color: '#059669', marginRight: '0.5rem' }}></i>
                  Ghi chú thêm
                  <span style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    fontWeight: '400',
                    marginLeft: '0.5rem'
                  }}>(không bắt buộc)</span>
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="admin-form-control"
                  placeholder="Ghi chú thêm cho y tá về cách thực hiện, lưu ý đặc biệt..."
                  value={modalAdd.notification.note}
                  onChange={(e) =>
                    setModalAdd({
                      ...modalAdd,
                      notification: {
                        ...modalAdd.notification,
                        note: e.target.value,
                      },
                    })
                  }
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    resize: 'vertical',
                    minHeight: '90px'
                  }}
                />
              </div>
            </fieldset>

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingTop: '1.5rem',
              borderTop: '2px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={() => setModalAdd({ ...modalAdd, status: false })}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  border: '2px solid #d1d5db',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <i className="fas fa-times"></i>
                Hủy bỏ
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                }}
              >
                <i className="fas fa-paper-plane"></i>
                Tạo và gửi thông báo
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Detail Modal */}
      <Modal
        show={modalDetail.status}
        onHide={() => setModalDetail({ ...modalDetail, status: false })}
        size="xl"
        className="admin-modal"
      >
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title>
            <i className="fas fa-eye me-2"></i>
            Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          {modalDetail.notificationDetail && (
            <div className="admin-notification-detail">
              <div className="admin-detail-section">
                <h5 className="admin-detail-title">Thông tin thông báo</h5>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <label>Tiêu đề:</label>
                    <span>{modalDetail.notificationDetail.title}</span>
                  </div>
                  <div className="admin-detail-item">
                    <label>Loại:</label>
                    <span className={`admin-notification-type ${modalDetail.notificationDetail.type === 'Vaccination' ? 'health' : 'event'}`}>
                      {modalDetail.notificationDetail.type === 'Vaccination' ? 'Tiêm chủng' : 'Kiểm tra sức khỏe'}
                    </span>
                  </div>
                  <div className="admin-detail-item">
                    <label>Ngày tạo:</label>
                    <span>{formatDateTime(modalDetail.notificationDetail.createdAt)}</span>
                  </div>
                  <div className="admin-detail-item">
                    <label>Địa điểm:</label>
                    <span>{modalDetail.notificationDetail.location}</span>
                  </div>
                </div>
                <div className="admin-detail-content">
                  <label>Nội dung:</label>
                  <p>{modalDetail.notificationDetail.message}</p>
                </div>
              </div>

              {modalDetail.notificationDetail.results && modalDetail.notificationDetail.results.length > 0 && (
                <div className="admin-detail-section">
                  <div className="admin-detail-header">
                    <h5 className="admin-detail-title">Kết quả thực hiện</h5>
                    <div className="admin-detail-actions">
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".xlsx,.xls"
                        onChange={(e) => handleImport(e, modalDetail.notificationDetail.id)}
                      />
                      <button
                        className="admin-notifications-btn-secondary"
                        onClick={() => handleExport(modalDetail.notificationDetail.id)}
                      >
                        <i className="fas fa-download me-2"></i>
                        Tải mẫu
                      </button>
                      <button
                        className="admin-notifications-btn-primary"
                        onClick={handleClickImport}
                      >
                        <i className="fas fa-upload me-2"></i>
                        Nhập kết quả
                      </button>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <Table className="admin-table" responsive>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Họ tên học sinh</th>
                          <th>Lớp</th>
                          <th>Ngày thực hiện</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modalDetailCurrentItems?.map((result, idx) => (
                          <tr key={result.id || idx}>
                            <td>{(modalDetailCurrentPage - 1) * 10 + idx + 1}</td>
                            <td>{result.studentName}</td>
                            <td>{result.className}</td>
                            <td>{formatDDMMYYYY(result.date)}</td>
                            <td>
                              <span className={`admin-status-badge ${result.healthCheckId || result.vaccinationId ? 'completed' : 'pending'}`}>
                                {result.healthCheckId || result.vaccinationId ? 'Đã hoàn thành' : 'Chưa thực hiện'}
                              </span>
                            </td>
                            <td>
                              {(result.healthCheckId || result.vaccinationId) && (
                                <button
                                  className="admin-action-btn view"
                                  onClick={() => {
                                    if (result.healthCheckId) {
                                      fetchHealthCheckResultDetail(result.healthCheckId);
                                    } else if (result.vaccinationId) {
                                      fetchVaccinationResultDetail(result.vaccinationId);
                                    }
                                  }}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {modalDetailTotalPages > 1 && (
                    <div className="admin-pagination-wrapper">
                      <PaginationBar
                        currentPage={modalDetailCurrentPage}
                        totalPages={modalDetailTotalPages}
                        onPageChange={modalDetailHandlePageChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Result Detail Modal */}
      <Modal
        show={modalResultDetail.status}
        onHide={() => setModalResultDetail({ ...modalResultDetail, status: false })}
        size="lg"
        className="admin-modal"
      >
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title>
            <i className="fas fa-file-medical me-2"></i>
            Chi tiết kết quả
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          {modalResultDetail.healthCheck?.id && (
            <div className="admin-result-detail">
              <h5 className="admin-detail-title">Kết quả kiểm tra sức khỏe</h5>
              <div className="admin-detail-grid">
                <div className="admin-detail-item">
                  <label>Học sinh:</label>
                  <span>{modalResultDetail.healthCheck.studentName}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Ngày kiểm tra:</label>
                  <span>{formatDDMMYYYY(modalResultDetail.healthCheck.date)}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Chiều cao:</label>
                  <span>{modalResultDetail.healthCheck.height} cm</span>
                </div>
                <div className="admin-detail-item">
                  <label>Cân nặng:</label>
                  <span>{modalResultDetail.healthCheck.weight} kg</span>
                </div>
                <div className="admin-detail-item">
                  <label>BMI:</label>
                  <span>{modalResultDetail.healthCheck.bmi}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Y tá thực hiện:</label>
                  <span>{modalResultDetail.healthCheck.nurseName}</span>
                </div>
              </div>
              <div className="admin-detail-content">
                <label>Kết luận:</label>
                <p>{modalResultDetail.healthCheck.conclusion}</p>
              </div>
            </div>
          )}

          {modalResultDetail.vaccination?.id && (
            <div className="admin-result-detail">
              <h5 className="admin-detail-title">Kết quả tiêm chủng</h5>
              <div className="admin-detail-grid">
                <div className="admin-detail-item">
                  <label>Học sinh:</label>
                  <span>{modalResultDetail.vaccination.studentName}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Ngày tiêm:</label>
                  <span>{formatDDMMYYYY(modalResultDetail.vaccination.date)}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Vaccine:</label>
                  <span>{modalResultDetail.vaccination.vaccineName}</span>
                </div>
                <div className="admin-detail-item">
                  <label>Y tá thực hiện:</label>
                  <span>{modalResultDetail.vaccination.nurseName}</span>
                </div>
              </div>
              <div className="admin-detail-content">
                <label>Ghi chú:</label>
                <p>{modalResultDetail.vaccination.note || 'Không có ghi chú'}</p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationsManagement;
