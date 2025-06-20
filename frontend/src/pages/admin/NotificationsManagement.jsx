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
// Styles được import từ main.jsx
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
import { use } from "react";

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
      assignedToId: null, // Y tá phụ trách
    },
  });
  const [notifications, setNotifications] = useState([]);
  const [modalDetail, setModalDetail] = useState({
    status: false,
    notificationDetail: {},
  });
  const [modalResultDetail, setModalResultDetail] = useState({
    status: false,
    healthCheck: {},
    vaccination: {},
  });
  const [importFile, setImportFile] = useState();
  const fileInputRef = useRef(null);
  const {
    currentPage: modalDetailCurrentPage,
    totalPages: modalDetailTotalPages,
    currentItems: modalDetailCurrentItems,
    handlePageChange: modalDetailHandlePageChange,
  } = usePagination(modalDetail?.notificationDetail?.results); // Dữ liệu phân trang cho chi tiết thông báo

  const {
    currentPage: notificationCurrentPage,
    totalPages: notificationTotalPages,
    currentItems: notificationsCurrentItems,
    handlePageChange: notificationHandlePageChange,
  } = usePagination(notifications, 10); // Dữ liệu phân trang cho danh sách thông báo

  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // điều chỉnh theo timezone
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
      console.log("Loi fetchClassList:", error);
      throw error;
    }
  };

  const fetchNurseList = async () => {
    try {
      const res = await getNurseList();
      if (res) {
        setNurseList([...res]);
      }
    } catch (error) {
      console.log("Loi fetchNurseList:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log(classList);
  }, [classList]);

  const handleSubmitModalAdd = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return; // Dừng nếu form không hợp lệ
    }
    const notificationData = { ...modalAdd?.notification };
    console.log(notificationData);
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
          assignedToId: null, // Y tá phụ trách
        },
        status: false,
      });
      setValidated(false); // Reset validated state
    } catch (error) {
      toast.error("Tạo và gửi thông báo thất bại");
      console.log("Loi handleSubmitModalAdd:", error);
      throw error;
    }
  };

  const handleClickImport = () => {
    // Khi bấm button, kích hoạt click trên input file ẩn
    fileInputRef.current.click();
  };

  const handleImport = async (e, notificationId) => {
    // const notificationId = 1;
    const file = e.target.files[0];
    try {
      await importExcelFile(notificationId, file);
      toast.success("Thêm tệp kết quả thành công");
      fetchNotificationDetail();
    } catch (error) {
      console.log("Loi handleImport");
      toast.error("Thêm tệp kết quả thất bại");
    }
  };

  const handleExport = async (notificationId) => {
    // const notificationId = 2;
    try {
      await exportExcelFile(notificationId);
      // toast.success("Lấy tệp mẫu thành công");
    } catch (error) {
      console.log("Loi handleExport");
      toast.error("Lấy tệp mẫu thất bại");
    }
  };

  const fetchNotificationDetail = async (notificationId) => {
    try {
      const res = await getNotificationDetail(notificationId);
      console.log("fetchNotificationDetail:", res);

      if (res) {
        setModalDetail({ notificationDetail: { ...res }, status: true });
      }
    } catch (error) {
      console.log("Loi fetchNotificationDetail");
    }
  };

  useEffect(() => {
    console.log(modalDetail);
  }, [modalDetail]);

  const fetchHealthCheckResultDetail = async (healthCheckId) => {
    // const healthCheckId = 5;
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
      console.log("Loi fetchHealthCheckResultDetail:", error);
      throw error;
    }
  };
  useEffect(() => {
    console.log(modalResultDetail);
  }, [modalResultDetail]);

  const fetchVaccinationResultDetail = async (vaccinationId) => {
    // const vaccinationId = 1;
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
      console.log("Loi fetchVaccinationResultDetail:", error);
      throw error;
    }
  };
  useEffect(() => {
    console.log(modalResultDetail);
  }, [modalResultDetail]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getNotifications();
        if (res) {
          setNotifications([...res]);
        }
      } catch (error) {
        console.log("Loi fetchNotification:", error);
        throw error;
      }
    };

    fetchNotification();
  }, [reload]);
  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div className="admin-notifications-container">
      <div className="admin-notifications-header">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="admin-notifications-title mb-2">
              <i className="fas fa-bell me-3"></i>
              Quản lý thông báo
            </h1>
            <p className="admin-notifications-subtitle mb-0">
              Tạo và quản lý thông báo cho học sinh và phụ huynh với giao diện gradient cam tím
            </p>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-3">
              <button
                className="admin-primary-btn"
                onClick={() => {
                  fetchClassList();
                  fetchNurseList();
                  setModalAdd({ ...modalAdd, status: true });
                }}
              >
                <i className="fa-solid fa-circle-plus me-2"></i>
                Tạo thông báo mới
              </button>
              <button className="admin-secondary-btn">
                <i className="fas fa-download me-2"></i>
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-notifications-stats">
        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="admin-notification-stat-value">{notifications.length}</div>
          <div className="admin-notification-stat-label">Tổng thông báo</div>
        </div>
        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            <i className="fas fa-syringe"></i>
          </div>
          <div className="admin-notification-stat-value">
            {notifications.filter(n => n.type === 'Vaccination').length}
          </div>
          <div className="admin-notification-stat-label">Tiêm chủng</div>
        </div>
        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            <i className="fas fa-stethoscope"></i>
          </div>
          <div className="admin-notification-stat-value">
            {notifications.filter(n => n.type === 'HealthCheck').length}
          </div>
          <div className="admin-notification-stat-label">Kiểm tra sức khỏe</div>
        </div>
        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="admin-notification-stat-value">
            {notifications.filter(n => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="admin-notification-stat-label">Hôm nay</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-notifications-quick-actions">
        <button className="admin-notifications-quick-btn active">
          <i className="fas fa-list me-1"></i>
          Tất cả
        </button>
        <button className="admin-notifications-quick-btn">
          <i className="fas fa-syringe me-1"></i>
          Tiêm chủng
        </button>
        <button className="admin-notifications-quick-btn">
          <i className="fas fa-stethoscope me-1"></i>
          Kiểm tra sức khỏe
        </button>
        <button className="admin-notifications-quick-btn">
          <i className="fas fa-clock me-1"></i>
          Hôm nay
        </button>
        <button className="admin-notifications-quick-btn">
          <i className="fas fa-check-circle me-1"></i>
          Đã xem
        </button>
        <button className="admin-notifications-quick-btn">
          <i className="fas fa-circle-dot me-1"></i>
          Chưa xem
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-notifications-search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm thông báo..."
          className="admin-notifications-search-input"
        />
        <select className="admin-notifications-search-input" style={{ flex: '0 0 200px' }}>
          <option value="">Tất cả loại</option>
          <option value="Vaccination">Tiêm chủng</option>
          <option value="HealthCheck">Kiểm tra sức khỏe</option>
        </select>
        <button className="admin-medicine-filter-btn">
          <i className="fas fa-filter"></i>
          Lọc nâng cao
        </button>
      </div>

      {/* Notifications Grid */}
      <div className="admin-notifications-grid">
        {notificationsCurrentItems?.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#757575' }}>
            <i className="fas fa-bell" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            <h4>Không có thông báo nào</h4>
            <p>Chưa có thông báo nào được tạo</p>
          </div>
        ) : (
          notificationsCurrentItems?.map((notification, idx) => (
            <div key={idx} className={`admin-notification-card ${idx % 3 === 0 ? 'unread' : 'read'}`}>
              <div className="admin-notification-header">
                <div className={`admin-notification-icon ${notification.type === 'Vaccination' ? 'info' : 'success'}`}>
                  {notification.type === "Vaccination" ?
                    <i className="fas fa-syringe"></i> :
                    <i className="fas fa-stethoscope"></i>
                  }
                </div>
                <div className="admin-notification-content">
                  <h5 className="admin-notification-title">{notification.title}</h5>
                  <p className="admin-notification-description">{notification.message}</p>
                  <div className="admin-notification-meta">
                    <div className="admin-notification-time">
                      <i className="fas fa-calendar me-1"></i>
                      {formatDateTime(notification.createdAt)}
                    </div>
                    <div className={`admin-notification-status ${idx % 3 === 0 ? 'unread' : 'read'}`}>
                      {idx % 3 === 0 ? 'Chưa xem' : 'Đã xem'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-notification-actions">
                <button
                  className="admin-notification-btn view"
                  onClick={() => fetchNotificationDetail(notification.id)}
                >
                  <i className="fas fa-eye"></i>
                  Chi tiết
                </button>
                {idx % 3 === 0 && (
                  <button className="admin-notification-btn mark-read">
                    <i className="fas fa-check"></i>
                    Đánh dấu đã xem
                  </button>
                )}
                <button className="admin-notification-btn delete">
                  <i className="fas fa-trash"></i>
                  Xóa
                </button>
              </div>

              {/* Additional Info */}
              <div style={{
                padding: '1rem 1.5rem 0',
                fontSize: '0.8rem',
                color: '#757575',
                borderTop: '1px solid #F0F0F0',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>
                  <i className="fas fa-graduation-cap me-1"></i>
                  Lớp {notification.className}
                </span>
                <span>
                  <i className="fas fa-hashtag me-1"></i>
                  #{notification.id}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <PaginationBar
          currentPage={notificationCurrentPage}
          totalPages={notificationTotalPages}
          onPageChange={notificationHandlePageChange}
        />
      </div>

      {/* ModalAdd */}
      {modalAdd && (
        <Modal
          size="xl"
          show={modalAdd.status}
          onHide={() => setModalAdd({ ...modalAdd, status: false })}
          className="admin-modal-notification"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h5>Tạo thông báo mới</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              id="formAddNotification"
              noValidate
              validated={validated}
              onSubmit={handleSubmitModalAdd}
            >
              <Form.Group>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="class">Lớp</h6>
                    </Form.Label>
                    <Form.Select
                      required
                      value={modalAdd?.notification?.classId ?? ""}
                      onChange={(e) => {
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            classId: Number(e.target.value),
                          },
                        });
                      }}
                    >
                      <option value="">--Chọn lớp--</option>
                      {classList?.map((cls) => (
                        <option key={cls.classId} value={cls.classId}>
                          {cls.className}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn lớp
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6 data-field="nurse">Y tá</h6>
                    </Form.Label>
                    <Form.Select
                      required
                      value={modalAdd?.notification?.assignedToId ?? ""}
                      onChange={(e) => {
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            assignedToId: Number(e.target.value),
                          },
                        });
                      }}
                    >
                      <option value="">--Chọn y tá phụ trách--</option>
                      {nurseList?.map((nurse) => (
                        <option key={nurse.id} value={nurse.id}>
                          {nurse.nurseName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn y tá phụ trách
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="type">Loại thông báo</h6>
                    </Form.Label>
                    <Form.Select
                      required
                      value={modalAdd?.notification?.type ?? ""}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            type: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">--Chọn loại--</option>
                      <option value="Vaccination">Tiêm chủng</option>
                      <option value="HealthCheck">Kiểm tra sức khỏe</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn loại thông báo
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6 data-field="vaccine">Tên vắc-xin {"(Chỉ tiêm chủng)"}</h6>
                    </Form.Label>
                    <Form.Control
                      disabled={
                        modalAdd?.notification?.type === "Vaccination"
                          ? false
                          : true
                      }
                      required={
                        modalAdd?.notification?.type === "Vaccination"
                          ? true
                          : false
                      }
                      value={modalAdd?.notification?.vaccineName}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd?.notification,
                            vaccineName: e.target.value,
                          },
                        })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên vắc-xin
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="title">Tiêu đề</h6>
                    </Form.Label>
                    <Form.Control
                      required
                      value={modalAdd?.notification?.title}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd?.notification,
                            title: e.target.value,
                          },
                        })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tiêu đề thông báo
                    </Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6 data-field="time">Thời gian</h6>
                    </Form.Label>
                    <Form.Control
                      required
                      type="datetime-local"
                      value={modalAdd?.notification?.date ?? datetime}
                      min={getMinDateTime()}
                      onChange={(e) => {
                        setDatetime(e.target.value);
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd?.notification,
                            date: e.target.value,
                          },
                        });
                      }}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn thời gian
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="location">Địa điểm</h6>
                    </Form.Label>
                    <Form.Control
                      required
                      value={modalAdd?.notification?.location}
                      onChange={(e) =>
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd.notification,
                            location: e.target.value,
                          },
                        })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập địa điểm
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="description">Mô tả</h6>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={modalAdd?.notification?.message}
                      onChange={(e) => {
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd?.notification,
                            message: e.target.value,
                          },
                        });
                      }}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6 data-field="note">Ghi chú</h6>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={modalAdd?.notification?.note}
                      onChange={(e) => {
                        setModalAdd({
                          ...modalAdd,
                          notification: {
                            ...modalAdd?.notification,
                            note: e.target.value,
                          },
                        });
                      }}
                    ></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalAdd({ ...modalAdd, status: false })}
            >
              Đóng
            </Button>
            <Button
              form="formAddNotification"
              variant="success"
              className="px-4"
              type="submit"
            // onClick={() => handleSubmitModalAdd()}
            >
              Tạo
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* ModalDetail */}
      {modalDetail && (
        <Modal
          size="xl"
          show={modalDetail.status}
          onHide={() => setModalDetail({ ...modalDetail, status: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h5>Chi tiết thông báo</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Thông tin:</h6>
            {/* Render thong tin detail */}
            <Row>
              <Col md={1}>
                <i
                  className={icons.find((icon) => icon.type === "date")?.icon}
                ></i>
              </Col>
              <Col>
                Ngày: {/* {modalDetail?.notificationDetail?.date} */}
                {formatDDMMYYYY(modalDetail?.notificationDetail?.date)}
              </Col>
            </Row>
            <Row>
              <Col md={1}>
                <i
                  className={icons.find((icon) => icon.type === "time")?.icon}
                ></i>
              </Col>
              <Col>
                Thời gian:{" "}
                {/* {new Date(modal.notification?.date).toLocaleTimeString()} */}
                {formatTime(modalDetail?.notificationDetail?.date)}
              </Col>
            </Row>
            <Row>
              <Col md={1}>
                <i
                  className={
                    icons.find((icon) => icon.type === "address")?.icon
                  }
                ></i>
              </Col>
              <Col>Địa điểm: {modalDetail?.notificationDetail?.location}</Col>
            </Row>
            {modalDetail.notificationDetail?.type === "Vaccination" && (
              <Row>
                <Col md={1}>
                  <i
                    className={
                      icons.find((icon) => icon.type === "hospital")?.icon
                    }
                  ></i>
                </Col>
                <Col>Vắc-xin: {modalDetail.notificationDetail?.name} </Col>
              </Row>
            )}

            <h6 className="mt-3 mb-3">Ghi chú:</h6>

            <ul>
              <li>{modalDetail.notificationDetail?.note}</li>
            </ul>

            <Row className="border-top mb-3 mt-3"></Row>

            {/* Render table ket qua */}
            <h4 className="mt-3">Kết quả</h4>
            {modalDetail?.notificationDetail?.type === "HealthCheck" && (
              <div className="rounded-3 overflow-hidden border">
                <Table
                  hover
                  // responsive
                  size="sm"
                  className="justify-content-center"
                >
                  <thead>
                    <tr>
                      <th>Tên học sinh</th>
                      <th>Chiều cao</th>
                      <th>Cân nặng</th>
                      <th>Chỉ số cơ thể {`(BMI)`}</th>
                      <th>Kết luận</th>
                      <th>Y tá</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalDetail?.notificationDetail?.results?.length == 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      modalDetail?.notificationDetail?.results?.map(
                        (result, idx) => (
                          <tr key={idx}>
                            <td>{result.studentName}</td>
                            <td>{result.height}</td>
                            <td>{result.weight}</td>
                            <td>{result.bmi}</td>
                            <td>{result.conclusion}</td>
                            <td>{result.nurseName}</td>
                            <td>
                              <Button
                                variant="outline-info"
                                onClick={() =>
                                  fetchHealthCheckResultDetail(result.id)
                                }
                              >
                                <i className="fa-solid fa-eye"></i>
                              </Button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            )}
            {modalDetail?.notificationDetail?.type === "Vaccination" && (
              <div className="rounded-3 overflow-hidden border">
                <Table
                  hover
                  // responsive
                  size="sm"
                  className="justify-content-center"
                >
                  <thead>
                    <tr>
                      <th>Tên học sinh</th>
                      <th>Tên Vắc-xin</th>
                      <th>Địa điểm</th>
                      <th>Ngày</th>
                      <th>Y tá</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalDetailCurrentItems?.length == 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      modalDetailCurrentItems?.map((result, idx) => (
                        <tr key={idx}>
                          <td>{result.studentName}</td>
                          <td>{result.vaccineName}</td>
                          <td>{result.location}</td>
                          <td>{formatDDMMYYYY(result.date)}</td>
                          <td>{result.nurseName}</td>
                          <td>
                            <Button
                              variant="outline-info"
                              onClick={() =>
                                fetchVaccinationResultDetail(result.id)
                              }
                            >
                              <i className="fa-solid fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
            <div className="d-flex justify-content-end mt-3 me-3">
              <PaginationBar
                currentPage={modalDetailCurrentPage}
                totalPages={modalDetailTotalPages}
                onPageChange={modalDetailHandlePageChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Row className="w-100">
              <Col
                className="text-start"
                style={{
                  display:
                    modalDetail?.notificationDetail?.results?.length > 0
                      ? "none"
                      : "block",
                }}
              >
                <Button variant="info" onClick={() => handleClickImport()}>
                  <i className="fa-solid fa-upload"></i> Thêm tệp kết quả
                </Button>
                <input
                  type="file"
                  accept=".xlsx"
                  ref={fileInputRef}
                  onChange={(e) =>
                    handleImport(e, modalDetail?.notificationDetail?.id)
                  }
                  style={{ display: "none" }} // Ẩn input file
                />

                <Button
                  variant="success"
                  className="px-3 ms-2"
                  onClick={() =>
                    handleExport(modalDetail?.notificationDetail?.id)
                  }
                >
                  <i className="fa-solid fa-download"></i> Lấy tệp mẫu
                </Button>
              </Col>
              <Col className="text-end">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setModalDetail({ ...modalDetail, status: false })
                  }
                >
                  Đóng
                </Button>
                {/* <Button variant="success" className="px-4 ms-2">
                  Tạo
                </Button> */}
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      )}

      {/* ModalResultDetail */}
      {modalResultDetail && (
        <Modal
          size="xl"
          show={modalResultDetail?.status}
          onHide={() => {
            setModalDetail({ ...modalDetail, status: true });
            setModalResultDetail({ ...modalResultDetail, status: false });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h5>Kết quả chi tiết</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.keys(modalResultDetail?.healthCheck)?.length > 0 && (
              <>
                <Row className="mb-3">
                  <Col>
                    <strong>Tên học sinh: </strong>
                    {modalResultDetail?.healthCheck?.studentName}
                  </Col>
                  <Col>
                    <strong>Tên y tá: </strong>
                    {modalResultDetail?.healthCheck?.nurseName}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Chiều cao: </strong>
                    {modalResultDetail?.healthCheck?.height}
                  </Col>
                  <Col>
                    <strong>Cân nặng: </strong>
                    {modalResultDetail?.healthCheck?.weight}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Thị lực mắt trái: </strong>
                    {modalResultDetail?.healthCheck?.visionLeft}
                  </Col>
                  <Col>
                    <strong>Thị lực mắt phải: </strong>
                    {modalResultDetail?.healthCheck?.visionRight}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Nhịp tim: </strong>
                    {modalResultDetail?.healthCheck?.heartRate}
                  </Col>
                  <Col>
                    <strong>Huyết áp: </strong>
                    {modalResultDetail?.healthCheck?.bloodPressure}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Chỉ số cơ thể {`(BMI)`}: </strong>
                    {modalResultDetail?.healthCheck?.bmi}
                  </Col>
                  <Col>
                    <strong>Kết luận: </strong>
                    {modalResultDetail?.healthCheck?.conclusion}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Thời gian: </strong>
                    {formatDateTime(modalResultDetail?.healthCheck?.date)}
                  </Col>
                  <Col>
                    <strong>Địa điểm: </strong>
                    {modalResultDetail?.healthCheck?.location}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Mô tả: </strong>
                    {modalResultDetail?.healthCheck?.description}
                  </Col>
                </Row>
              </>
            )}

            {Object.keys(modalResultDetail?.vaccination)?.length > 0 && (
              <>
                <Row className="mb-3">
                  <Col>
                    vaccineName
                    <strong>Tên học sinh: </strong>
                    {modalResultDetail?.vaccination?.studentName}
                  </Col>
                  <Col>
                    <strong>Tên y tá: </strong>
                    {modalResultDetail?.vaccination?.nurseName}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Tên vắc-xin: </strong>
                    {modalResultDetail?.vaccination?.vaccineName}
                  </Col>
                  <Col>
                    <strong>Kết quả: </strong>
                    {modalResultDetail?.vaccination?.result}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Thời gian: </strong>
                    {formatDateTime(modalResultDetail?.vaccination?.date)}
                  </Col>
                  <Col>
                    <strong>Địa điểm: </strong>
                    {modalResultDetail?.vaccination?.location}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Mô tả: </strong>
                    {modalResultDetail?.vaccination?.description}
                  </Col>
                  <Col>
                    <strong>Trạng thái: </strong>
                    {modalResultDetail?.vaccination?.status}
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setModalDetail({ ...modalDetail, status: true });
                setModalResultDetail({ ...modalResultDetail, status: false });
              }}
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default NotificationsManagement;
