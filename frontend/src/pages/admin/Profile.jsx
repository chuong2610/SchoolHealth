import React from "react";

const adminProfile = {
  name: "Nguyễn Văn Admin",
  dob: "1990-05-15",
  gender: "Nam",
  position: "Quản trị viên",
  email: "admin@schoolhealth.com",
  phone: "0987654321",
  address: "123 Đường ABC, Quận XYZ, TP.HCM",
};

const Profile = () => (
  <div className="container py-4">
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Thông tin cá nhân</h5>
            <button className="btn btn-sm btn-link">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 mb-2">
                <div className="text-muted small">Họ và tên</div>
                <div className="fw-medium">{adminProfile.name}</div>
              </div>
              <div className="col-6 mb-2">
                <div className="text-muted small">Ngày sinh</div>
                <div className="fw-medium">
                  {adminProfile.dob.split("-").reverse().join("/")}
                </div>
              </div>
              <div className="col-6 mb-2">
                <div className="text-muted small">Giới tính</div>
                <div className="fw-medium">{adminProfile.gender}</div>
              </div>
              <div className="col-12 mb-2">
                <div className="text-muted small">Chức vụ</div>
                <div className="fw-medium">{adminProfile.position}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Thông tin liên hệ</h5>
            <button className="btn btn-sm btn-link">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6 mb-2">
                <div className="text-muted small">Email</div>
                <div className="fw-medium">{adminProfile.email}</div>
              </div>
              <div className="col-6 mb-2">
                <div className="text-muted small">Số điện thoại</div>
                <div className="fw-medium">{adminProfile.phone}</div>
              </div>
              <div className="col-12 mb-2">
                <div className="text-muted small">Địa chỉ</div>
                <div className="fw-medium">{adminProfile.address}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
