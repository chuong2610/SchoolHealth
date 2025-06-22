import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Badge,
  InputGroup,
  Form,
  Dropdown,
  Modal,
  Row,
  Col,
  Pagination,
  Alert,
  Nav,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaKey,
  FaTrash,
  FaUserShield,
  FaUserGraduate,
  FaUserFriends,
  FaUserNurse,
  FaFilter,
  FaFileUpload,
  FaChartBar,
  FaFileDownload,
  FaVenusMars,
  FaVenus,
  FaMars,
  FaMapMarkerAlt,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// Styles được import từ main.jsx
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
};

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function để chuyển đổi giới tính từ tiếng Anh sang tiếng Việt
  const translateGender = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return gender || 'Không xác định';
    }
  };

  const [activeTab, setActiveTab] = useState("student");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    let roleName = "";
    switch (activeTab) {
      case "student":
        roleName = "student";
        break;
      case "parent":
        roleName = "parent";
        break;
      case "nurse":
        roleName = "nurse";
        break;
      case "admin":
        roleName = "admin";
        break;
      default:
        roleName = "All";
        break;
    }

    try {
      const response = await axiosInstance.get(`/User/role/${roleName}`);
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch users.");
        setUsers([]);
      }
    } catch (err) {
      setError("Error fetching data: " + (err.response?.data?.message || err.message));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [permUser, setPermUser] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedUsers, setImportedUsers] = useState([]);
  const [importError, setImportError] = useState("");
  const [importedFile, setImportedFile] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Thêm state cho filter
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Lọc danh sách theo tìm kiếm, giới tính và trạng thái
  const filteredUsers = users.filter((user) => {
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Gender filter
    if (filterGender && filterGender !== "all") {
      const userGender = user.gender?.toLowerCase();
      if (filterGender === "male" && userGender !== "male") return false;
      if (filterGender === "female" && userGender !== "female") return false;
      if (filterGender === "other" && userGender !== "other") return false;
    }

    // Status filter (for future use)
    if (filterStatus && filterStatus !== "all") {
      // Add status logic when backend supports it
    }

    return true;
  });

  // Reset filters
  const handleResetFilters = () => {
    setFilterGender("");
    setFilterStatus("");
    setSearch("");
    setShowFilterDropdown(false);
  };

  // Phân trang dựa trên kết quả đã lọc
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Reset trang về 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDownloadTemplate = () => {
    const wsData = [
      ["STT",
        "StudentNumber",
        "StudentName",
        "Gender",
        "Birthday",
        "Grade",
        "ParentName",
        "ParentBirthday",
        "ParentGender",
        "ParentPhone",
        "ParentEmail",
        "Address",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "Mau_Import_Hoc_Sinh.xlsx");
  };
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [permState, setPermState] = useState({
    viewStudents: false,
    viewReports: false,
    recordEvents: false,
    approveMeds: false,
    manageRecords: false,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleShowModal = (type, user = null) => {
    setModalType(type);
    if (user) {
      setNewUser({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
        role: user.role || activeTab, // Use current tab as default role
        password: "", // Don't populate password for edit
        confirmPassword: "",
      });
    } else {
      setNewUser({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        role: activeTab, // Default to current tab role
        password: "",
        confirmPassword: "",
      });
    }
    setShowModal(true);
  };

  const handleShowPermModal = (user) => {
    setPermUser(user);
    setPermState({
      viewStudents: true,
      viewReports: true,
      recordEvents: true,
      approveMeds: true,
      manageRecords: true,
    });
    setShowPermModal(true);
  };

  const handleSaveUser = async () => {
    // Validation
    if (!newUser.name.trim()) {
      alert("Vui lòng nhập họ và tên!");
      return;
    }
    if (!newUser.email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }
    if (!newUser.phone.trim()) {
      alert("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!newUser.role.trim()) {
      alert("Vui lòng chọn vai trò!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Password validation for add mode
    if (modalType === "add") {
      if (!newUser.password.trim()) {
        alert("Vui lòng nhập mật khẩu!");
        return;
      }
      if (newUser.password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newUser.password)) {
        alert("Mật khẩu phải bao gồm chữ hoa, chữ thường và số!");
        return;
      }
      if (newUser.password !== newUser.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
    }

    setSaving(true);
    try {
      // Convert gender to English for API
      const convertGenderToEnglish = (gender) => {
        switch (gender) {
          case 'Nam': return 'Male';
          case 'Nữ': return 'Female';
          case 'Khác': return 'Other';
          default: return gender;
        }
      };

      const userPayload = {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        address: newUser.address.trim() || "",
        phone: newUser.phone.trim(),
        gender: convertGenderToEnglish(newUser.gender) || "",
        role: newUser.role.trim(),
      };

      // Add password for new users
      if (modalType === "add") {
        userPayload.password = newUser.password;
      }

      // Add ID for edit mode
      if (modalType === "edit") {
        userPayload.id = newUser.id;
      }


      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (modalType === "add") {
        response = await axiosInstance.post(`/User`, userPayload);
      } else {
        response = await axiosInstance.put(`/User`, userPayload);
      }


      if (response.data.success) {
        // Success notification
        if (typeof toast !== 'undefined') {
          toast.success(modalType === "add" ? "Thêm tài khoản thành công!" : "Cập nhật tài khoản thành công!");
        } else {
          alert(modalType === "add" ? "Thêm tài khoản thành công!" : "Cập nhật tài khoản thành công!");
        }

        setShowModal(false);
        fetchUsers(); // Refresh the user list

        // Reset form
        setNewUser({
          name: "",
          email: "",
          phone: "",
          address: "",
          gender: "",
          role: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        if (typeof toast !== 'undefined') {
          toast.error("Lỗi: " + (response.data.message || "Không thể lưu thông tin"));
        } else {
          alert("Lỗi: " + (response.data.message || "Không thể lưu thông tin"));
        }
      }
    } catch (err) {

      if (err.response?.status === 400) {
        // Handle validation errors
        const errors = err.response.data?.errors;
        if (errors) {
          let errorMessage = "Dữ liệu không hợp lệ:\n";
          Object.keys(errors).forEach(field => {
            if (errors[field] && Array.isArray(errors[field])) {
              errorMessage += `- ${errors[field].join(', ')}\n`;
            }
          });
          alert(errorMessage);
        } else {
          alert("Dữ liệu không hợp lệ: " + (err.response.data.title || "Vui lòng kiểm tra lại thông tin"));
        }
      } else if (err.response?.status === 409) {
        alert("Email này đã được sử dụng!");
      } else if (err.response?.status === 500) {
        alert("Lỗi server, vui lòng thử lại sau!");
      } else {
        alert("Lỗi: " + (err.response?.data?.title || err.response?.data?.message || err.message));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axiosInstance.delete(`/User/${userToDelete?.id}`);
      if (response.data.success) {
        toast.success("Xóa người dùng thành công!");
        fetchUsers(); // Refresh the user list
      } else {
        toast.error("Lỗi khi xóa người dùng: " + (response.data.message || "Lỗi không xác định"));
      }
    } catch (err) {
      toast.error("Lỗi khi xóa người dùng: " + (err.response?.data?.message || err.message));
    }
    setShowDeleteModal(false);
  };

  const handleSavePermissions = () => {
    // Xử lý lưu quyền
    setShowPermModal(false);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setUsers(users.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, status: 'Hoạt động' }
            : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, status: 'Đã khóa' }
            : user
        ));
        break;
      case 'delete':
        // This part needs to be updated to call the API for bulk delete
        // For now, I'm commenting it out as handleDeleteUser handles individual deletion.
        // setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        alert("Bulk delete not yet implemented via API. Please delete individually.");
        break;
      default:
        break;
    }
    setSelectedUsers([]);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(prev =>
      prev.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  // Thêm hàm chuyển đổi ngày Excel
  const formatExcelDate = (excelDate) => {
    if (!excelDate) return "";
    if (typeof excelDate === "number") {
      const date = XLSX.SSF.parse_date_code(excelDate);
      if (!date) return "";
      // yyyy-MM-dd
      return `${date.y}-${date.m.toString().padStart(2, "0")}-${date.d.toString().padStart(2, "0")}`;
    }
    // Nếu là chuỗi dd/MM/yyyy hoặc d/M/yyyy
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(excelDate)) {
      const [d, m, y] = excelDate.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    // Nếu là chuỗi yyyy-MM-dd thì giữ nguyên
    if (/^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
      return excelDate;
    }
    return excelDate;
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    setImportedFile(file); // Lưu file gốc để gửi lên server
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!data || data.length < 2) {
        setImportError("File không hợp lệ hoặc không có dữ liệu!");
        setImportedUsers([]);
        return;
      }
      // Mapping đầy đủ các trường theo file mẫu, chuẩn hóa ngày sinh
      const rows = data.slice(1);
      const mappedUsers = rows.map((row, idx) => ({
        id: users.length + idx + 1,
        studentId: row[1] || "",
        name: row[2] || "",
        gender: row[3] || "",
        birthday: formatExcelDate(row[4]),
        grade: row[5] || "",
        parentName: row[6] || "",
        parentBirth: formatExcelDate(row[7]),
        parentGender: row[8] || "",
        parentPhone: row[9] ? String(row[9]) : "",
        parentEmail: row[10] || "",
        address: row[11] || "",
        role: "Học sinh",
        status: "Hoạt động",
      }));
      setImportedUsers(mappedUsers);
      setImportError("");
    };
    reader.onerror = () => setImportError("Không đọc được file!");
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    if (!importedFile) return;
    const formData = new FormData();
    formData.append('file', importedFile);
    try {
      const res = await axiosInstance.post(
        '/Excel/import-students-and-parents',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data && res.data.success) {
        toast.success('Import thành công!');
        fetchUsers(); // Refresh user list
        setShowImportModal(false);
        setImportedUsers([]);
        setImportedFile(null);
      } else {
        toast.error('Import thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      toast.error('Import thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderActivityLogModal = () => (
    <Modal show={showActivityLog} onHide={() => setShowActivityLog(false)} size="lg" dialogClassName="dashboard-card-effect" contentClassName="bg-dark text-light" style={{ borderRadius: '20px' }}>
      <Modal.Header closeButton>
        <Modal.Title>
          Lịch sử hoạt động - {selectedUserActivity?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="activity-timeline">
          {[
            { date: '2024-03-15 14:30', action: 'Đăng nhập hệ thống' },
            { date: '2024-03-15 13:45', action: 'Cập nhật thông tin cá nhân' },
            { date: '2024-03-14 16:20', action: 'Xem báo cáo sức khỏe' },
            { date: '2024-03-14 10:15', action: 'Đăng nhập hệ thống' },
          ].map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-date">{activity.date}</div>
              <div className="activity-content">{activity.action}</div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );

  const renderStatsModal = () => (
    <Modal show={showStats} onHide={() => setShowStats(false)} size="lg" dialogClassName="dashboard-card-effect" contentClassName="bg-dark text-light" style={{ borderRadius: '20px' }}>
      <Modal.Header closeButton>
        <Modal.Title>Thống kê người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4">
          <Col md={4}>
            <Card className="dashboard-card-effect mb-3" style={{ background: 'var(--secondary-dark)', color: 'var(--text-light)', borderRadius: '20px', border: 'none' }}>
              <Card.Body>
                <h6 className="stat-title">Tổng số người dùng</h6>
                <h3 className="stat-value">{users.length}</h3>
                <div className="stat-chart">
                  {/* Thêm biểu đồ mini ở đây */}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dashboard-card-effect mb-3" style={{ background: 'var(--secondary-dark)', color: 'var(--text-light)', borderRadius: '20px', border: 'none' }}>
              <Card.Body>
                <h6 className="stat-title">Người dùng hoạt động</h6>
                <h3 className="stat-value">
                  {users.filter(u => u.status === 'Hoạt động').length}
                </h3>
                <div className="stat-chart">
                  {/* Thêm biểu đồ mini ở đây */}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dashboard-card-effect mb-3" style={{ background: 'var(--secondary-dark)', color: 'var(--text-light)', borderRadius: '20px', border: 'none' }}>
              <Card.Body>
                <h6 className="stat-title">Người dùng mới (30 ngày)</h6>
                <h3 className="stat-value">12</h3>
                <div className="stat-chart">
                  {/* Thêm biểu đồ mini ở đây */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );

  const renderAddUserModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title className="admin-modal-title">
          {modalType === "add" ? (
            <>
              <FaUserPlus />
              Thêm tài khoản mới
            </>
          ) : (
            <>
              <FaEdit />
              Chỉnh sửa tài khoản
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Basic Info Section */}
          <div className="row">
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <FaUser />
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="admin-form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <FaUserShield />
                  Vai trò
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="admin-form-select"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="student">Học sinh</option>
                  <option value="parent">Phụ huynh</option>
                  <option value="nurse">Nhân viên y tế</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="admin-form-control"
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <i className="fas fa-phone"></i>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="admin-form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <FaVenusMars />
                  Giới tính
                </label>
                <select
                  value={newUser.gender}
                  onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                  className="admin-form-select"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              <FaMapMarkerAlt />
              Địa chỉ
            </label>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              className="admin-form-control"
            />
          </div>

          {/* Password Section - Only for Add Mode */}
          {modalType === "add" && (
            <>
              <div className="admin-form-section-divider" style={{
                margin: '1.5rem 0',
                padding: '0.75rem 0',
                borderTop: '1px solid #E0E0E0',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  left: '1rem',
                  background: 'white',
                  padding: '0 0.5rem',
                  color: '#757575',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  <FaKey style={{ marginRight: '0.5rem', color: '#FF9500' }} />
                  Thông tin bảo mật
                </span>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      <FaKey />
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="admin-form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      <FaKey />
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      className="admin-form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF8F3, #FDF4FF)',
                border: '1px solid rgba(255, 149, 0, 0.2)',
                borderRadius: '8px',
                padding: '0.875rem',
                fontSize: '0.8rem',
                color: '#757575'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#424242' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#FF9500' }} />
                  Yêu cầu mật khẩu:
                </div>
                <ul style={{ margin: '0', paddingLeft: '1.25rem' }}>
                  <li>Ít nhất 6 ký tự</li>
                  <li>Bao gồm chữ hoa và chữ thường</li>
                  <li>Ít nhất 1 số</li>
                </ul>
              </div>
            </>
          )}

          {/* Password Change Option for Edit Mode */}
          {modalType === "edit" && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF8F3, #FDF4FF)',
              border: '1px solid rgba(255, 149, 0, 0.2)',
              borderRadius: '8px',
              padding: '0.875rem',
              fontSize: '0.875rem',
              color: '#757575',
              marginTop: '1rem'
            }}>
              <i className="fas fa-lock" style={{ marginRight: '0.5rem', color: '#FF9500' }} />
              Để thay đổi mật khẩu, vui lòng sử dụng chức năng "Đặt lại mật khẩu" riêng biệt.
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="admin-secondary-btn" onClick={() => setShowModal(false)}>
          Hủy
        </button>
        <button
          className="admin-primary-btn"
          onClick={handleSaveUser}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>
              Đang lưu...
            </>
          ) : (
            modalType === "add" ? "Thêm tài khoản" : "Cập nhật"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="admin-accounts-container"
    >
      <div className="admin-accounts-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="admin-accounts-title">
              <FaUserShield className="me-3" />
              Quản lý tài khoản
            </h1>
            <p className="admin-accounts-subtitle">Quản lý và theo dõi tất cả tài khoản trong hệ thống với giao diện gradient cam tím đẹp mắt</p>
          </div>
          <div className="d-flex gap-3">
            <button
              className="admin-secondary-btn"
              onClick={() => setShowStats(true)}
            >
              <FaChartBar />
              Thống kê
            </button>

            {/* Add User Dropdown */}
            <Dropdown>
              <Dropdown.Toggle
                className="admin-primary-btn"
                style={{
                  background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaPlus />
                Thêm mới
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 149, 0, 0.2)',
                  boxShadow: '0 8px 32px rgba(255, 149, 0, 0.15)',
                  padding: '0.5rem 0',
                  minWidth: '200px'
                }}
              >
                <Dropdown.Item
                  onClick={() => handleShowModal('add')}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #F0F0F0'
                  }}
                  className="dropdown-item-hover"
                >
                  <FaUserPlus style={{ color: '#FF9500' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#424242' }}>Thêm tài khoản</div>
                    <div style={{ fontSize: '0.75rem', color: '#757575' }}>Tạo tài khoản mới thủ công</div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => setShowImportModal(true)}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #F0F0F0'
                  }}
                  className="dropdown-item-hover"
                >
                  <FaFileUpload style={{ color: '#FF9500' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#424242' }}>Import từ Excel</div>
                    <div style={{ fontSize: '0.75rem', color: '#757575' }}>Nhập nhiều tài khoản cùng lúc</div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={handleDownloadTemplate}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem'
                  }}
                  className="dropdown-item-hover"
                >
                  <FaFileDownload style={{ color: '#FF9500' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#424242' }}>Tải file mẫu</div>
                    <div style={{ fontSize: '0.75rem', color: '#757575' }}>Tải về file Excel mẫu</div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <div className="flex-grow-1">
          <Nav variant="pills" className="admin-accounts-nav">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "student"}
                onClick={() => setActiveTab("student")}
                data-role="student"
                className={activeTab === "student" ? "active" : ""}
              >
                <FaUserGraduate /> Học sinh
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "parent"}
                onClick={() => setActiveTab("parent")}
                data-role="parent"
                className={activeTab === "parent" ? "active" : ""}
              >
                <FaUserFriends /> Phụ huynh
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "nurse"}
                onClick={() => setActiveTab("nurse")}
                data-role="nurse"
                className={activeTab === "nurse" ? "active" : ""}
              >
                <FaUserNurse /> Nhân viên y tế
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "admin"}
                onClick={() => setActiveTab("admin")}
                data-role="admin"
                className={activeTab === "admin" ? "active" : ""}
              >
                <FaUserShield /> Quản trị viên
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="admin-accounts-search-bar">
            <InputGroup style={{ flex: 1 }}>
              <InputGroup.Text className="bg-white border-end-0" style={{ borderRadius: '12px 0 0 12px', border: '2px solid rgba(255, 149, 0, 0.2)', borderRight: 0 }}>
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input border-start-0"
                style={{ borderRadius: '0 12px 12px 0' }}
              />
            </InputGroup>

            {/* Filter Dropdown */}
            <Dropdown show={showFilterDropdown} onToggle={setShowFilterDropdown}>
              <Dropdown.Toggle
                className="admin-filter-btn"
                style={{
                  background: (filterGender || filterStatus) ?
                    'linear-gradient(135deg, #FF9500, #9C27B0)' :
                    'linear-gradient(135deg, #FF9500, #9C27B0)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                <FaFilter />
                Lọc
                {(filterGender || filterStatus) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '16px',
                      height: '16px',
                      background: '#F44336',
                      borderRadius: '50%',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    •
                  </span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  minWidth: '280px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 149, 0, 0.2)',
                  boxShadow: '0 8px 32px rgba(255, 149, 0, 0.15)',
                  padding: '1rem'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#424242',
                    fontSize: '0.875rem'
                  }}>
                    <FaVenusMars style={{ marginRight: '0.5rem', color: '#FF9500' }} />
                    Lọc theo giới tính
                  </label>
                  <Form.Select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    style={{
                      border: '2px solid rgba(255, 149, 0, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Tất cả giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#424242',
                    fontSize: '0.875rem'
                  }}>
                    <i className="fas fa-toggle-on" style={{ marginRight: '0.5rem', color: '#FF9500' }} />
                    Lọc theo trạng thái
                  </label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      border: '2px solid rgba(255, 149, 0, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Đã khóa</option>
                  </Form.Select>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E0E0E0'
                }}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleResetFilters}
                    style={{ flex: 1, fontSize: '0.875rem' }}
                  >
                    Xóa bộ lọc
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowFilterDropdown(false)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                      border: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Accounts Table */}
          <div className="admin-accounts-table-container">
            <table className="admin-accounts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>
                    <FaMapMarkerAlt className="me-2" />
                    Địa chỉ
                  </th>
                  <th>
                    <FaVenusMars className="me-2" />
                    Giới tính
                  </th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="admin-loading">
                        <div className="admin-loading-spinner"></div>
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="p-4 text-danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="p-4 text-muted">
                        <i className="fas fa-users me-2"></i>
                        Chưa có tài khoản nào cho vai trò này
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="admin-user-profile">
                          <div className="admin-user-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="admin-user-info">
                            <div className="admin-user-name">{user.name}</div>
                            <div className="admin-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td title={user.address}>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {user.address}
                      </td>
                      <td>
                        <div className={`admin-role-badge ${(user.gender?.toLowerCase() === 'male' || user.gender === 'Nam') ? 'student' :
                          (user.gender?.toLowerCase() === 'female' || user.gender === 'Nữ') ? 'parent' : 'nurse'
                          }`}>
                          {(user.gender?.toLowerCase() === 'male' || user.gender === 'Nam') ?
                            <FaMars /> :
                            (user.gender?.toLowerCase() === 'female' || user.gender === 'Nữ') ?
                              <FaVenus /> :
                              <FaVenusMars />}
                          {translateGender(user.gender)}
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                            <button
                              className="admin-table-btn edit"
                              onClick={() => handleShowModal('edit', user)}
                            >
                              <FaEdit />
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Xóa</Tooltip>}>
                            <button
                              className="admin-table-btn delete"
                              onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                            >
                              <FaTrash />
                            </button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-pagination-container">
            <div className="text-muted">
              Hiển thị {paginatedUsers.length} / {filteredUsers.length} kết quả
            </div>
            <Pagination className="admin-pagination">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <FaChevronLeft />
              </Pagination.Prev>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <FaChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {renderAddUserModal()}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="accounts-delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle"></i>
            Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <i className="fas fa-user-times"></i>
          <h5>Bạn có chắc chắn muốn xóa tài khoản?</h5>
          <p><strong>{userToDelete?.name}</strong></p>
          <p className="text-muted">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            <i className="fas fa-trash"></i>
            Xóa tài khoản
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Permissions Modal */}
      <Modal show={showPermModal} onHide={() => setShowPermModal(false)} className="accounts-permissions-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-shield"></i>
            Phân quyền cho {permUser?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="permission-group">
            <h6 className="permission-title">
              <i className="fas fa-eye"></i>
              Quyền xem
            </h6>
            <Form.Check
              type="checkbox"
              label="Xem danh sách học sinh"
              checked={permState.viewStudents}
              onChange={(e) =>
                setPermState({
                  ...permState,
                  viewStudents: e.target.checked,
                })
              }
            />
            <Form.Check
              type="checkbox"
              label="Xem báo cáo"
              checked={permState.viewReports}
              onChange={(e) =>
                setPermState({
                  ...permState,
                  viewReports: e.target.checked,
                })
              }
            />
          </div>
          <div className="permission-group">
            <h6 className="permission-title">
              <i className="fas fa-cogs"></i>
              Quyền thao tác
            </h6>
            <Form.Check
              type="checkbox"
              label="Ghi nhận sự kiện y tế"
              checked={permState.recordEvents}
              onChange={(e) =>
                setPermState({
                  ...permState,
                  recordEvents: e.target.checked,
                })
              }
            />
            <Form.Check
              type="checkbox"
              label="Duyệt thuốc"
              checked={permState.approveMeds}
              onChange={(e) =>
                setPermState({
                  ...permState,
                  approveMeds: e.target.checked,
                })
              }
            />
            <Form.Check
              type="checkbox"
              label="Quản lý hồ sơ"
              checked={permState.manageRecords}
              onChange={(e) =>
                setPermState({
                  ...permState,
                  manageRecords: e.target.checked,
                })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSavePermissions}>
            <i className="fas fa-save"></i>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Activity Log Modal */}
      {renderActivityLogModal()}

      {/* Stats Modal */}
      {renderStatsModal()}

      {/* Import User Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} className="admin-modal" size="lg">
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
          color: 'white',
          borderBottom: 'none',
          padding: '2rem'
        }}>
          <Modal.Title style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 0
          }}>
            <FaFileUpload />
            Nhập tài khoản từ Excel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem', background: 'white' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">
              <i className="fas fa-file-excel" style={{ color: '#FF9500' }}></i>
              Chọn file Excel
            </label>
            <div style={{
              border: '2px dashed rgba(255, 149, 0, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.05), rgba(156, 39, 176, 0.05))',
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                marginBottom: '1rem',
                color: '#FF9500',
                fontSize: '3rem'
              }}>
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h6 style={{
                fontWeight: '600',
                color: '#424242',
                marginBottom: '0.5rem'
              }}>
                Kéo thả file hoặc click để chọn
              </h6>
              <p style={{
                color: '#757575',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                Hỗ trợ file .xlsx, .xls (tối đa 10MB)
              </p>
              <Form.Control
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                Chọn file
              </div>
            </div>
          </div>

          {importError && (
            <Alert variant="danger" style={{
              borderRadius: '8px',
              border: '1px solid #F44336',
              background: 'linear-gradient(135deg, #FFEBEE, #FCE4EC)',
              marginTop: '1rem'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              {importError}
            </Alert>
          )}

          {importedUsers.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #E8F5E8, #F3E5F5)',
                borderRadius: '8px',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <i className="fas fa-check-circle" style={{ color: '#4CAF50', fontSize: '1.25rem' }}></i>
                <div>
                  <div style={{ fontWeight: '600', color: '#2E7D32' }}>
                    Phát hiện {importedUsers.length} tài khoản
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#757575' }}>
                    Xem trước dữ liệu trước khi import
                  </div>
                </div>
              </div>

              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 149, 0, 0.2)',
                borderRadius: '8px'
              }}>
                <Table style={{ margin: 0, fontSize: '0.875rem' }}>
                  <thead style={{
                    background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                    color: 'white',
                    position: 'sticky',
                    top: 0
                  }}>
                    <tr>
                      <th style={{ padding: '0.75rem' }}>STT</th>
                      <th style={{ padding: '0.75rem' }}>Họ tên</th>
                      <th style={{ padding: '0.75rem' }}>Email</th>
                      <th style={{ padding: '0.75rem' }}>SĐT</th>
                      <th style={{ padding: '0.75rem' }}>Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedUsers.slice(0, 10).map((u, i) => (
                      <tr key={i} style={{
                        background: i % 2 === 0 ? '#FAFAFA' : 'white'
                      }}>
                        <td style={{ padding: '0.75rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{u.name}</td>
                        <td style={{ padding: '0.75rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem' }}>{u.phone}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {u.role || activeTab}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {importedUsers.length > 10 && (
                      <tr>
                        <td colSpan="5" style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontStyle: 'italic',
                          color: '#757575'
                        }}>
                          ... và {importedUsers.length - 10} tài khoản khác
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{
          background: '#FAFAFA',
          borderTop: '1px solid #E0E0E0',
          padding: '1.5rem 2rem'
        }}>
          <button
            className="admin-secondary-btn"
            onClick={() => setShowImportModal(false)}
          >
            Hủy
          </button>
          <button
            className="admin-primary-btn"
            onClick={handleConfirmImport}
            disabled={importedUsers.length === 0}
            style={{
              opacity: importedUsers.length === 0 ? 0.5 : 1
            }}
          >
            <FaFileUpload style={{ marginRight: '0.5rem' }} />
            Nhập {importedUsers.length} tài khoản
          </button>
        </Modal.Footer>
      </Modal>

      {/* FAB - Floating Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onMouseEnter={() => setFabOpen(true)}
        onMouseLeave={() => setFabOpen(false)}
      >
        {/* Nút chính */}
        <button
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            fontSize: 22,
            border: 'none',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: fabOpen ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
            marginBottom: 12,
          }}
        >
          <FaPlus />
        </button>

        {/* Menu các chức năng */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: fabOpen ? 1 : 0,
            transform: fabOpen ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: fabOpen ? 'auto' : 'none',
          }}
        >
          {/* Thêm tài khoản */}
          <button
            onClick={() => handleShowModal('add')}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#fff',
              color: '#3b82f6',
              fontSize: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = '#fff';
              e.target.style.transform = 'scale(1.08)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.12)';
            }}
            title="Thêm tài khoản"
          >
            <FaUserPlus />
          </button>

          {/* Nhập từ file */}
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#fff',
              color: '#3b82f6',
              fontSize: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = '#fff';
              e.target.style.transform = 'scale(1.08)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.12)';
            }}
            title="Nhập từ file"
          >
            <FaFileUpload />
          </button>

          {/* Tải file mẫu */}
          <button
            onClick={handleDownloadTemplate}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#fff',
              color: '#3b82f6',
              fontSize: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = '#fff';
              e.target.style.transform = 'scale(1.08)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.12)';
            }}
            title="Tải file mẫu"
          >
            <FaFileDownload />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Accounts;
