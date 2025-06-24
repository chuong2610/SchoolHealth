import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

const Profile = () => {
  
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/User/${userId}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userInfo) return <div>Loading...</div>;

  console.log("Image URL:", userInfo.imageUrl);

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
            <Link
              to="/admin/edit-profile"
              className="btn btn-primary"
              style={{ fontSize: 16, borderRadius: 8 }}
              disabled
            >
              <i className="fas fa-edit "></i>Chỉnh sửa
            </Link>
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
