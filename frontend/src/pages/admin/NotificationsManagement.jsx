import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormatter";

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

const NotificationsManagement = () => {
  const [modalAdd, setModalAdd] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [datetime, setDatetime] = useState();

  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // điều chỉnh theo timezone
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  return (
    <div>
      <Container className="mt-3">
        <Row className="d-flex">
          <Col md={9} className="text-start">
            <h2>Quản lý thông báo</h2>
          </Col>
          <Col className="text-end align-item-center">
            <Button variant="success" onClick={() => setModalAdd(true)}>
              <i className="fa-solid fa-circle-plus"></i> Tạo thông báo mới
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              borderless
              hover
              responsive
              size="sm"
              className="justify-content-center"
            >
              <thead>
                <tr>
                  <th>Mã thông báo</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Ngày tạo</th>
                  <th>Mô tả</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Nguyễn Văn A</td>
                  <td>a@example.com</td>
                  <td>a@example.com</td>
                  <td>a@example.com</td>
                  <td>
                    <Button
                      variant="outline-info"
                      onClick={() => setModalDetail(true)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* ModalAdd */}
        {modalAdd && (
          <Modal size="lg" show={modalAdd} onHide={() => setModalAdd(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>Tạo thông báo mới</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6>Lớp</h6>
                    </Form.Label>
                    <Form.Select>
                      <option value="">--Chọn lớp--</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6>Địa điểm</h6>
                    </Form.Label>
                    <Form.Control></Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6>Loại thông báo</h6>
                    </Form.Label>
                    <Form.Select>
                      <option value="">--Chọn loại--</option>
                      <option value="Vaccination">Tiêm chủng</option>
                      <option value="HealthCheck">Kiểm tra sức khỏe</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6>Tên vắc-xin {"(Chỉ tiêm chủng)"}</h6>
                    </Form.Label>
                    <Form.Control disabled={true}></Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6>Tiêu đề</h6>
                    </Form.Label>
                    <Form.Control></Form.Control>
                  </Col>
                  <Col>
                    <Form.Label>
                      <h6>Thời gian</h6>
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={datetime}
                      min={getMinDateTime()}
                      onChange={(e) => setDatetime(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6>Mô tả</h6>
                    </Form.Label>
                    <Form.Control as="textarea" rows={3}></Form.Control>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>
                      <h6>Ghi chú</h6>
                    </Form.Label>
                    <Form.Control as="textarea" rows={3}></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary">Đóng</Button>
              <Button variant="success" className="px-4">
                Tạo
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {modalDetail && (
          <Modal
            size="lg"
            show={modalDetail}
            onHide={() => setModalDetail(false)}
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
                  Ngày:{" "}
                  {/* {new Date(modal.notification?.date).toLocaleDateString(
                    "en-US"
                  )} */}
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
                <Col>Địa điểm: </Col>
              </Row>
              {/* {modal.notification?.type === "Vaccination" && (
                <Row>
                  <Col md={1}>
                    <i
                      className={
                        icons.find((icon) => icon.type === "hospital")?.icon
                      }
                    ></i>
                  </Col>
                  <Col>Vắc-xin: {modal.notification?.vaccinationName} </Col>
                </Row>
              )} */}

              <h6 className="mt-3 mb-3">Ghi chú:</h6>

              <ul>{/* <li>{modal.notification.note}</li> */}</ul>

              {/* Render table ket qua */}
              <h6 className="mt-3">Kết quả</h6>
              <Table
                borderless
                hover
                responsive
                size="sm"
                className="justify-content-center"
              >
                <thead>
                  <tr>
                    <th>Mã thông báo</th>
                    <th>Tiêu đề</th>
                    <th>Loại</th>
                    <th>Ngày tạo</th>
                    <th>Mô tả</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>a@example.com</td>
                    <td>a@example.com</td>
                    <td>a@example.com</td>
                    <td>
                      <Button
                        variant="outline-info"
                        onClick={() => setModalDetail(true)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalDetail(false)}>Đóng</Button>
              <Button variant="success" className="px-4">
                Tạo
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default NotificationsManagement;
