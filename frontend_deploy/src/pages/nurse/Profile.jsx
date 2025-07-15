import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
  FaCamera,
  FaUserNurse,
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import {
  getNurseInfo,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "../../api/nurse/ProfileApi";
import { useAvatar } from "../../context/AvatarContext";
import { toast } from "react-toastify";
import styles from "./Profile.module.css";

const Profile = () => {
  const nurseId = localStorage.userId;
  const [nurseInfo, setNurseInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    imageUrl: "",
    dateOfBirth: "",
    roleName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(nurseInfo);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { updateAvatarVersion } = useAvatar();
  const fileInputRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchNurseInfo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFormData(nurseInfo);
  }, [nurseInfo]);

  const fetchNurseInfo = async () => {
    try {
      const res = await getNurseInfo(nurseId);
      if (res) {
        setNurseInfo(res);
      }
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile(nurseId, formData);
      if (res?.success !== false) {
        toast.success("Cập nhật thông tin thành công!");
        setEditMode(false);
        fetchNurseInfo();
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi khi cập nhật!");
    }
  };

  const handleCancel = () => {
    setFormData(nurseInfo);
    setEditMode(false);
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      hanldeUpdateProfile(file);
    }
  };

  const hanldeUpdateProfile = async (file) => {
    try {
      let imageUrl = nurseInfo.imageUrl;
      if (imageUrl && imageUrl.startsWith("http")) {
        imageUrl = imageUrl.split("/").pop();
      }
      if (file) {
        imageUrl = await uploadAvatar(file);
      }
      await updateProfile(nurseId, {
        ...nurseInfo,
        imageUrl,
      });
      fetchNurseInfo(nurseId);
      updateAvatarVersion();
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Có lỗi khi lưu thông tin hoặc upload ảnh!");
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await updatePassword(nurseId, passwordData);
      if (res?.success === true) {
        toast.success("Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi khi đổi mật khẩu!");
      return;
    } finally {
      setLoading(false);
    }
  };

  // Helper for empty fields
  const showValue = (val) =>
    val ? (
      val
    ) : (
      <span className={styles.profileFieldValue + " " + styles.empty}>
        Chưa cập nhật
      </span>
    );

  return (
    <div className={styles.profileRoot}>
      {/* Profile Header Card */}
      <div className={styles.profileHeaderCard}>
        <div className={styles.profileHeaderLeft}>
          <div className={styles.profileAvatarWrapper}>
            <img
              src={nurseInfo.imageUrl || "/default-avatar.png"}
              alt="Avatar"
              className={styles.profileAvatar}
            />
            <div
              className={styles.profileAvatarEdit}
              onClick={() => fileInputRef.current.click()}
              tabIndex={0}
              role="button"
              title="Cập nhật ảnh đại diện"
            >
              <div className={styles.profileAvatarEditContent}>
                <span className={styles.profileAvatarEditIcon}>
                  <FaCamera />
                </span>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleChangeImage}
            />
          </div>
          <div>
            <div className={styles.profileName}>
              {showValue(nurseInfo.name)}
            </div>
            <div className={styles.profileRole}>
              <FaUserNurse style={{ marginRight: 6 }} />
              {showValue(nurseInfo.roleName || "Y tá")}
            </div>
          </div>
        </div>
        <div className={styles.profileHeaderRight}>
          <button
            className={styles.editBtn}
            type="button"
            onClick={() => setShowEditModal(true)}
          >
            <FaEdit style={{ marginRight: 6 }} /> Chỉnh sửa hồ sơ
          </button>
          <button
            className={styles.passwordBtn}
            type="button"
            onClick={() => setShowChangePassword(true)}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileCardTitle}>
          <FaIdCard /> Thông tin cá nhân
        </div>
        <div className={styles.profileInfoGrid}>
          <div className={styles.profileInfoItem}>
            <span>
              <FaUser style={{ marginRight: 6 }} /> Họ và tên
            </span>
            <div>{showValue(nurseInfo.name)}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaBirthdayCake style={{ marginRight: 6 }} /> Ngày sinh
            </span>
            <div>{showValue(nurseInfo.dateOfBirth)}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaVenusMars style={{ marginRight: 6 }} /> Giới tính
            </span>
            <div>{showValue(nurseInfo.gender)}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaBuilding style={{ marginRight: 6 }} /> Chức vụ
            </span>
            <div>{showValue(nurseInfo.roleName || "Y tá")}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaEnvelope style={{ marginRight: 6 }} /> Email
            </span>
            <div>{showValue(nurseInfo.email)}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaPhone style={{ marginRight: 6 }} /> Số điện thoại
            </span>
            <div>{showValue(nurseInfo.phone)}</div>
          </div>
          <div className={styles.profileInfoItem}>
            <span>
              <FaMapMarkerAlt style={{ marginRight: 6 }} /> Địa chỉ
            </span>
            <div>{showValue(nurseInfo.address)}</div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      {showEditModal && (
        <div className={styles.editModalOverlay}>
          <div className={styles.editModal}>
            <div className={styles.editModalHeader}>
              <FaEdit style={{ marginRight: 8 }} /> Chỉnh sửa hồ sơ
              <span
                className={styles.editModalClose}
                onClick={() => {
                  setShowEditModal(false);
                  setFormData(nurseInfo);
                }}
                title="Đóng"
              >
                &times;
              </span>
            </div>
            <div className={styles.editModalBody}>
              <div className={styles.editModalFormGrid}>
                <div className={styles.editModalFormGroup}>
                  <FaUser style={{ marginRight: 6 }} /> Họ và tên
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                    autoComplete="off"
                  />
                </div>
                <div className={styles.editModalFormGroup}>
                  <FaEnvelope style={{ marginRight: 6 }} /> Email
                  <input
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className={styles.editModalFormGroup}>
                  <FaPhone style={{ marginRight: 6 }} /> Số điện thoại
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                    autoComplete="off"
                  />
                </div>
                <div className={styles.editModalFormGroup}>
                  <FaMapMarkerAlt style={{ marginRight: 6 }} /> Địa chỉ
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                    autoComplete="off"
                    rows={2}
                  />
                </div>
                <div className={styles.editModalFormGroup}>
                  <FaBirthdayCake style={{ marginRight: 6 }} /> Ngày sinh
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                    autoComplete="off"
                  />
                </div>
                <div className={styles.editModalFormGroup}>
                  <FaVenusMars style={{ marginRight: 6 }} /> Giới tính
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className={styles.profileInput}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className={styles.editModalFooter}>
                <button
                  className={styles.profileEditBtn}
                  style={{ background: "#ff6b8d", color: "#fff" }}
                  onClick={() => {
                    handleSave();
                    setShowEditModal(false);
                  }}
                  type="button"
                >
                  <FaSave /> Lưu
                </button>
                <button
                  className={styles.profileEditBtn}
                  style={{
                    background: "#fff0f6",
                    color: "#ff6b8d",
                    border: "1.5px solid #ffe4ec",
                  }}
                  onClick={() => {
                    setShowEditModal(false);
                    setFormData(nurseInfo);
                  }}
                  type="button"
                >
                  <FaTimes /> Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Đổi mật khẩu Modal */}
      {showChangePassword && (
        <div className={styles.passwordModalOverlay}>
          <div className={styles.passwordModal}>
            <h3>Đổi mật khẩu</h3>
            <span
              className={styles.passwordModalClose}
              onClick={() => setShowChangePassword(false)}
              title="Đóng"
            >
              &times;
            </span>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className={styles.profileInput}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className={styles.profileInput}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmNewPassword: e.target.value,
                })
              }
              className={styles.profileInput}
            />
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 18,
              }}
            >
              <button
                className={styles.profileEditBtn}
                style={{ background: "#ff6b8d", color: "#fff" }}
                onClick={handleChangePassword}
                type="button"
                disabled={loading}
              >
                Lưu
              </button>
              <button
                className={styles.profileEditBtn}
                style={{
                  background: "#fff0f6",
                  color: "#ff6b8d",
                  border: "1.5px solid #ffe4ec",
                }}
                onClick={() => setShowChangePassword(false)}
                type="button"
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
