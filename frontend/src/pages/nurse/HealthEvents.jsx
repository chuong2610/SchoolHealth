import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  Badge,
} from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormatter";
import {
  getMedicalEventDetail,
  getMedicalEvents,
  getMedicalSupply,
  postMedicalEvent,
} from "../../api/nurse/healthEventsApi";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSearch, FaPlus, FaEye, FaTrash, FaEdit, FaMedkit, FaUserGraduate, FaMapMarkerAlt, FaUserNurse, FaCheckCircle, FaStickyNote, FaList } from 'react-icons/fa';
import "../../styles/nurse-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faStethoscope, faUser, faClipboardList, faMapMarkedAlt, faUserNurse, faMapMarkerAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const medicalEventSupplys = {
  medicalSupplyId: "",
  quantity: 1,
};

const HealthEvents = () => {
  const formRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(false);
  const [modalEventDetail, setModalEventDetail] = useState({});
  const [modalAdd, setModalAdd] = useState(false);
  const [medicalSupplies, setMedicalSupplies] = useState([
    {
      medicalSupplyId: "",
      quantity: 1,
    },
  ]); // khi mo modalAdd se goi api load danh sach thuoc trong kho
  const [formAdd, setFormAdd] = useState({
    name: "",
    location: "",
    description: "",
    note: "",
    studentId: "",
    itemNeeded: [],
  });

  const [search, setSearch] = useState("");
  const [validated, setValidated] = useState(false);

  const eventFiltered = events.filter(
    (e) =>
      e.eventType?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      e.nurseName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangeSelect = (idx, value) => {
    const updateItemNeeded = [...formAdd.itemNeeded];
    updateItemNeeded[idx] = {
      quantity: 1,
      medicalSupplyId: value,
    };
    setFormAdd((prev) => ({
      ...prev,
      itemNeeded: updateItemNeeded,
    }));
  };

  const handleChangeQuantity = (idx, value) => {
    const updateItemNeeded = [...formAdd.itemNeeded];
    const selectedSupply = updateItemNeeded[idx];

    // If empty string, temporarily update
    if (value === "") {
      updateItemNeeded[idx] = {
        ...selectedSupply,
        quantity: "", // Keep empty for user input
      };
    } else {
      const maxQuantity =
        medicalSupplies.find(
          (m) => String(m.id) === String(selectedSupply.medicalSupplyId)
        )?.quantity || 1;

      updateItemNeeded[idx] = {
        ...selectedSupply,
        quantity: Math.min(Math.max(1, value), maxQuantity),
      };
    }

    setFormAdd((prev) => ({
      ...prev,
      itemNeeded: updateItemNeeded,
    }));
  };

  const handleRemoveSupply = (idx) => {
    const updateItemNeeded = [...formAdd.itemNeeded].filter(
      (_, i) => i !== idx
    );
    setFormAdd({ ...formAdd, itemNeeded: updateItemNeeded });
  };

  const handleAddSupply = () => {
    const updateItemNeeded = [...formAdd.itemNeeded, medicalEventSupplys];
    setFormAdd({ ...formAdd, itemNeeded: updateItemNeeded });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const data = {
      eventType: formAdd.name,
      location: formAdd.location,
      description: formAdd.description,
      date: new Date().toISOString(),
      medicalEventSupplys: formAdd.itemNeeded,
      studentNumber: formAdd.studentId,
      nurseId: localStorage.userId,
    };
    console.log(data);

    try {
      const res = await postMedicalEvent(data);
      toast.success("Thêm sự kiện thành công");
      setModalAdd(false);
      resetFormAdd();
      const updatedEvents = await getMedicalEvents();
      setEvents(updatedEvents);
    } catch (error) {
      toast.error("Lỗi khi thêm sự kiện");
      console.log("Loi handleSubmitForm");
    }
  };

  const resetFormAdd = () => {
    setFormAdd({
      name: "",
      location: "",
      description: "",
      note: "",
      studentId: "",
      itemNeeded: [{ medicalSupplyId: "", quantity: 1 }],
    });
  };

  const fetchMedicalSupply = async () => {
    try {
      const res = await getMedicalSupply();
      console.log(res);
      setMedicalSupplies(res);
      setModalAdd(true);
    } catch (error) {
      console.log("Loi handleSubmitForm, load danh sach MedicalSupply");
    }
  };

  const loadMedicalEventDetailModal = async (eventId) => {
    try {
      const res = await getMedicalEventDetail(eventId);
      console.log(res);
      setModalEventDetail(res);
      setModalEvent(true);
    } catch (error) {
      console.log("Loi loadMedicalEventDetailModal");
    }
  };

  useEffect(() => {
    const fetchMedicalEvents = async () => {
      try {
        const res = await getMedicalEvents();
        console.log(res);
        setEvents(res);
      } catch (error) {
        console.log("Loi fetchMedicalEvents");
      }
    };
    fetchMedicalEvents();
  }, []);

  return (
    <div className="nurse-theme health-events-container">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <FaCalendarAlt className="me-2" /> Quản lý Sự kiện Y tế
        </h1>
      </div>

      {/* Data Table */}
      <div className="health-event-card">
        <div className="card-header">
          <div className="d-sm-flex align-items-center justify-content-between">
            <h6 className="card-title">
              <FaCalendarAlt className="me-2" />
              Danh sách Sự kiện Y tế
            </h6>
            <div className="d-flex">
              <div style={{ width: "700px" }} className="input-group me-3">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Tìm kiếm..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="input-group-append">

                </div>
              </div>
              <Button variant="" style={{ width: "150px", backgroundColor: "#FFCCFF", color: "black" }} onClick={() => fetchMedicalSupply()}>
                <FaPlus className="me-2" /> Thêm Sự kiện Mới
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table className="health-events-table" id="dataTable" width="100%" cellSpacing="0">
              <thead >
                <tr style={{ textAlign: "center" }}>
                  <th>Tên sự kiện</th>
                  <th>Địa điểm</th>
                  <th>Ngày</th>
                  <th>Học sinh liên quan</th>
                  <th>Y tá phụ trách</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {eventFiltered.length > 0 ? (
                  eventFiltered.map((event) => (
                    <tr key={event.id} style={{ textAlign: "center" }}>
                      <td>{event.eventType}</td>
                      <td>{event.location}</td>
                      <td>{formatDateTime(event.date)}</td>
                      <td>{event.studentName}</td>
                      <td>{event.nurseName}</td>
                      <td>
                        <Button
                          className="event-action-btn view me-1"
                          onClick={() => loadMedicalEventDetailModal(event.id)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">Không có sự kiện nào</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail Event Modal */}
      
        <Modal
          show={modalEvent}
          onHide={() => setModalEvent(false)}
          dialogClassName="nurse-theme event-details-modal"
          
        >
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết Sự kiện Y tế</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="event-detail-content">
              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Ngày
                </div>
                <div className="detail-value">
                  {formatDateTime(modalEventDetail.date)}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faStethoscope} />
                  Loại sự kiện
                </div>
                <div className="detail-value">
                  {modalEventDetail.eventType}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faUser} />
                  Học sinh
                </div>
                <div className="detail-value">
                  {modalEventDetail.studentName}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Địa điểm
                </div>
                <div className="detail-value">
                  {modalEventDetail.location}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faUserNurse} />
                  Y tá phụ trách
                </div>
                <div className="detail-value">
                  {modalEventDetail.nurseName}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Trạng thái
                </div>
                <div className="detail-value status-badge">
                  Đã hoàn thành
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faClipboardList} />
                  Mô tả
                </div>
                <div className="detail-value">
                  {modalEventDetail.description}
                </div>
              </div>

              {modalEventDetail.medicalEventSupplys && modalEventDetail.medicalEventSupplys.length > 0 && (
                <div className="detail-group">
                  <div className="detail-label">
                    <FontAwesomeIcon icon={faMedkit} />
                    Vật tư y tế
                  </div>
                  <div className="supplies-list">
                    {modalEventDetail.medicalEventSupplys.map((supply, index) => (
                      <div key={index} className="supply-item">
                        <span className="supply-name">{supply.medicalSupplyName}</span>
                        <span className="supply-quantity">{supply.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setModalEvent(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      

      {/* Add New Event Modal */}
      <Modal show={modalAdd} onHide={() => setModalAdd(false)} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", marginLeft: "100px", fontSize: "20px" }}>Thêm Sự kiện Y tế Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmitForm}>
            <Form.Group className="mb-3" controlId="eventType">
              <Form.Label>Tên sự kiện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sự kiện"
                value={formAdd.name}
                onChange={(e) => setFormAdd({ ...formAdd, name: e.target.value })}
                required
              />
              <Form.Control.Feedback type="invalid">Vui lòng nhập tên sự kiện.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventLocation">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa điểm"
                value={formAdd.location}
                onChange={(e) => setFormAdd({ ...formAdd, location: e.target.value })}
                required
              />
              <Form.Control.Feedback type="invalid">Vui lòng nhập địa điểm.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="studentId">
              <Form.Label>Mã học sinh liên quan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã học sinh (nếu có)"
                value={formAdd.studentId}
                onChange={(e) => setFormAdd({ ...formAdd, studentId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventDescription">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả chi tiết sự kiện"
                value={formAdd.description}
                onChange={(e) => setFormAdd({ ...formAdd, description: e.target.value })}
                required
              />
              <Form.Control.Feedback type="invalid">Vui lòng nhập mô tả.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vật tư y tế đã sử dụng</Form.Label>
              {formAdd.itemNeeded.map((item, idx) => (
                <Row key={idx} className="mb-2">
                  <Col>
                    <Form.Select
                      value={item.medicalSupplyId}
                      onChange={(e) => handleChangeSelect(idx, e.target.value)}
                      required
                    >
                      <option value="">Chọn vật tư...</option>
                      {medicalSupplies.map((supply) => (
                        <option key={supply.id} value={supply.id}>
                          {supply.name} (còn: {supply.quantity})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Vui lòng chọn vật tư.</Form.Control.Feedback>
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="number"
                      placeholder="Số lượng"
                      value={item.quantity}
                      onChange={(e) => handleChangeQuantity(idx, e.target.value)}
                      min="1"
                      required
                    />
                    <Form.Control.Feedback type="invalid">Vui lòng nhập số lượng hợp lệ.</Form.Control.Feedback>
                  </Col>
                  <Col xs={1}>
                    <Button variant="danger" onClick={() => handleRemoveSupply(idx)}>
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={handleAddSupply} className="mt-2">
                Thêm vật tư
              </Button>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalAdd(false)}>Hủy</Button>
              <Button variant="primary" type="submit">Lưu sự kiện</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const EventDetailsModal = ({ event, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} className="event-details-modal nurse-theme" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Sự kiện Y tế</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="event-detail-content">
          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Ngày
            </div>
            <div className="detail-value">
              {new Date(event.date).toLocaleDateString('vi-VN')}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faStethoscope} />
              Loại sự kiện
            </div>
            <div className="detail-value">
              {event.eventType}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faUser} />
              Học sinh
            </div>
            <div className="detail-value">
              {event.studentName}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Địa điểm
            </div>
            <div className="detail-value">
              {event.location}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faUserNurse} />
              Y tá phụ trách
            </div>
            <div className="detail-value">
              {event.nurseName}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faCheckCircle} />
              Trạng thái
            </div>
            <div className="detail-value status-badge">
              {event.status}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">
              <FontAwesomeIcon icon={faClipboardList} />
              Mô tả
            </div>
            <div className="detail-value">
              {event.description}
            </div>
          </div>

          {event.supplies && event.supplies.length > 0 && (
            <div className="detail-group">
              <div className="detail-label">
                <FontAwesomeIcon icon={faMedkit} />
                Vật tư y tế
              </div>
              <div className="supplies-list">
                {event.supplies.map((supply, index) => (
                  <div key={index} className="supply-item">
                    <span className="supply-name">{supply.name}</span>
                    <span className="supply-quantity">{supply.quantity} {supply.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HealthEvents;
