import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getStudentListByParentId,
  sendMedicineApi,
} from "../../api/parent/medicineApi";
import styled, { keyframes } from 'styled-components';
import { FaUser, FaCalendarAlt, FaPills, FaCheckCircle, FaPlusCircle, FaTrash, FaPaperPlane } from 'react-icons/fa';
import '../../styles/parent-theme.css';
import { Tooltip } from 'antd';

const defaultMedicine = {
  medicineName: "",
  // quantity: 1,
  dosage: "",
  // time: "",
  notes: "",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CardInput = styled.div`
  background: linear-gradient(120deg, #e6f7ff 60%, #f0f5ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(56,182,255,0.12);
  padding: 32px 28px 18px 28px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.7s;
`;

const InputLabel = styled.div`
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  border-radius: 10px;
  border: 2px solid #e6f7ff;
  background: #fff;
  padding: 10px 16px;
  width: 100%;
  margin-bottom: 12px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #38b6ff;
    box-shadow: 0 0 0 2px rgba(56,182,255,0.12);
    outline: none;
  }
`;

const MiniCard = styled.div`
  background: #f0f5ff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(56,182,255,0.08);
  padding: 12px 18px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.5s;
`;

const MiniIcon = styled.span`
  color: #38b6ff;
  font-size: 1.2rem;
  margin-right: 10px;
`;

const GradientButton = styled(Button)`
  background: linear-gradient(90deg, #2980B9 60%, #38b6ff 100%) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 16px !important;
  font-weight: 600 !important;
  padding: 12px 32px !important;
  font-size: 1.1rem !important;
  box-shadow: 0 2px 12px rgba(56,182,255,0.18) !important;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980B9 100%) !important;
    box-shadow: 0 6px 24px rgba(56,182,255,0.22) !important;
    transform: scale(1.05) !important;
  }
`;

const StyledFormControl = styled(Form.Control)`
  border-radius: 12px !important;
  border: 2px solid #e6eaf0 !important;
  background: #f8f9fa !important;
  padding: 12px 16px !important;
  font-size: 1rem !important;
  margin-bottom: 12px !important;
  transition: border 0.2s, box-shadow 0.2s !important;
  &:focus {
    border-color: #38b6ff !important;
    box-shadow: 0 0 0 2px rgba(56,182,255,0.12) !important;
    outline: none !important;
  }
`;

const SendMedicine = () => {
  const [students, setStudents] = useState([]);
  // const [studentName, setStudentName] = useState("");
  // const [studentClass, setStudentClass] = useState("");
  const [medicines, setMedicines] = useState([{ ...defaultMedicine }]);
  // const [senderName, setSenderName] = useState("");
  // const [senderPhone, setSenderPhone] = useState("");
  // const [senderNote, setSenderNote] = useState("");
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
      setValidated(true);
      return;
    }

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
        studentId: selectedStudentId,
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
        toast.error("Đã xảy ra lỗi khi gửi thuốc.");
        console.error("Gửi thuốc thất bại:", error);
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
                          <option key={student.id} value={student.id}>{student.studentName}</option>
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
                      <Col md={6}>
                        <Form.Group controlId={`formMedName-${idx}`}>
                          <Form.Label>Tên thuốc</Form.Label>
                          <StyledFormControl
                            required
                            type="text"
                            value={med.medicineName}
                            onChange={(e) =>
                              handleMedicineChange(idx, "medicineName", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      {/* <Col md={2}>
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
                      </Col> */}
                      <Col md={6}>
                        <Form.Group controlId={`formMedDosage-${idx}`}>
                          <Form.Label>Liều dùng</Form.Label>
                          <StyledFormControl
                            required
                            type="text"
                            value={med.dosage}
                            onChange={(e) =>
                              handleMedicineChange(idx, "dosage", e.target.value)
                            }
                            placeholder="Ví dụ: 1 viên/lần"
                          />
                          <Form.Control.Feedback type="invalid">
                            Không được để trống
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      {/* <Col md={3}>
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
                      </Col> */}
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group controlId={`formMedNote-${idx}`}>
                          <Form.Label>Ghi chú</Form.Label>
                          <StyledFormControl
                            as="textarea"
                            rows={2}
                            placeholder="Nhập hướng dẫn sử dụng hoặc lưu ý..."
                            value={med.notes}
                            onChange={(e) =>
                              handleMedicineChange(idx, "notes", e.target.value)
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
                          <Tooltip title="Xóa thuốc">
                            <Button
                              variant="outline-danger"
                              onClick={() => handleRemoveMedicine(idx)}
                            >
                              <FaTrash className="me-1" /> Xóa thuốc
                            </Button>
                          </Tooltip>
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
                    <GradientButton variant="primary" type="submit">
                      <FaPaperPlane /> Gửi thuốc
                    </GradientButton>
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
