// import React from "react";

// const adminProfile = {
//   name: "Nguyễn Văn Admin",
//   dob: "1990-05-15",
//   gender: "Nam",
//   position: "Quản trị viên",
//   email: "admin@schoolhealth.com",
//   phone: "0987654321",
//   address: "123 Đường ABC, Quận XYZ, TP.HCM",
// };

// const Profile = () => (
//   <div className="container py-4">
//     <div className="row g-4">
//       <div className="col-md-6">
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">Thông tin cá nhân</h5>
//             <button className="btn btn-sm btn-link">
//               <i className="fas fa-edit"></i>
//             </button>
//           </div>
//           <div className="card-body">
//             <div className="row g-3">
//               <div className="col-12 mb-2">
//                 <div className="text-muted small">Họ và tên</div>
//                 <div className="fw-medium">{adminProfile.name}</div>
//               </div>
//               <div className="col-6 mb-2">
//                 <div className="text-muted small">Ngày sinh</div>
//                 <div className="fw-medium">
//                   {adminProfile.dob.split("-").reverse().join("/")}
//                 </div>
//               </div>
//               <div className="col-6 mb-2">
//                 <div className="text-muted small">Giới tính</div>
//                 <div className="fw-medium">{adminProfile.gender}</div>
//               </div>
//               <div className="col-12 mb-2">
//                 <div className="text-muted small">Chức vụ</div>
//                 <div className="fw-medium">{adminProfile.position}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="col-md-6">
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">Thông tin liên hệ</h5>
//             <button className="btn btn-sm btn-link">
//               <i className="fas fa-edit"></i>
//             </button>
//           </div>
//           <div className="card-body">
//             <div className="row g-3">
//               <div className="col-6 mb-2">
//                 <div className="text-muted small">Email</div>
//                 <div className="fw-medium">{adminProfile.email}</div>
//               </div>
//               <div className="col-6 mb-2">
//                 <div className="text-muted small">Số điện thoại</div>
//                 <div className="fw-medium">{adminProfile.phone}</div>
//               </div>
//               <div className="col-12 mb-2">
//                 <div className="text-muted small">Địa chỉ</div>
//                 <div className="fw-medium">{adminProfile.address}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default Profile;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  // const { userId } = useParams(); // Lấy userId từ URL
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5182/api/User/${userId}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userInfo) return <div>Loading...</div>;

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
              src={userInfo.imageUrl}
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
              {userInfo.name}
            </h2>
            <span
              className="badge bg-primary mb-2"
              style={{ fontSize: 16, borderRadius: 8 }}
            >
              Vai trò: {userInfo.roleName}
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
              <span className="fw-semibold">{userInfo.email}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-phone me-2 text-secondary"></i>Số điện thoại:
              <br />
              <span className="fw-semibold">{userInfo.phone}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>Địa
              chỉ:
              <br />
              <span className="fw-semibold">{userInfo.address}</span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-birthday-cake me-2 text-secondary"></i>Ngày
              sinh:
              <br />
              <span className="fw-semibold">
                {new Date(userInfo.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="col-6 mb-2">
              <i className="fas fa-venus-mars me-2 text-secondary"></i>Giới
              tính:
              <br />
              <span className="fw-semibold">{userInfo.gender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
