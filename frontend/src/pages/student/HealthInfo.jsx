import React from "react";

const studentInfo = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  name: "Nguyễn Văn C",
  id: "HS001",
  class: "10A1",
  dob: "10/09/2008",
  gender: "Nam",
  health: {
    height: "170 cm",
    weight: "60 kg",
    vision: "10/10",
    blood: "O",
    history: "Không",
  },
};

const HealthInfo = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="d-flex align-items-center mb-4">
          <h1 className="fw-bold mb-0" style={{ fontSize: 36 }}>
            Thông tin sức khỏe
          </h1>
        </div>
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-3 mb-md-0">
              <img
                src={studentInfo.avatar}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{
                  width: 110,
                  height: 110,
                  objectFit: "cover",
                  border: "4px solid #e5e7eb",
                }}
              />
              <h4 className="fw-bold mb-1">{studentInfo.name}</h4>
              <span
                className="badge bg-primary mb-2"
                style={{ fontSize: 15, borderRadius: 8 }}
              >
                Mã HS: {studentInfo.id}
              </span>
              <div className="text-muted">Lớp: {studentInfo.class}</div>
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-6">
                  <i className="fas fa-birthday-cake me-2 text-secondary"></i>
                  <span className="fw-semibold">Ngày sinh:</span>{" "}
                  {studentInfo.dob}
                </div>
                <div className="col-6">
                  <i className="fas fa-venus-mars me-2 text-secondary"></i>
                  <span className="fw-semibold">Giới tính:</span>{" "}
                  {studentInfo.gender}
                </div>
                <div className="col-6">
                  <i className="fas fa-ruler-vertical me-2 text-secondary"></i>
                  <span className="fw-semibold">Chiều cao:</span>{" "}
                  {studentInfo.health.height}
                </div>
                <div className="col-6">
                  <i className="fas fa-weight me-2 text-secondary"></i>
                  <span className="fw-semibold">Cân nặng:</span>{" "}
                  {studentInfo.health.weight}
                </div>
                <div className="col-6">
                  <i className="fas fa-eye me-2 text-secondary"></i>
                  <span className="fw-semibold">Thị lực:</span>{" "}
                  {studentInfo.health.vision}
                </div>
                <div className="col-6">
                  <i className="fas fa-tint me-2 text-secondary"></i>
                  <span className="fw-semibold">Nhóm máu:</span>{" "}
                  {studentInfo.health.blood}
                </div>
                <div className="col-12">
                  <i className="fas fa-notes-medical me-2 text-secondary"></i>
                  <span className="fw-semibold">Tiền sử bệnh:</span>{" "}
                  {studentInfo.health.history}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;
