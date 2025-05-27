import React from "react";

const nurseInfo = {
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  name: "Nguyễn Thị B",
  id: "YT001",
  dob: "12/05/1985",
  gender: "Nữ",
  email: "nguyenthib@nurse.edu.vn",
  phone: "0901 234 567",
};

const Profile = () => {
  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        <div
          className="card shadow-sm border-0 rounded-4 p-4"
          style={{ margin: "0 auto" }}
        >
          <div className="d-flex flex-column align-items-center mb-4">
            <img
              src={nurseInfo.avatar}
              alt="Avatar"
              className="rounded-circle mb-3"
              style={{
                width: 110,
                height: 110,
                objectFit: "cover",
                border: "4px solid #e5e7eb",
              }}
            />
            <h2 className="fw-bold mb-1" style={{ fontSize: 28 }}>
              {nurseInfo.name}
            </h2>
            <span
              className="badge bg-primary mb-2"
              style={{ fontSize: 16, borderRadius: 8 }}
            >
              Mã nhân viên: {nurseInfo.id}
            </span>
          </div>
          <div className="row mb-3">
            <div className="col-6 mb-2">
              <i className="fas fa-envelope me-2 text-secondary"></i>Email:
              <br />
              <span className="fw-semibold">{nurseInfo.email}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-phone me-2 text-secondary"></i>Số điện thoại:
              <br />
              <span className="fw-semibold">{nurseInfo.phone}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-birthday-cake me-2 text-secondary"></i>Ngày
              sinh:
              <br />
              <span className="fw-semibold">{nurseInfo.dob}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-venus-mars me-2 text-secondary"></i>Giới
              tính:
              <br />
              <span className="fw-semibold">{nurseInfo.gender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
