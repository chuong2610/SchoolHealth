import React from "react";

const parentInfo = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  name: "Nguyễn Văn B",
  code: "PH001",
  email: "nguyenvanb@gmail.com",
  phone: "0912 345 678",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  dob: "15/05/1980",
  gender: "Nam",
  children: [
    {
      name: "Nguyễn Văn C",
      class: "10A1",
      id: "HS001",
    },
  ],
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
              src={parentInfo.avatar}
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
              {parentInfo.name}
            </h2>
            <span
              className="badge bg-primary mb-2"
              style={{ fontSize: 16, borderRadius: 8 }}
            >
              Mã phụ huynh: {parentInfo.code}
            </span>
            <button
              className="btn btn-outline-primary px-4"
              style={{ borderRadius: 8 }}
              disabled
            >
              <i className="fas fa-edit me-2"></i>Chỉnh sửa
            </button>
          </div>
          <div className="row mb-3">
            <div className="col-6 mb-2">
              <i className="fas fa-envelope me-2 text-secondary"></i>Email:
              <br />
              <span className="fw-semibold">{parentInfo.email}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-phone me-2 text-secondary"></i>Số điện thoại:
              <br />
              <span className="fw-semibold">{parentInfo.phone}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>Địa
              chỉ:
              <br />
              <span className="fw-semibold">{parentInfo.address}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-birthday-cake me-2 text-secondary"></i>Ngày
              sinh:
              <br />
              <span className="fw-semibold">{parentInfo.dob}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-venus-mars me-2 text-secondary"></i>Giới
              tính:
              <br />
              <span className="fw-semibold">{parentInfo.gender}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
              Học sinh liên quan
            </div>
            <ul className="list-group">
              {parentInfo.children.map((child, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <i className="fas fa-user-graduate me-2 text-secondary"></i>
                    {child.name} ({child.class})
                  </span>
                  <span className="badge bg-info text-white">{child.id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
