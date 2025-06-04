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
} from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormatter";
import {
  getMedicalEventDetail,
  getMedicalEvents,
  getMedicalSupply,
  postMedicalEvent,
} from "../../api/nurse/healthEventsApi";
import { toast } from "react-toastify";

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

  // const handleChangeQuantity = (idx, value) => {
  //   // Nếu input rỗng (""), thì chưa xử lý
  //   // if (typeof value === "number") {
  //   //   console.log("s");
  //   //   return;
  //   // }

  //   const updateItemNeeded = [...formAdd.itemNeeded];
  //   const selectedSupply = updateItemNeeded[idx];
  //   const maxQuantity = medicalSupplies.find(
  //     (m) => m.id === selectedSupply.id
  //   )?.quantity;
  //   updateItemNeeded[idx] = {
  //     ...selectedSupply,
  //     quantity: value > maxQuantity ? maxQuantity : value < 1 ? 1 : value,
  //   };

  //   console.log(updateItemNeeded[idx]);

  //   setFormAdd((prev) => ({
  //     ...prev,
  //     itemNeeded: updateItemNeeded,
  //   }));
  // };

  // const handleChangeQuantity = (idx, value) => {
  //   const updateItemNeeded = [...formAdd.itemNeeded];
  //   const selectedSupply = updateItemNeeded[idx];

  //   const maxQuantity =
  //     medicalSupplies.find((m) => String(m.id) === String(selectedSupply.id))
  //       ?.quantity || 1;

  //   updateItemNeeded[idx] = {
  //     ...selectedSupply,
  //     quantity: Math.min(Math.max(1, Number(value)), maxQuantity),
  //   };

  //   setFormAdd((prev) => ({
  //     ...prev,
  //     itemNeeded: updateItemNeeded,
  //   }));
  // };

  const handleChangeQuantity = (idx, value) => {
    const updateItemNeeded = [...formAdd.itemNeeded];
    const selectedSupply = updateItemNeeded[idx];

    // Nếu là chuỗi rỗng, cập nhật tạm thời
    if (value === "") {
      updateItemNeeded[idx] = {
        ...selectedSupply,
        quantity: "", // giữ rỗng để user tiếp tục nhập
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

    if(!form.checkValidity()) {
      e.stopPropagation();//neu form ko hop le thi chay dong nay de dung su kien
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
      nurseId: 3,
      // nurseId: localStorage.userId
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
    // load danh sach medical supply
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
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col>
          <Row className="d-flex justify-content-between align-item-center">
            <Col className="text-start">
              <h2>Quản lý Sự kiện Y tế</h2>
            </Col>
            <Col className="text-end">
              <Button onClick={() => fetchMedicalSupply()}>
                <i className="fas fa-plus me-2"></i>Thêm Sự kiện Mới
              </Button>
            </Col>
          </Row>
          <Row></Row>
        </Col>
      </Row>

      {/* <Row className="shadow-sm border-0 rounded-4">
        <Row>
          <Col md={6}>
            <h5>Danh sách sự kiện y tế</h5>
          </Col>
          <Col md={3}></Col>
          <Col md={3}></Col>
        </Row>
      </Row> */}

      <Card className="shadow-sm border-0 rounded-3 mt-3">
        <Card.Header>
          <Row>
            <Col md={9}>
              <h4>Danh sách sự kiện y tế</h4>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tìm kiếm</Form.Label>
                <Form.Control
                  type="input"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    // console.log(search);
                  }}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table responsive className="text-center">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên sự kiện</th>
                <th>Địa điểm</th>
                <th>Thời gian</th>
                <th>Học sinh</th>
                <th>Y tá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {eventFiltered?.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.eventType}</td>
                  <td>{e.location}</td>
                  <td>{formatDateTime(e.date)}</td>
                  <td>{e.studentName}</td>
                  <td>{e.nurseName}</td>
                  <td>
                    <Button
                      variant="info"
                      className="sm me-1"
                      title="Xem chi tiết"
                      onClick={() => loadMedicalEventDetailModal(e.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {eventFiltered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Không có sự kiện nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Event */}
      {modalEvent && (
        <Modal
          show={modalEvent}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => setModalEvent(false)}
        >
          <Modal.Header closeButton>
            <h5>Chi tiết sự kiện y tế</h5>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Label>Tên sự kiện</Form.Label>
                <p>{modalEventDetail.eventType}</p>
              </Col>
              <Col>
                <Form.Label>Địa điểm</Form.Label>
                <p>{modalEventDetail.location}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Thời gian</Form.Label>
                <p>{formatDateTime(modalEventDetail.date)}</p>
              </Col>
              <Col>
                <Form.Label>Mô tả</Form.Label>
                <p>{modalEventDetail.description}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Học sinh</Form.Label>
                <p>{modalEventDetail.studentName}</p>
              </Col>
              <Col>
                <Form.Label>Y tá</Form.Label>
                <p>{modalEventDetail.nurseName}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Tên vật tư</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {modalEventDetail.supplies?.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.medicalSupplyName}</td>
                      <td>{s.quantity}</td>
                    </tr>
                  ))}
                  {modalEventDetail.supplies?.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center">
                        Không có vật tư
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalEvent(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Add Health Event */}
      {modalAdd && (
        <Modal
          show={modalAdd}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => {
            resetFormAdd();
            setModalAdd(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h5>Thêm Sự kiện Y tế Mới</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="myForm" ref={formRef} noValidate validated={validated} onSubmit={handleSubmitForm}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tên sự kiện</Form.Label>
                    <Form.Control
                      required
                      value={formAdd.name}
                      onChange={(e) =>
                        setFormAdd({ ...formAdd, name: e.target.value })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên sự kiện
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Địa điểm</Form.Label>
                    <Form.Control
                      required
                      value={formAdd.location}
                      onChange={(e) =>
                        setFormAdd({ ...formAdd, location: e.target.value })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập địa điểm
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Mã số học sinh</Form.Label>
                    <Form.Control
                      required
                      value={formAdd.studentId}
                      onChange={(e) =>
                        setFormAdd({ ...formAdd, studentId: e.target.value })
                      }
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập mã số học sinh
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formAdd.description}
                    onChange={(e) =>
                      setFormAdd({
                        ...formAdd,
                        description: e.target.value,
                      })
                    }
                    placeholder="Mô tả sự kiện..."
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Label>Tạo mẫu vật tư cần dùng</Form.Label>
              </Row>
              <Row className="justify-content-center mb-3">
                <Row className="justify-content-center">
                  {formAdd.itemNeeded.map((item, idx) => (
                    <Row
                      key={idx}
                      className="mb-4 border rounded justify-content-center p-3"
                    >
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Vật tư</Form.Label>

                          <Form.Select
                            required
                            value={item.medicalSupplyId || ""}
                            onChange={(e) =>
                              handleChangeSelect(idx, e.target.value)
                            }
                          >
                            <option value="">--Chọn vật tư--</option>
                            {medicalSupplies?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Vui lòng chọn vật tư, xóa mẫu nếu không cần
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4} className="">
                        <Form.Group>
                          <Form.Label>Số Lượng</Form.Label>
                          {/* <Form.Control
                            type="number"
                            disabled={
                              formAdd.itemNeeded[idx].id === "" ? true : false
                            }
                            min={1}
                            max={
                              medicalSupplies?.find(
                                (i) =>
                                  String(i.id) ===
                                  String(formAdd.itemNeeded[idx].id)
                              )?.quantity || ""
                            }
                            value={formAdd.itemNeeded[idx]?.quantity}
                            onChange={(e) =>
                              handleChangeQuantity(idx, e.target.value)
                            }
                          ></Form.Control> */}
                          <Form.Control
                            disabled={
                              formAdd.itemNeeded[idx].medicalSupplyId === ""
                            }
                            type="number"
                            value={item.quantity}
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val === "" || Number(val) === 0) {
                                handleChangeQuantity(idx, 1);
                              }
                            }}
                            // onChange={(e) => {
                            //   const value = e.target.value;

                            //   // Chỉ cho phép số
                            //   if (!/^\d*$/.test(value)) return;

                            //   if (value === "") {
                            //     // Cho phép xóa input tạm thời (sẽ được xử lý khi blur)
                            //     const updateItemNeeded = [
                            //       ...formAdd.itemNeeded,
                            //     ];
                            //     updateItemNeeded[idx] = {
                            //       ...updateItemNeeded[idx],
                            //       quantity: "",
                            //     };
                            //     setFormAdd((prev) => ({
                            //       ...prev,
                            //       itemNeeded: updateItemNeeded,
                            //     }));
                            //     return;
                            //   }

                            //   const parsedValue = Number(value);
                            //   if (parsedValue < 1) return;

                            //   handleChangeQuantity(idx, parsedValue);
                            // }}

                            onChange={(e) => {
                              const value = e.target.value;

                              // Không cho phép ký tự không phải số
                              if (!/^\d*$/.test(value)) return;

                              // Gọi lại hàm chính, hàm sẽ xử lý "" hoặc số tùy theo giá trị
                              handleChangeQuantity(
                                idx,
                                value === "" ? "" : Number(value)
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="">
                        <Form.Group>
                          <Form.Label>Thao tác</Form.Label>
                          <Button
                            variant="outline-danger"
                            className="px-4"
                            onClick={() => handleRemoveSupply(idx)}
                          >
                            <i className="fas fa-trash me-1"></i>Xóa
                          </Button>
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                </Row>
                <Row>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="mt-2 mb-3"
                      onClick={() => handleAddSupply()}
                    >
                      <i className="fas fa-plus me-2"></i> Thêm mẫu
                    </Button>
                  </Col>
                </Row>
              </Row>

              <Row>
                <Form.Group>
                  <Form.Label>Ghi chú</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formAdd.note}
                    onChange={(e) =>
                      setFormAdd({ ...formAdd, note: e.target.value })
                    }
                    placeholder="Nhập lưu ý (nếu cần) ..."
                  ></Form.Control>
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                resetFormAdd();
                setModalAdd(false);
              }}
            >
              Đóng
            </Button>
            <Button variant="primary" type="submit" form="myForm">
              Gửi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default HealthEvents;
