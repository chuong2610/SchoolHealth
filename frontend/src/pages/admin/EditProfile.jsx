import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:5182/api/User/${userId}`);
      setUserInfo(res.data);
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:5182/api/User/profile/${userId}`,
        userInfo
      );
      alert("Cập nhật thành công!");
      navigate("/profile"); // quay lại trang Profile
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra.");
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Chỉnh sửa thông tin</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Họ tên</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={userInfo.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giới tính</label>
          <input
            type="text"
            className="form-control"
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ngày sinh</label>
          <input
            type="date"
            className="form-control"
            name="dateOfBirth"
            value={userInfo.dateOfBirth.slice(0, 10)}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh đại diện (URL)</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={userInfo.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
