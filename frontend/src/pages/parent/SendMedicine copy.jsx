import React, { useState } from "react";
import 'antd/dist/reset.css';
import { Form, Input, Button, Card, Modal, Alert, Spin, Typography } from 'antd';
const { Title } = Typography;

const defaultMedicine = {
  name: "",
  quantity: 1,
  dosage: "",
  time: "",
  note: "",
};

const SendMedicine = () => {
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medicines, setMedicines] = useState([{ ...defaultMedicine }]);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderNote, setSenderNote] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    const data = {
      studentName,
      studentClass,
      medicines,
      senderName,
      senderPhone,
      senderNote,
    };
    console.log("Form submitted:", data);
  };

  return (
    <div
      style={{ background: "#f5f5f5", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="text-center mb-5">Gửi thuốc cho học sinh</h1>
                <form className="medicine-form" onSubmit={handleSubmit}>
                  {/* Thông tin học sinh */}
                  <section className="form-section mb-5">
                    <h2 className="d-flex align-items-center mb-4">
                      <i className="fas fa-user-graduate me-2"></i> Thông tin
                      học sinh
                    </h2>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="studentName" className="form-label">
                            Họ và tên học sinh *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="studentName"
                            name="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="class" className="form-label">
                            Lớp *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="class"
                            name="class"
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Thông tin thuốc */}
                  <section className="form-section mb-5">
                    <h2 className="d-flex align-items-center mb-4">
                      <i className="fas fa-pills me-2"></i> Thông tin thuốc
                    </h2>
                    <div className="medicine-list">
                      {medicines.map((med, idx) => (
                        <div className="medicine-item card mb-4" key={idx}>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label className="form-label">
                                    Tên thuốc *
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={med.name}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        idx,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label className="form-label">
                                    Số lượng *
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min={1}
                                    value={med.quantity}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        idx,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label className="form-label">
                                    Liều dùng *
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: 1 viên/lần"
                                    value={med.dosage}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        idx,
                                        "dosage",
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label className="form-label">
                                    Thời gian uống *
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: Sáng, trưa, tối"
                                    value={med.time}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        idx,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="form-label">Ghi chú</label>
                                  <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Nhập hướng dẫn sử dụng hoặc lưu ý..."
                                    value={med.note}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        idx,
                                        "note",
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            {medicines.length > 1 && (
                              <div className="text-end mt-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemoveMedicine(idx)}
                                >
                                  <i className="fas fa-trash me-1"></i> Xóa
                                  thuốc
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddMedicine}
                    >
                      <i className="fas fa-plus me-2"></i> Thêm thuốc
                    </button>
                  </section>

                  {/* Thông tin người gửi */}
                  <section className="form-section mb-5">
                    <h2 className="d-flex align-items-center mb-4">
                      <i className="fas fa-user me-2"></i> Thông tin người gửi
                    </h2>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="senderName" className="form-label">
                            Họ và tên *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="senderName"
                            name="senderName"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="senderPhone" className="form-label">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="senderPhone"
                            name="senderPhone"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="senderNote" className="form-label">
                            Ghi chú thêm
                          </label>
                          <textarea
                            className="form-control"
                            id="senderNote"
                            name="senderNote"
                            rows={3}
                            placeholder="Nhập thông tin bổ sung nếu cần..."
                            value={senderNote}
                            onChange={(e) => setSenderNote(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Nút gửi form */}
                  <div className="text-center mt-5">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="fas fa-paper-plane me-2"></i> Gửi thuốc
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMedicine;
