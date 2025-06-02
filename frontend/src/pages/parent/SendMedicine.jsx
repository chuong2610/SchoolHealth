import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getStudentListByParentId,
  sendMedicineApi,
} from "../../api/parent/medicineApi";

const defaultMedicine = {
  name: "",
  quantity: 1,
  dosage: "",
  time: "",
  note: "",
};

const SendMedicine = () => {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medicines, setMedicines] = useState([{ ...defaultMedicine }]);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderNote, setSenderNote] = useState("");
  const [validated, setValidated] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const handleMedicineChange = (idx, field, value) => {
    setMedicines((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { ...defaultMedicine }]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    //check validated
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity() === true) {
      console.log("submit success");
      // const data = {
      //   studentName,
      //   studentClass,
      //   medicines,
      //   senderName,
      //   senderPhone,
      //   senderNote,
      // };
      const data = {
        selectedStudentId,
        medicines,
      };
      console.log("Form submitted:", data);

      //xu ly du lieu voi api
      try {
        const res = await sendMedicineApi(data);
        console.log("Server respone: ", res);

        // dung toast de hien thi thong bao
        toast.success("Gửi thành công!");

        // reset form
        // setStudentName("");
        // setStudentClass("");
        setSelectedStudentId("");
        setMedicines([]);
        // setSenderName("");
        // setSenderPhone("");
        // setSenderNote("");
        setValidated(false);

        // Cuộn lên đầu
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Gửi thuốc thất bại:", error);
        toast.error("Đã xảy ra lỗi khi gửi thuốc.");
      }
    }
  };

  // khi load trang thi goi api de lay danh sach student
  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const res = await getStudentListByParentId();
        setStudents(res);
      } catch (error) {
        console.log("Loi fetchStudentList");
      }
    };
    fetchStudentList();
  }, []);

  useEffect(() => {
    console.log(students);
  }, [students]);
  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "24px 0px",
      }}
    >
      <Container className="">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="bg-light p-4 rounded shadow">
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row className="mb-5">
                  <Col className="text-center">
                    <h1>Gửi thuốc cho học sinh</h1>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <h2 className="d-flex align-items-center mb-4">
                      <i className="fas fa-user-graduate me-2"></i> Thông tin
                      học sinh
                    </h2>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {/* <Form.Group className="mb-3" controlId="FormStudentName">
                      <Form.Label>Họ và tên học sinh</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Không được để trống
                      </Form.Control.Feedback>
                    </Form.Group> */}

                    <Form.Group>
                      <Form.Label>Họ và tên học sinh</Form.Label>
                      <Form.Select
                        className="mb-3"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                      >
                        <option value="">-- Chọn học sinh --</option>
                        {students?.map((student) => (
                          <option value={student.id}>{student.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    {/* <Form.Group className="mb-3" controlId="FormStudentClass">
                      <Form.Label>Lớp</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Không được để trống
                      </Form.Control.Feedback>
                    </Form.Group> */}

                    {/* Lay lop tu student duoc chon */}
                    {/* <label>Lớp</label>
                    <input readOnly value={selectedStudentId} /> */}
                    <Form.Group>
                      <Form.Label>Lớp</Form.Label>
                      <Form.Control
                        readOnly
                        value={
                          students?.find(
                            (student) =>
                              student.id.toString() === selectedStudentId
                          )?.className || ""
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <h2 className="d-flex align-item-center mb-4">
                      <i className="fas fa-pills me-2"></i>Thông tin thuốc
                    </h2>
                  </Col>
                </Row>

                {medicines.map((med, idx) => (
                  <div key={idx} className="mb-4 border rounded p-3">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group controlId={`formMedName-${idx}`}>
                          <Form.Label>Tên thuốc</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={med.name}
                            onChange={(e) =>
                              handleMedicineChange(idx, "name", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group controlId={`formMedQuantity-${idx}`}>
                          <Form.Label>Số lượng</Form.Label>
                          <Form.Control
                            required
                            type="number"
                            min={1}
                            value={med.quantity}
                            onChange={(e) =>
                              handleMedicineChange(
                                idx,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId={`formMedDosage-${idx}`}>
                          <Form.Label>Liều dùng</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={med.dosage}
                            onChange={(e) =>
                              handleMedicineChange(
                                idx,
                                "dosage",
                                e.target.value
                              )
                            }
                            placeholder="Ví dụ: 1 viên/lần"
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId={`formMedTime-${idx}`}>
                          <Form.Label>Thời gian</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={med.time}
                            onChange={(e) =>
                              handleMedicineChange(idx, "time", e.target.value)
                            }
                            placeholder="Ví dụ: sáng, trưa, tối,..."
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group controlId={`formMedNote-${idx}`}>
                          <Form.Label>Ghi chú</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Nhập hướng dẫn sử dụng hoặc lưu ý..."
                            value={med.note}
                            onChange={(e) =>
                              handleMedicineChange(idx, "note", e.target.value)
                            }
                            onInput={(e) => {
                              e.target.style.height = "auto"; // reset lại chiều cao
                              e.target.style.height = `${e.target.scrollHeight}px`; // đặt theo chiều cao thực tế của nội dung
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex align-items-end justify-content-end mt-2">
                        {medicines.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRemoveMedicine(idx)}
                          >
                            <i className="fas fa-trash me-1"></i> Xóa thuốc
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}

                <Row>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="mt-2 mb-5"
                      onClick={handleAddMedicine}
                    >
                      <i className="fas fa-plus me-2"></i> Thêm thuốc
                    </Button>
                  </Col>
                </Row>

                {/* Thong tin nguoi gui */}
                {/* <Row>
                  <Col>
                    <h2 className="d-flex align-item-center mb-4">
                      <i className="fas fa-user me-2"></i> Thông tin người gửi
                    </h2>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formParentName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Không được để trống
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formParentPhone">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Không được để trống
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group controlId="formParentNote">
                    <Form.Label>Ghi chú thêm</Form.Label>
                    <Form.Control
                      as="textarea"
                      row={2}
                      value={senderNote}
                      onChange={(e) => setSenderNote(e.target.value)}
                      onInput={(e) => {
                        e.target.style.height = "auto"; // reset lại chiều cao
                        e.target.style.height = `${e.target.scrollHeight}px`; // đặt theo chiều cao thực tế của nội dung
                      }}
                      placeholder="Nhập thông tin bổ sung nếu cần"
                    ></Form.Control>
                  </Form.Group>
                </Row> */}

                <Row>
                  <Col className="text-center mt-5">
                    <Button variant="primary" type="submit">
                      <i className="fas fa-paper-plane me-2"></i> Gửi thuốc
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SendMedicine;
