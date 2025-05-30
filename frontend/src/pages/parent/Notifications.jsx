import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Nav,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import { getNotifications } from "../../api/parent/notificationApi";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

const notificationsData = [
  {
    id: 1,
    type: "vaccination",
    title: "Thông báo tiêm chủng",
    date: "15/03/2024",
    icon: "fas fa-syringe",
    badge: "Tiêm chủng",
    badgeClass: "bg-primary",
    content: [
      "Kính gửi Quý phụ huynh,",
      "Nhà trường thông báo lịch tiêm chủng vắc-xin phòng COVID-19 cho học sinh vào ngày 20/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
    ],
    modal: {
      title: "Chi tiết thông báo tiêm chủng",
      info: [
        {
          icon: "fas fa-calendar",
          label: "Ngày",
          value: "20/03/2024",
          type: "date",
        },
        {
          icon: "fas fa-clock",
          label: "Thời gian",
          value: "8:00 - 11:00",
          type: "time",
        },
        {
          icon: "fas fa-map-marker-alt",
          label: "Địa điểm",
          value: "Phòng Y tế trường học",
          type: "address",
        },
        {
          icon: "fas fa-syringe",
          label: "Loại vắc-xin",
          value: "Pfizer-BioNTech",
          type: "hospital",
        },
      ],
      notes: [
        "Học sinh cần ăn sáng đầy đủ trước khi tiêm",
        "Mang theo sổ khám bệnh và giấy tờ tùy thân",
        "Phụ huynh cần ký xác nhận đồng ý tiêm chủng",
        "Theo dõi sức khỏe sau tiêm 30 phút tại trường",
      ],
      consentLabel: "Tôi đồng ý cho con tôi tham gia tiêm chủng",
      confirmBtn: { class: "btn-primary", label: "Xác nhận tham gia" },
    },
  },
  {
    id: 2,
    type: "checkup",
    title: "Thông báo khám sức khỏe",
    date: "10/03/2024",
    icon: "fas fa-stethoscope",
    badge: "Khám sức khỏe",
    badgeClass: "bg-success",
    content: [
      "Kính gửi Quý phụ huynh,",
      "Nhà trường tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
    ],
    modal: {
      title: "Chi tiết thông báo khám sức khỏe",
      info: [
        { icon: "fas fa-calendar", label: "Ngày", value: "25/03/2024" },
        { icon: "fas fa-clock", label: "Thời gian", value: "8:00 - 16:00" },
        {
          icon: "fas fa-map-marker-alt",
          label: "Địa điểm",
          value: "Phòng Y tế trường học",
        },
        {
          icon: "fas fa-user-md",
          label: "Đơn vị khám",
          value: "Bệnh viện Nhi đồng",
        },
      ],
      notes: [
        "Khám tổng quát",
        "Đo chiều cao, cân nặng",
        "Kiểm tra thị lực",
        "Khám răng miệng",
        "Khám tai mũi họng",
      ],
      consentLabel: "Tôi đồng ý cho con tôi tham gia khám sức khỏe",
      confirmBtn: { class: "btn-success", label: "Xác nhận tham gia" },
    },
  },
];

const icons = [
  {
    type: "vaccination",
    icon: "fas fa-syringe",
  },
  {
    type: "checkup",
    icon: "fas fa-stethoscope",
  },
  {
    type: "date",
    icon: "fas fa-calendar",
  },
  {
    type: "time",
    icon: "fas fa-clock",
  },
  {
    type: "address",
    icon: "fas fa-map-marker-alt",
  },
  {
    type: "hospital",
    icon: "fas fa-user-md",
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
    key: "vaccination",
    label: (
      <>
        <i className="fas fa-syringe me-2"></i>Tiêm chủng
      </>
    ),
  },
  {
    key: "checkup",
    label: (
      <>
        <i className="fas fa-stethoscope me-2"></i>Khám sức khỏe
      </>
    ),
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal] = useState({
    show: false,
    notification: null,
    consent: false,
  });

  const openModal = (notification) => {
    setModal({
      show: true,
      notification: notification,
      consent: false,
    });
  };

  const closeModal = () => setModal({ ...modal, show: false });

  const filteredNotifications =
    activeTab === "all"
      ? notificationsData
      : notificationsData.filter(
          (notification) => notification.type === activeTab
        );

  const handleSubmitConsent = async (consent) => {
    const data = {
      notificationId: modal.notification.id,
      consent: consent,
    };
    const data2 = {
      name: "Vitamin Cbv",
      description: "Tăng sức đề kháng",
      image: "https://via.placeholder.com/150",
      price: 15000,
      quantity: 10,
    };

    try {
      const res = await sendConsentApi(data2);
      if (data.consent) toast.success("Bạn đã đồng ý tham gia.");
      else toast.error("Bạn đã từ chối tham gia.");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!!!");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/Notification/parent/3");

        // const res = await axios.get(
        //   "http://localhost:5182/api/Notification/parent/3",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`, // Nếu bạn có token
        //     },
        //     withCredentials: true, // Nếu backend yêu cầu cookie, có thể bỏ nếu không dùng
        //   }
        // );
        console.log(res.data);
        return res;
      } catch (error) {
        console.log("Loi fetchNotifications");
      }
    };
    const data = fetchNotifications();
  }, []);

  return (
    <div
      style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px 0" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col>
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">Thong bao</h1>
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
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className="mb-4">
                  <Row>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={1}>
                          <div
                            className={`notification-icon ${notification.badgeClass}`}
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
                          <Card.Text>{notification.date}</Card.Text>
                        </Col>
                      </Row>
                      <>
                        {notification.content.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </>
                      <Row>
                        <Col>
                          <Badge className={notification.badgeClass}>
                            {notification.badge}
                          </Badge>
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Button
                            className={`${notification.badgeClass} d-flex align-items-center justify-content-center`}
                            style={{ height: "30px" }}
                            onClick={() => openModal(notification)}
                          >
                            Xem chi tiết
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
                  <h5>{modal.notification?.modal.title}</h5>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <h6>Thong tin:</h6>
                {modal.notification?.modal.info.map((info, i) => (
                  <Row key={i}>
                    <Col md={1}>
                      <i
                        className={
                          icons.find((icon) => icon.type === info.type)?.icon
                        }
                      ></i>
                    </Col>
                    <Col>
                      {info.label}: {info.value}
                    </Col>
                  </Row>
                ))}

                <h6 className="mt-4">
                  {modal.notification?.type === "vaccination"
                    ? "Luu y quan trong:"
                    : "Noi dung kham:"}
                </h6>

                <ul>
                  {modal.notification?.modal.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>

                <div className="form-check">
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
                  <label htmlFor="consentCheckbox" className="form-check-label">
                    {modal.notification?.modal.consentLabel}
                  </label>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Dong
                </Button>
                <Button
                  variant="danger"
                  disabled={modal.consent}
                  onClick={() => {
                    closeModal();
                    handleSubmitConsent(false);
                  }}
                >
                  Khong tham gia
                </Button>
                <Button
                  disabled={!modal.consent}
                  className={modal.notification?.badgeClass}
                  onClick={() => {
                    closeModal();
                    handleSubmitConsent(true);
                  }}
                >
                  Xac nhan tham gia
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
