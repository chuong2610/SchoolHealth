import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Nav,
  Tab,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserGraduate,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaSpinner,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import {
  getChildrenInfo,
  getParentInfo,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "../../api/parent/ProfileApi";
import { formatDDMMYYYY } from "../../utils/dateFormatter";
import { useAvatar } from "../../context/AvatarContext";
import { toast } from "react-toastify";
import styles from "./Profile.module.css";

const Profile = () => {
  const parentId = localStorage.userId;
  const { updateAvatarVersion } = useAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [parentInfo, setParentInfo] = useState([]);
  const [formData, setFormData] = useState([
    {
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      imageUrl: "",
      dateOfBirth: "",
      roleName: "Parent",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchParentInfo = async () => {
    try {
      const res = await getParentInfo(parentId);
      if (res) {
        setParentInfo(res);
        setFormData(res);
      } else {
        setParentInfo([]);
      }
    } catch (error) {
      console.error("Có lỗi khi lấy thông tin phụ huynh!");
    }
  };

  useEffect(() => {
    fetchParentInfo();
  }, []);

  const fetchChildrenInfo = async () => {
    try {
      const res = await getChildrenInfo(parentId);
      if (res) {
        setChildren(res);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Có lỗi khi lấy thông tin con em!");
    }
  };

  useEffect(() => {
    fetchChildrenInfo();
  }, [parentId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      hanldeUpdateProfile(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const hanldeUpdateProfile = async (file) => {
    try {
      let imageUrl = parentInfo.imageUrl;

      if (imageUrl && imageUrl.startsWith("http")) {
        imageUrl = imageUrl.split("/").pop();
      }

      if (file) {
        imageUrl = await uploadAvatar(file);
      }

      await updateProfile(parentId, {
        ...formData,
        imageUrl,
      });

      setIsEditing(false);
      fetchParentInfo();
      updateAvatarVersion();
      setImagePreview(null);
    } catch (error) {
      alert("Có lỗi khi lưu thông tin hoặc upload ảnh!");
      console.error(error);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      hanldeUpdateProfile();
      setIsEditing(false);
      setLoading(false);
      setNotification({
        type: "success",
        message: "Cập nhật thông tin thành công!",
      });
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const handleCancel = () => {
    setFormData(parentInfo);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleUpdatePassword = async () => {
    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmNewPassword
    ) {
      setNotification({
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (password.newPassword !== password.confirmNewPassword) {
      setNotification({
        type: "error",
        message: "Mật khẩu mới và mật khẩu xác nhận không khớp!",
      });
      setTimeout(() => setNotification(null), 3000);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      return;
    }
    try {
      const res = await updatePassword(parentId, password);
      if (res?.success === true) {
        setNotification({
          type: "success",
          message: "Cập nhật mật khẩu thành công!",
        });
        setShowChangePasswordModal(false);
        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setNotification({
          type: "error",
          message: res?.message || "Có lỗi khi đổi mật khẩu!",
        });
      }
    } catch (error) {
      console.error("Có lỗi khi đổi mật khẩu!");
      setNotification({
        type: "error",
        message: error.message || "Có lỗi khi đổi mật khẩu!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
  };

  useEffect(() => {
    if (notification) {
      if (notification.type === "success") {
        toast.success(notification.message);
      } else {
        toast.error(notification.message);
      }
    }
    setNotification(null);
  }, [notification]);

  const getGenderDisplay = (gender) => {
    switch (gender) {
      case "Male":
        return "Nam";
      case "Female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.type === "success" ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationTriangle />
          )}
          {notification.message}
        </div>
      )}

      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarContainer}>
              <img
                src={
                  imagePreview ||
                  parentInfo.imageUrl ||
                  "https://via.placeholder.com/120x120/2563eb/ffffff?text=Avatar"
                }
                alt="Avatar"
                className={styles.avatarImage}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/120x120/2563eb/ffffff?text=Avatar";
                }}
              />
              <div
                className={styles.avatarOverlay}
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera className={styles.icon} />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleChangeImage}
                style={{ display: "none" }}
              />
            </div>
            {imagePreview && (
              <div className={styles.avatarPreview}>
                <FaInfoCircle />
                <span>Ảnh mới sẽ được cập nhật khi lưu</span>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {parentInfo.name || "Chưa có tên"}
            </h1>
            <p className={styles.profileRole}>
              <FaUser className={styles.icon} />
              {parentInfo.roleName || "Phụ huynh"}
            </p>
          </div>
        </div>
      </div>

      <Container>
        <div className={styles.profileTabs}>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav className={styles.tabNav}>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "personal" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("personal")}
                type="button"
              >
                <FaUser className={styles.tabIcon} />
                Thông tin cá nhân
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "children" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("children")}
                type="button"
              >
                <FaUsers className={styles.tabIcon} />
                Thông tin con em
                {children.length > 0 && (
                  <Badge bg="primary" className="ms-2">
                    {children.length}
                  </Badge>
                )}
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "security" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("security")}
                type="button"
              >
                <FaShieldAlt className={styles.tabIcon} />
                Bảo mật
              </button>
            </Nav>

            <Tab.Content className={styles.tabContent}>
              <Tab.Pane eventKey="personal" className={styles.tabPane}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <FaUser className={styles.icon} />
                    Thông tin cá nhân
                  </h3>
                  <div className="d-flex">
                    {!isEditing ? (
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setIsEditing(true);
                          setFormData(parentInfo);
                          setActiveTab("personal");
                        }}
                      >
                        <FaEdit className={styles.icon} />
                        Chỉnh sửa thông tin
                      </button>
                    ) : (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={handleSave}
                          disabled={loading}
                        >
                          {loading ? (
                            <FaSpinner
                              className={`${styles.icon} ${styles.spinner}`}
                            />
                          ) : (
                            <FaSave className={styles.icon} />
                          )}
                          Lưu thay đổi
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          <FaTimes className={styles.icon} />
                          Hủy bỏ
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <Alert variant="info" className="mb-4">
                    <FaInfoCircle className="me-2" />
                    Bạn có thể cập nhật thông tin cá nhân. Email và ngày sinh
                    không thể thay đổi.
                  </Alert>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaUser className={styles.icon} />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        className={styles.formInput}
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      >
                        {parentInfo.name || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaEnvelope className={styles.icon} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        className={`${styles.formInput} ${styles.disabledInput}`}
                        disabled
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      >
                        {parentInfo.email || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaBirthdayCake className={styles.icon} />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        className={`${styles.formInput} ${styles.disabledInput}`}
                        disabled
                        type="text"
                        value={formData.dateOfBirth || ""}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      >
                        {parentInfo.dateOfBirth
                          ? formatDDMMYYYY(parentInfo.dateOfBirth)
                          : "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaVenusMars className={styles.icon} />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        className={styles.formSelect}
                        value={formData.gender || ""}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      >
                        {parentInfo.gender === "Male"
                          ? "Nam"
                          : parentInfo.gender === "Female"
                          ? "Nữ"
                          : parentInfo.gender === "Other"
                          ? "Khác"
                          : "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaPhone className={styles.icon} />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        className={styles.formInput}
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      >
                        {parentInfo.phone || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>
                      <FaMapMarkerAlt className={styles.icon} />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <textarea
                        className={styles.formInput}
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows="3"
                        placeholder="Nhập địa chỉ"
                        style={{ resize: "vertical", minHeight: "80px" }}
                      />
                    ) : (
                      <div
                        className={`${styles.formInput} ${styles.disabledInput}`}
                        style={{ minHeight: "80px", paddingTop: "12px" }}
                      >
                        {parentInfo.address || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="children" className={styles.tabPane}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <FaUsers className={styles.icon} />
                    Thông tin con em
                  </h3>
                </div>

                {children.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <FaInfoCircle className="me-2" />
                    Chưa có thông tin con em được liên kết với tài khoản này.
                  </Alert>
                ) : (
                  <div className={styles.childrenGrid}>
                    {children.map((child, index) => (
                      <div key={index} className={styles.childCard}>
                        <div className={styles.childHeader}>
                          <div className={styles.childAvatar}>
                            <FaUser className={styles.childAvatarIcon} />
                          </div>
                          <div className={styles.childInfo}>
                            <h4 className={styles.childName}>
                              {child.studentName}
                            </h4>
                            <p className={styles.childClass}>
                              <FaUserGraduate className="me-2" />
                              {child.className}
                            </p>
                          </div>
                        </div>
                        <div className={styles.childDetails}>
                          <div className={styles.childDetail}>
                            <div className={styles.detailLabel}>
                              Mã học sinh
                            </div>
                            <div className={styles.detailValue}>
                              {child.studentNumber}
                            </div>
                          </div>
                          <div className={styles.childDetail}>
                            <div className={styles.detailLabel}>Ngày sinh</div>
                            <div className={styles.detailValue}>
                              {child.dateOfBirth
                                ? formatDDMMYYYY(child.dateOfBirth)
                                : "Chưa cập nhật"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="security" className={styles.tabPane}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <FaShieldAlt className={styles.icon} />
                    Cài đặt bảo mật
                  </h3>
                </div>
                <div className={styles.securityCard}>
                  <div className={styles.securityHeader}>
                    <FaLock className={styles.securityIcon} />
                    <h5 className={styles.securityTitle}>Mật khẩu</h5>
                  </div>
                  <p className={styles.securityDescription}>
                    Cập nhật mật khẩu để bảo vệ tài khoản của bạn. Mật khẩu mới
                    phải có ít nhất 6 ký tự.
                  </p>
                  <button
                    className={styles.changePasswordButton}
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    <FaKey className={styles.icon} />
                    Đổi mật khẩu
                  </button>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>

      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {/* Change Password Modal */}
      <Modal
        show={showChangePasswordModal}
        onHide={() => {
          setShowChangePasswordModal(false);
          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }}
        centered
        className={styles.modal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            <FaLock className={styles.icon} />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <Form>
            <Form.Group className={styles.modalFormGroup}>
              <Form.Label className={styles.formLabel}>
                <FaKey className={styles.icon} />
                Mật khẩu hiện tại
              </Form.Label>
              <Form.Control
                className={styles.formInput}
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({ ...password, currentPassword: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className={styles.modalFormGroup}>
              <Form.Label className={styles.formLabel}>
                <FaKey className={styles.icon} />
                Mật khẩu mới
              </Form.Label>
              <Form.Control
                className={styles.formInput}
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className={styles.modalFormGroup}>
              <Form.Label className={styles.formLabel}>
                <FaKey className={styles.icon} />
                Xác nhận mật khẩu mới
              </Form.Label>
              <Form.Control
                className={styles.formInput}
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={password.confirmNewPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    confirmNewPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setShowChangePasswordModal(false);
              setPassword({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            }}
          >
            <FaTimes className={styles.icon} />
            Hủy
          </button>
          <button
            className={styles.saveButton}
            onClick={handleUpdatePassword}
            disabled={
              !password.currentPassword ||
              !password.newPassword ||
              !password.confirmNewPassword
            }
          >
            <FaSave className={styles.icon} />
            Cập nhật mật khẩu
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
