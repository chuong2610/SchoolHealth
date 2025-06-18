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
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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
    e.preventDefault();
    let hasError = false;
    if (!selectedStudentId) {
      toast.error("Vui lòng chọn học sinh.");
      hasError = true;
    }
    medicines.forEach((med, idx) => {
      if (!med.medicineName) {
        toast.error(`Vui lòng nhập tên thuốc!`);
        hasError = true;
      }
      if (!med.dosage) {
        toast.error(`Vui lòng nhập liều dùng!`);
        hasError = true;
      }
    });
    if (hasError) return;

    if (e.currentTarget.checkValidity() === true) {
      console.log("submit success");
      const data = {
        studentId: Number(selectedStudentId),
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
        setSelectedStudentId("");
        setMedicines([]);
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
    <div className="parent-bg-img parent-theme" style={{ minHeight: "100vh", padding: "24px 0px" }}>
      <div className="fade-in-up">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form className="parent-form" onSubmit={handleSubmit} noValidate>
                <div className="parent-form-header">
                  <h2>
                    <FaPills style={{ color: "#38b6ff", marginRight: 12, fontSize: 32, verticalAlign: "middle" }} />
                    Gửi thuốc cho học sinh
                  </h2>
                  <p>Vui lòng điền thông tin thuốc và hướng dẫn sử dụng để nhà trường hỗ trợ tốt nhất.</p>
                </div>
                <div className="parent-form-grid">
                  <div className="form-group">
                    <label htmlFor="studentSelect">Chọn học sinh</label>
                    <select
                      className="parent-input"
                      id="studentSelect"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      required
                    >
                      <option value="">-- Chọn học sinh --</option>
                      {students?.map((student) => (
                        <option key={student.id} value={student.id}>{student.studentName} (Mã: {student.id}, Lớp: {student.className})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="class">Lớp</label>
                    <input
                      className="parent-input"
                      id="class"
                      readOnly
                      value={
                        students?.find((student) => student.id.toString() === selectedStudentId)?.className || ""
                      }
                    />
                  </div>
                </div>
                <h4 className="mt-4 mb-3" style={{ color: "#2563eb", fontWeight: 700 }}>
                  <FaPills style={{ marginRight: 8 }} /> Thông tin thuốc
                </h4>
                {medicines.map((med, idx) => (
                  <div key={idx} className="parent-form-grid mb-4" style={{ border: "1px solid #e6eaf0", borderRadius: 12, padding: 16 }}>
                    <div className="form-group">
                      <label htmlFor={`medicineName-${idx}`}>Tên thuốc</label>
                      <input
                        className="parent-input"
                        id={`medicineName-${idx}`}
                        required
                        type="text"
                        value={med.medicineName}
                        onChange={(e) => handleMedicineChange(idx, "medicineName", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`dosage-${idx}`}>Liều dùng</label>
                      <input
                        className="parent-input"
                        id={`dosage-${idx}`}
                        required
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                        placeholder="Ví dụ: 1 viên/lần"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1/-1" }}>
                      <label htmlFor={`notes-${idx}`}>Ghi chú</label>
                      <textarea
                        className="parent-input"
                        id={`notes-${idx}`}
                        rows={2}
                        placeholder="Nhập hướng dẫn sử dụng hoặc lưu ý..."
                        value={med.notes}
                        onChange={(e) => handleMedicineChange(idx, "notes", e.target.value)}
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                      />
                    </div>
                    <div className="d-flex align-items-end justify-content-end mt-2" style={{ gridColumn: "1/-1" }}>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveMedicine(idx)}
                          style={{ display: "flex", alignItems: "center", gap: 4 }}
                        >
                          <FaTrash className="me-1" /> Xóa thuốc
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddMedicine}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <FaPlusCircle className="me-2" /> Thêm thuốc
                  </button>
                </div>
                <div className="d-grid" style={{ gridColumn: "1/-1" }}>
                  <button
                    type="submit"
                    className="parent-btn parent-gradient-btn"
                    style={{ marginTop: 16 }}
                  >
                    <FaPaperPlane /> Gửi thuốc
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMedicine;
