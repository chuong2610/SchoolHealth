import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';

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
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <FaUser className="me-2" /> Hồ sơ cá nhân
        </h1>
      </div>

      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Thông tin cá nhân</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column align-items-center mb-4">
                <img
                  src={nurseInfo.avatar}
                  alt="Avatar"
                  className="img-profile rounded-circle mb-3"
                />
                <h2 className="h4 mb-1 text-gray-900">
                  {nurseInfo.name}
                </h2>
                <span className="badge bg-primary text-white mb-2">
                  Mã nhân viên: {nurseInfo.id}
                </span>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p className="text-gray-800">
                    <FaEnvelope className="me-2 text-secondary" />
                    <strong>Email:</strong>
                    <br />
                    <span className="text-gray-700">{nurseInfo.email}</span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="text-gray-800">
                    <FaPhone className="me-2 text-secondary" />
                    <strong>Số điện thoại:</strong>
                    <br />
                    <span className="text-gray-700">{nurseInfo.phone}</span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="text-gray-800">
                    <FaBirthdayCake className="me-2 text-secondary" />
                    <strong>Ngày sinh:</strong>
                    <br />
                    <span className="text-gray-700">{nurseInfo.dob}</span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="text-gray-800">
                    <FaVenusMars className="me-2 text-secondary" />
                    <strong>Giới tính:</strong>
                    <br />
                    <span className="text-gray-700">{nurseInfo.gender}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
