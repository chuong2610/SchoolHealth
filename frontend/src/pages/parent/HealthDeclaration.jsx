import React, { useState } from "react";

const HealthDeclaration = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    class: "",
    symptoms: [],
    contactWithCovid: false,
    travelHistory: false,
    otherNotes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSymptomChange = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Khai báo y tế</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="studentName" className="form-label">
                    Họ và tên học sinh
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="studentId" className="form-label">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="class" className="form-label">
                    Lớp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Triệu chứng</label>
                  <div className="row">
                    {["Sốt", "Ho", "Khó thở", "Mệt mỏi", "Đau họng"].map(
                      (symptom) => (
                        <div key={symptom} className="col-md-4">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={symptom}
                              checked={formData.symptoms.includes(symptom)}
                              onChange={() => handleSymptomChange(symptom)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={symptom}
                            >
                              {symptom}
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="contactWithCovid"
                      name="contactWithCovid"
                      checked={formData.contactWithCovid}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="contactWithCovid"
                    >
                      Tiếp xúc với người nhiễm/nghi nhiễm COVID-19
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="travelHistory"
                      name="travelHistory"
                      checked={formData.travelHistory}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="travelHistory">
                      Có lịch sử đi lại từ vùng dịch
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="otherNotes" className="form-label">
                    Ghi chú khác
                  </label>
                  <textarea
                    className="form-control"
                    id="otherNotes"
                    name="otherNotes"
                    rows="3"
                    value={formData.otherNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Gửi khai báo
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

export default HealthDeclaration;
