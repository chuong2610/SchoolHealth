import { useEffect, useRef, useState } from "react";
import {
  Button,
  CloseButton,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  Toast,
} from "react-bootstrap";
import {
  formatDateTime,
  formatDDMMYYYY,
  formatTime,
} from "../../utils/dateFormatter";
import { exportExcelFile, importExcelFile } from "../../api/admin/excelApi";
import { toast } from "react-toastify";
import { getNotificationDetail } from "../../api/admin/notificationDetail";
import PaginationBar from "../../components/common/PaginationBar";
import { usePagination } from "../../hooks/usePagination";
import {
  getHealthCheckResultDeltail,
  getVaccinationResultDeltail,
} from "../../api/admin/notificationResultDetail";

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
  const [modalAdd, setModalAdd] = useState({
    status: false,
    notification: {
      classId: [],
      location: "",
      type: "",
      name: "",
      title: "",
      date: "",
      message: "",
      note: "",
    },
  });
  const [modalDetail, setModalDetail] = useState({
    status: false,
    notificationDetail: {
      // id: 1,
      // title: "Health Check Reminder",
      // name: "haha",
      // message: "Annual health check scheduled",
      // note: "Please confirm attendance",
      // createdAt: "2025-06-01T07:00:00",
      // // type: "HealthCheck",
      // type: "Vaccination",
      // location: "School Clinic",
      // date: "2025-06-10T10:00:00",
      // className: "Grade 5A",
      // nurseName: "",
      // nurseId: 3,
      // // results: [{ ...resultDefault }],
      // results: [
      //   {
      //     id: 5,
      //     height: 167,
      //     weight: 68,
      //     bmi: 30,
      //     conclusion: "khong",
      //     nurseName: "Nguyen Van A",
      //     studentName: "Sarah Student",
      //     date: "2025-06-10",
      //   },
      // ],
    },
  });
  const [modalResultDetail, setModalResultDetail] = useState({
    status: false,
    healthCheck: {
      // studentName: "Sarah Student",
      // height: 167,
      // weight: 68,
      // visionLeft: 10,
      // visionRight: 10,
      // bmi: 30,
      // bloodPressure: "89",
      // heartRate: "89",
      // location: "",
      // description: "hehe",
      // conclusion: "khong",
      // date: "2025-06-10T10:00:00",
      // nurseName: "Nguyen Van A",
    },
    vaccination: {},
  });
  const [datetime, setDatetime] = useState();
  const [importFile, setImportFile] = useState();
  const fileInputRef = useRef(null);
  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(modalDetail?.notificationDetail?.results);

  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // điều chỉnh theo timezone
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  const handleClickImport = () => {
    // Khi bấm button, kích hoạt click trên input file ẩn
    fileInputRef.current.click();
  };

  const handleImport = async (e) => {
    const notificationId = 1;
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

  const handleExport = async () => {
    const notificationId = 2;
    try {
      await exportExcelFile(notificationId);
      // toast.success("Lấy tệp mẫu thành công");
    } catch (error) {
      console.log("Loi handleExport");
      toast.error("Lấy tệp mẫu thất bại");
    }
  };

  const fetchNotificationDetail = async () => {
    const notificationId = 2;
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

  const fetchHealthCheckResultDetail = async () => {
    const healthCheckId = 5;
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

  const fetchVaccinationResultDetail = async () => {
    const vaccinationId = 1;
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

  return (
    <div>
      <Container className="mt-3">
        <Row className="d-flex">
          <Col md={9} className="text-start">
            <h2>Quản lý thông báo</h2>
          </Col>
          <Col className="text-end align-item-center">
            <Button
              variant="success"
              onClick={() => setModalAdd({ ...modalAdd, status: true })}
            >
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
                      onClick={() =>
                        // setModalDetail({ ...modalDetail, status: true })
                        fetchNotificationDetail()
                      }
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
          <Modal
            size="lg"
            show={modalAdd.status}
            onHide={() => setModalAdd({ ...modalAdd, status: false })}
          >
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
              <Button
                variant="secondary"
                onClick={() => setModalAdd({ ...modalAdd, status: false })}
              >
                Đóng
              </Button>
              <Button variant="success" className="px-4">
                Tạo
              </Button>
            </Modal.Footer>
          </Modal>
        )}

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
                <Table
                  hover
                  responsive
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
                    {currentItems?.map((result, idx) => (
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
                            onClick={() => fetchHealthCheckResultDetail()}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {modalDetail?.notificationDetail?.type === "Vaccination" && (
                <Table
                  hover
                  responsive
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
                    {currentItems?.map((result, idx) => (
                      <tr key={idx}>
                        <td>{result.studentName}</td>
                        <td>{result.vaccineName}</td>
                        <td>{result.location}</td>
                        <td>{formatDDMMYYYY(result.date)}</td>
                        <td>{result.nurseName}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            onClick={() => fetchVaccinationResultDetail()}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Row className="w-100">
                <Col className="text-start">
                  <Button variant="info" onClick={() => handleClickImport()}>
                    <i className="fa-solid fa-upload"></i> Thêm tệp kết quả
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx"
                    ref={fileInputRef}
                    onChange={(e) => handleImport(e)}
                    style={{ display: "none" }} // Ẩn input file
                  />

                  <Button
                    variant="success"
                    className="px-3 ms-2"
                    onClick={() => handleExport()}
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
      </Container>
    </div>
  );
};

export default NotificationsManagement;
