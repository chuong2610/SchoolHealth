import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Nav,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import {
  getNotificationDetailById,
  getNotifications,
} from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";

// const notificationsData = [
//   {
//     id: 1,
//     type: "vaccination",
//     title: "Thông báo tiêm chủng",
//     date: "15/03/2024",
//     icon: "fas fa-syringe",
//     badge: "Tiêm chủng",
//     badgeClass: "bg-primary",
//     content: [
//       "Kính gửi Quý phụ huynh,",
//       "Nhà trường thông báo lịch tiêm chủng vắc-xin phòng COVID-19 cho học sinh vào ngày 20/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
//     ],
//     modal: {
//       title: "Chi tiết thông báo tiêm chủng",
//       info: [
//         {
//           icon: "fas fa-calendar",
//           label: "Ngày",
//           value: "20/03/2024",
//           type: "date",
//         },
//         {
//           icon: "fas fa-clock",
//           label: "Thời gian",
//           value: "8:00 - 11:00",
//           type: "time",
//         },
//         {
//           icon: "fas fa-map-marker-alt",
//           label: "Địa điểm",
//           value: "Phòng Y tế trường học",
//           type: "address",
//         },
//         {
//           icon: "fas fa-syringe",
//           label: "Loại vắc-xin",
//           value: "Pfizer-BioNTech",
//           type: "hospital",
//         },
//       ],
//       notes: [
//         "Học sinh cần ăn sáng đầy đủ trước khi tiêm",
//         "Mang theo sổ khám bệnh và giấy tờ tùy thân",
//         "Phụ huynh cần ký xác nhận đồng ý tiêm chủng",
//         "Theo dõi sức khỏe sau tiêm 30 phút tại trường",
//       ],
//       consentLabel: "Tôi đồng ý cho con tôi tham gia tiêm chủng",
//       confirmBtn: { class: "btn-primary", label: "Xác nhận tham gia" },
//     },
//   },
//   {
//     id: 2,
//     type: "checkup",
//     title: "Thông báo khám sức khỏe",
//     date: "10/03/2024",
//     icon: "fas fa-stethoscope",
//     badge: "Khám sức khỏe",
//     badgeClass: "bg-success",
//     content: [
//       "Kính gửi Quý phụ huynh,",
//       "Nhà trường tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
//     ],
//     modal: {
//       title: "Chi tiết thông báo khám sức khỏe",
//       info: [
//         { icon: "fas fa-calendar", label: "Ngày", value: "25/03/2024" },
//         { icon: "fas fa-clock", label: "Thời gian", value: "8:00 - 16:00" },
//         {
//           icon: "fas fa-map-marker-alt",
//           label: "Địa điểm",
//           value: "Phòng Y tế trường học",
//         },
//         {
//           icon: "fas fa-user-md",
//           label: "Đơn vị khám",
//           value: "Bệnh viện Nhi đồng",
//         },
//       ],
//       notes: [
//         "Khám tổng quát",
//         "Đo chiều cao, cân nặng",
//         "Kiểm tra thị lực",
//         "Khám răng miệng",
//         "Khám tai mũi họng",
//       ],
//       consentLabel: "Tôi đồng ý cho con tôi tham gia khám sức khỏe",
//       confirmBtn: { class: "btn-success", label: "Xác nhận tham gia" },
//     },
//   },
// ];

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

const tabList = [
  {
    key: "all",
    label: (
      <>
        <i className="fas fa-bell me-2"></i>Tất cả
      </>
    ),
  },
  {
    key: "Vaccination",
    label: (
      <>
        <i className="fas fa-syringe me-2"></i>Tiêm chủng
      </>
    ),
  },
  {
    key: "HealthCheck",
    label: (
      <>
        <i className="fas fa-stethoscope me-2"></i>Khám sức khỏe
      </>
    ),
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    notification: null,
    consent: false,
  });
  const [reason, setReason] = useState("");

  const fetchModal = async (data) => {
    try {
      const res = await getNotificationDetailById(data);
      return res;
    } catch (error) {
      console.log("Loi fetchModal");
    }
  };

  const openModal = async (notificationId, studentId) => {
    const data = { notificationId, studentId };
    const detail = await fetchModal(data);

    
    const vaccinationName = notifications.find((n) => n.id === notificationId)?.name || null;
    
    console.log({...detail, vaccinationName});
    setModal({
      show: true,
      notification: {...detail, vaccinationName},
      consent: false,
    });
  };

  const closeModal = () => setModal({ ...modal, show: false });

  const filteredNotifications =
    activeTab === "all"
      ? [...notifications]
      : [...notifications].filter((notification) => notification.type === activeTab);

  const handleSubmitConsent = async (consent, status, reason) => {
    const data = {
      notificationId: modal.notification.id,
      studentId: modal.notification.studentId,
      status: status,
      reason,
    };

    console.log(data);
    try {
      const res = await sendConsentApi(data);
      if (consent) toast.success("Bạn đã đồng ý tham gia.");
      else toast.error("Bạn đã từ chối tham gia.");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!!!");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        // sap xep date tu gan den xa
        const sortedNotifications = res.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
        // console.log(sortedNotifications)
      } catch (error) {
        console.log("Loi fetchNotifications");
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);
  return (
    <div
      style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px 0" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">Thông báo</h1>
              </Col>
            </Row>

            <Row>
              <Nav
                variant="pills"
                className="justify-content-center mb-4"
                activeKey={activeTab}
                onSelect={(eventKey) => setActiveTab(eventKey)}
              >
                {tabList.map((tab) => {
                  return (
                    <Nav.Item key={tab.key}>
                      <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Row>

            {/* List Notifications */}
            <Row>
              {filteredNotifications?.map((notification, idx) => (
                <Card key={idx} className="mb-4">
                  <Row>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={1}>
                          <div
                            className={`notification-icon ${
                              icons.find(
                                (icon) => icon.type === notification.type
                              )?.badgeClass
                            }`}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 24,
                            }}
                          >
                            <i
                              className={
                                icons.find(
                                  (icon) => icon.type === notification.type
                                )?.icon
                              }
                            ></i>
                          </div>
                        </Col>
                        <Col>
                          <Card.Title>{notification.title}</Card.Title>
                          <Card.Text>{formatDateTime(notification.createdAt)}</Card.Text>
                        </Col>
                      </Row>
                      {/* <>
                        {notification.description?.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </> */}
                      <Row>
                        <p>{notification.message}</p>
                      </Row>

                      <Row>
                        <Col>
                          <Badge
                            className={
                              icons.find(
                                (icon) => icon.type === notification.type
                              )?.badgeClass
                            }
                          >
                            {notification.type === "Vaccination" ? "Tiêm chủng" : "Khám sức khỏe"}
                          </Badge>
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Button
                            className={`d-flex align-items-center justify-content-center`}
                            style={{ height: "30px" }}
                            onClick={() =>
                              openModal(notification.id, notification.studentId)
                            }
                          >
                            Chi tiết
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Row>
                </Card>
              ))}
            </Row>

            {/* Modal */}

            <Modal
              show={modal.show}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={() => setModal({ ...modal, show: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <h5>{modal.notification?.title}</h5>
                </Modal.Title>
              </Modal.Header>

              {!modal.notification ? (
                <Modal.Body>
                  <div className="text-center">Loading...</div>
                </Modal.Body>
              ) : (
                <Modal.Body>
                  <h6>Thông tin:</h6>
                  {/* {modal.notification?.info.map((info, i) => (
                        <Row key={i}>
                          <Col md={1}>
                            <i
                              className={
                                icons.find((icon) => icon.type === info.type)
                                  ?.icon
                              }
                            ></i>
                          </Col>
                          <Col>
                            {info.label}: {info.value}
                          </Col>
                        </Row>
                      ))} */}
                  {/* <p>{modal.notification.message}</p> */}

                  {/* Render thong tin detail */}
                  <Row>
                    <Col md={1}>
                      <i
                        className={
                          icons.find((icon) => icon.type === "date")?.icon
                        }
                      ></i>
                    </Col>
                    <Col>
                      Ngày:{" "}
                      {new Date(modal.notification?.date).toLocaleDateString(
                        "en-US"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={1}>
                      <i
                        className={
                          icons.find((icon) => icon.type === "time")?.icon
                        }
                      ></i>
                    </Col>
                    <Col>
                      Thời gian:{" "}
                      {new Date(modal.notification?.date).toLocaleTimeString()}
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
                    <Col>Địa điểm: {modal.notification?.location}</Col>
                  </Row>
                  {modal.notification?.type === "Vaccination" && (
                    <Row>
                      <Col md={1}>
                        <i
                          className={
                            icons.find((icon) => icon.type === "hospital")?.icon
                          }
                        ></i>
                      </Col>
                      <Col>Vắc-xin:  {modal.notification?.vaccinationName} </Col>
                    </Row>
                  )}

                  <h6 className="mt-4">
                    {/* {modal.notification?.type === "Vaccination"
                      ? "Luu y quan trong:"
                      : "Noi dung kham:"} */}
                    Ghi chú:
                  </h6>

                  <ul>
                    {/* {modal.notification?.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))} */}
                    <li>{modal.notification.note}</li>
                  </ul>

                  {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          id="consentCheckbox"
                          type="checkbox"
                          checked={modal.consent}
                          onChange={(e) =>
                            setModal((modal) => ({
                              ...modal,
                              consent: e.target.checked,
                            }))
                          }
                        ></input>
                        <label
                          htmlFor="consentCheckbox"
                          className="form-check-label"
                        >
                          {modal.notification?.consentLabel}
                        </label>
                      </div> */}

                  {/* Them o input lí do từ chối */}
                  <Row>
                    <h6>Lý do từ chối:</h6>
                    <Row>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Điền lý do nếu từ chối"
                        />
                      </InputGroup>
                    </Row>
                  </Row>

                  {/* Neu xac nhan or tu choi truoc do thi hien thi thong bao nay */}
                  {modal.notification?.status !== "Pending" && (
                    <Row>
                      <label
                        className={
                          modal.notification?.status === "Confirmed"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {modal.notification?.status === "Confirmed"
                          ? "Thông báo trước đã được xác nhận"
                          : "Thông báo trước đã bị từ chối"}
                      </label>
                    </Row>
                  )}
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Đóng
                </Button>
                <Button
                  variant="danger"
                  disabled={modal.notification?.status === "Pending" ? false : true}
                  onClick={() => {
                    closeModal();
                    handleSubmitConsent(false, "Rejected", reason);
                  }}
                >
                  Từ chối
                </Button>
                <Button
                  // disabled={!modal.consent}
                  className={modal.notification?.badgeClass}
                  disabled={modal.notification?.status === "Pending" ? false : true}
                  onClick={() => {
                    closeModal();
                    handleSubmitConsent(true, "Confirmed");
                  }}
                >
                  Đồng ý
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
