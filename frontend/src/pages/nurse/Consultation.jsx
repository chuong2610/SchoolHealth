import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import { getClassList } from "../../api/admin/notification";
import {
  getConsultationById,
  getConsultations,
  getStudentsByClassId,
  postConsultation,
} from "../../api/nurse/ConsultationApi";
import { formatDateTime } from "../../utils/dateFormatter";
import { toast } from "react-toastify";
import "../../styles/nurse/consultation.css";
import PaginationBar from "../../components/common/PaginationBar";

export default function Consultation() {
  const nurseId = localStorage.userId;
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [form, setForm] = useState({
    nurseId: nurseId,
    studentNumber: "",
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [validated, setValidated] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [appointment, setAppointment] = useState({});
  const [modal, setModal] = useState(false);

  const fetchClassList = async () => {
    try {
      const res = await getClassList();
      if (res) {
        setClassList(res);
      } else {
        setClassList([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchClassList();
  }, []);

  const fetchStudentList = async () => {
    try {
      const res = await getStudentsByClassId(selectedClass);
      if (res) {
        setStudentList(res.items);
      } else {
        setStudentList([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentList();
    }
  }, [selectedClass]);

  const fetchConsultations = async () => {
    try {
      // const searchDate = filterDate ? `${filterDate}T00:00:00` : null;
      const res = await getConsultations(
        nurseId,
        pageSize,
        currentPage,
        search
        // searchDate
      );
      if (res) {
        setAppointments(res.items);
        if (res.totalPages) setTotalPages(res.totalPages);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [nurseId, currentPage, search, filterDate]);

  const fetchConsultationDetail = async (consultationAppointmentId) => {
    try {
      const res = await getConsultationById(consultationAppointmentId);
      if (res) {
        setAppointment(res);
      } else {
        setAppointment({});
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;

    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const res = await postConsultation(form);
      if (res === true) {
        toast.success("Tạo lịch tư vấn thành công.");
        fetchConsultations();
      } else {
        toast.error("Tạo lịch tư vấn thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo lịch.");
      throw error;
    }

    setForm({
      nurseId: nurseId,
      studentNumber: "",
      date: "",
      location: "",
      description: "",
      title: "",
    });
    // setSelectedClass(null);
    setValidated(false); // reset form validation
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset); // để khớp múi giờ local
    return now.toISOString().slice(0, 16); // cắt bỏ phần giây và "Z"
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 nurse-title">Đặt lịch tư vấn</h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="mb-4"
      >
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group controlId="classId">
              <Form.Label className="nurse-form-label">Lớp</Form.Label>
              <Form.Select
                className="nurse-form-control"
                required
                name="classId"
                value={selectedClass || ""}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- Chọn lớp --</option>
                {classList.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn lớp.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="studentNumber">
              <Form.Label className="nurse-form-label">
                Chọn học sinh
              </Form.Label>
              <Form.Select
                className="nurse-form-control"
                disabled={!selectedClass}
                required
                name="studentNumber"
                value={form.studentNumber}
                onChange={handleChange}
              >
                {!selectedClass ? (
                  <option value="">-- Vui lòng chọn lớp --</option>
                ) : (
                  <option value="">-- Chọn học sinh --</option>
                )}
                {studentList?.map((s) => (
                  <option key={s.id} value={s.studentNumber}>
                    {s.studentName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn học sinh.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="date">
              <Form.Label className="nurse-form-label">Thời gian</Form.Label>
              <Form.Control
                className="nurse-form-control"
                required
                type="datetime-local"
                name="date"
                min={getCurrentDateTimeLocal()}
                value={form.date}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn thời gian hợp lệ.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="location">
              <Form.Label className="nurse-form-label">Địa điểm</Form.Label>
              <Form.Control
                className="nurse-form-control"
                required
                type="text"
                name="location"
                placeholder="Nhập địa điểm"
                value={form.location}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập địa điểm.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="title">
              <Form.Label className="nurse-form-label">Tiêu đề</Form.Label>
              <Form.Control
                className="nurse-form-control"
                required
                type="text"
                name="title"
                placeholder="Nhập tiêu đề tư vấn"
                value={form.title}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập tiêu đề tư vấn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="description">
              <Form.Label className="nurse-form-label">Nội dung</Form.Label>
              <Form.Control
                className="nurse-form-control"
                required
                type="text"
                name="description"
                placeholder="Nhập nội dung tư vấn"
                value={form.description}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập nội dung tư vấn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" className="nurse-btn-primary">
          Đặt lịch
        </Button>
      </Form>

      <h4 className="mb-3 nurse-title">Danh sách lịch đã đặt</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            className="nurse-form-control"
            type="text"
            placeholder="Tìm kiếm theo tên học sinh hoặc y tá..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        {/* <Col md={6}>
          <Form.Control
            className="nurse-form-control"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Col> */}
      </Row>
      {console.log("app", appointment)}
      <Table striped bordered hover responsive className="nurse-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Học sinh</th>
            <th>Y tá</th>
            <th>Thời gian</th>
            <th>Địa điểm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Không có cuộc hẹn nào được tìm thấy.
              </td>
            </tr>
          ) : (
            appointments.map((a, idx) => (
              <tr key={a.consultationAppointmentId}>
                <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                <td>{a.studentName}</td>
                <td>{a.nurseName}</td>
                <td>{formatDateTime(a.date)}</td>
                <td>{a.location}</td>
                <td>
                  {a.status === "Pending"
                    ? "Chờ xác nhận"
                    : a.status === "Confirmed"
                    ? "Đã xác nhận"
                    : a.status === "Rejected"
                    ? "Đã từ chối"
                    : a.status}
                </td>
                <td className="nnm-action-cell">
                  <div className="nnm-action-btn-group">
                    <button
                      className="admin-action-btn view"
                      onClick={() => {
                        if (a.consultationAppointmentId) {
                          fetchConsultationDetail(a.consultationAppointmentId);
                          setModal(true);
                        }
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <div className="admin-pagination-wrapper">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page < 1 || page > totalPages) return;
              setCurrentPage(page);
            }}
          />
        </div>
      )}

      {/* Modal Detail */}
      <Modal size="lg" show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <h4>Chi tiết đặt lịch</h4>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <strong>Tên học sinh:</strong> {appointment?.studentName}
            </Col>
            <Col>
              <strong>Tên y tá:</strong> {appointment?.nurseName}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <strong>Tiêu đề:</strong> {appointment?.title}
            </Col>
            <Col>
              <strong>Nội dung:</strong> {appointment?.description}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <strong>Thời gian:</strong> {formatDateTime(appointment?.date)}
            </Col>
            <Col>
              <strong>Địa điểm:</strong> {appointment?.location}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <strong>Trạng thái:</strong>{" "}
              {appointment?.status === "Confirmed"
                ? "Đã xác nhận"
                : appointment?.status === "Rejected"
                ? "Đã từ chối"
                : "Chờ xác nhận"}
            </Col>
            <Col>
              {appointment?.status === "Rejected" && (
                <>
                  <strong>Lí do:</strong> {appointment?.reason}
                </>
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
