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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// Styles được import từ main.jsx
import * as XLSX from "xlsx";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5182";

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
      const response = await axios.get(`${API_BASE_URL}/api/User/role/${roleName}`);
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

  // Thêm state phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Lọc danh sách theo tìm kiếm và vai trò
  const filteredUsers = users.filter((user) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

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
      });
    } else {
      setNewUser({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // Skip date validation since we're not sending dateOfBirth
    // if (newUser.birthday) {
    //   const date = new Date(newUser.birthday);
    //   if (isNaN(date.getTime())) {
    //     alert("Ngày sinh không hợp lệ!");
    //     return;
    //   }
    //   
    //   // Check if date is not in the future
    //   const today = new Date();
    //   if (date > today) {
    //     alert("Ngày sinh không thể là ngày trong tương lai!");
    //     return;
    //   }
    //   
    //   // Check if date is reasonable (not too old)
    //   const hundredYearsAgo = new Date();
    //   hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    //   if (date < hundredYearsAgo) {
    //     alert("Ngày sinh không hợp lệ!");
    //     return;
    //   }
    // }

    setSaving(true);
    try {
      // Skip date formatting since we're not sending dateOfBirth
      // let formattedDate = null;
      // if (newUser.birthday) {
      //   const date = new Date(newUser.birthday);
      //   if (!isNaN(date.getTime())) {
      //     formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      //   }
      // }

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
      };

      // Add ID for edit mode
      if (modalType === "edit") {
        userPayload.id = newUser.id;
      }

      // Send payload directly with exact fields required
      const payload = userPayload;

      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      console.log("API Endpoint:", `${API_BASE_URL}/api/User`);
      console.log("Method:", modalType === "add" ? "POST" : "PUT");

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (modalType === "add") {
        response = await axios.post(`${API_BASE_URL}/api/User`, payload, config);
      } else {
        response = await axios.put(`${API_BASE_URL}/api/User`, payload, config);
      }

      console.log("API Response:", response.data);

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
        });
      } else {
        if (typeof toast !== 'undefined') {
          toast.error("Lỗi: " + (response.data.message || "Không thể lưu thông tin"));
        } else {
          alert("Lỗi: " + (response.data.message || "Không thể lưu thông tin"));
        }
      }
    } catch (err) {
      console.error("Error saving user:", err);

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
      const response = await axios.delete(`${API_BASE_URL}/api/User/${userToDelete?.id}`);
      if (response.data.success) {
        alert("User deleted successfully!");
        fetchUsers(); // Refresh the user list
      } else {
        alert("Failed to delete user: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error deleting user: " + (err.response?.data?.message || err.message));
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
      const res = await axios.post(
        'http://localhost:5182/api/Excel/import-students-and-parents',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data && res.data.success) {
        alert('Import thành công!');
        // TODO: Gọi API lấy lại danh sách user mới nhất nếu có
        setShowImportModal(false);
        setImportedUsers([]);
        setImportedFile(null);
      } else {
        alert('Import thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      alert('Import thất bại!');
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
    <Modal show={showModal} onHide={() => setShowModal(false)} className="accounts-modal">
      <Modal.Header closeButton>
        <Modal.Title>
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
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  <i className="fas fa-user"></i>
                  Họ và tên
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  <i className="fas fa-envelope"></i>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <i className="fas fa-phone"></i>
                  Số điện thoại
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <i className="fas fa-venus-mars"></i>
                  Giới tính
                </Form.Label>
                <div className="gender-select-wrapper">
                  <Form.Select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  <i className="fas fa-map-marker-alt"></i>
                  Địa chỉ
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveUser}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang lưu...
            </>
          ) : (
            modalType === "add" ? "Thêm tài khoản" : "Cập nhật"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="accounts-container"
    >
      <div className="accounts-header" style={{ background: '#f4f8fb', boxShadow: '0 4px 16px rgba(91,134,229,0.10)', borderRadius: 24, padding: '2.2rem 2rem 1.5rem 2rem', fontFamily: 'Inter,Poppins,sans-serif' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="accounts-title" style={{ fontWeight: 800, fontSize: '2.2rem', color: '#222', letterSpacing: 0.5 }}>
              <span role="img" aria-label="calendar">📆</span> Quản lý tài khoản
            </h1>
            <p className="accounts-subtitle" style={{ fontSize: '1.05rem', color: '#8a99b3', marginTop: 4 }}>Quản lý và theo dõi tất cả tài khoản trong hệ thống</p>
          </div>
          <Button
            variant="light"
            className="d-flex align-items-center gap-2"
            style={{ fontWeight: 600, borderRadius: 16, boxShadow: '0 2px 8px rgba(91,134,229,0.10)' }}
            onClick={() => setShowStats(true)}
          >
            <FaChartBar style={{ color: '#5b86e5' }} />
            Thống kê
          </Button>
        </div>
      </div>

      <div className="d-flex">
        <div className="flex-grow-1">
          <Nav variant="pills" className="nav-pills mb-4">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "student"}
                onClick={() => setActiveTab("student")}
                data-role="student"
                className={activeTab === "student" ? "active" : ""}
              >
                <FaUserGraduate style={{ fontSize: 20, marginRight: 6 }} /> Học sinh
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "parent"}
                onClick={() => setActiveTab("parent")}
                data-role="parent"
                className={activeTab === "parent" ? "active" : ""}
              >
                <FaUserFriends style={{ fontSize: 20, marginRight: 6 }} /> Phụ huynh
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "nurse"}
                onClick={() => setActiveTab("nurse")}
                data-role="nurse"
                className={activeTab === "nurse" ? "active" : ""}
              >
                <FaUserNurse style={{ fontSize: 20, marginRight: 6 }} /> Nhân viên y tế
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "admin"}
                onClick={() => setActiveTab("admin")}
                data-role="admin"
                className={activeTab === "admin" ? "active" : ""}
              >
                <FaUserShield style={{ fontSize: 20, marginRight: 6 }} /> Quản trị viên
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="search-filter-bar" style={{ background: '#fff', borderRadius: 32, boxShadow: '0 2px 8px rgba(91,134,229,0.10)', padding: '1.1rem 1.5rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <InputGroup style={{ flex: 1 }}>
              <InputGroup.Text className="bg-white border-end-0" style={{ borderRadius: '32px 0 0 32px', border: '1.5px solid #e0e7ef', borderRight: 0 }}>
                <FaSearch className="text-muted" style={{ fontSize: 18 }} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input border-start-0"
                style={{ borderRadius: '0 32px 32px 0', border: '1.5px solid #e0e7ef', fontSize: '1.08rem', fontFamily: 'Inter,Poppins,sans-serif' }}
              />
            </InputGroup>
            <Button variant="outline-primary" style={{ borderRadius: 32, border: '1.5px solid #e0e7ef', marginLeft: 8, fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, width: 44, boxShadow: 'none' }}>
              <FaFilter />
            </Button>
          </div>

          {/* Accounts Table */}
          <div className="accounts-table-container">
            {/* Table Header */}
            <div className="accounts-table-header">
              <div className="header-cell">ID</div>
              <div className="header-cell">Tên</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Số điện thoại</div>
              <div className="header-cell">
                <FaMapMarkerAlt />
                Địa chỉ
              </div>
              <div className="header-cell">
                <FaVenusMars />
                Giới tính
              </div>
              <div className="header-cell">Thao tác</div>
            </div>

            {/* Table Body */}
            <div className="accounts-table-body">
              {loading ? (
                <div className="accounts-loading-state">
                  <div className="accounts-loading-spinner"></div>
                  <h4>Đang tải dữ liệu...</h4>
                </div>
              ) : error ? (
                <div className="accounts-error-state">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h4>Có lỗi xảy ra</h4>
                  <p>{error}</p>
                </div>
              ) : paginatedUsers.length === 0 ? (
                <div className="accounts-empty-state">
                  <i className="fas fa-users"></i>
                  <h4>Chưa có dữ liệu</h4>
                  <p>Chưa có tài khoản nào cho vai trò này.</p>
                </div>
              ) : (
                paginatedUsers.map((user) => (
                  <div key={user.id} className="accounts-table-row">
                    <div className="accounts-table-cell accounts-id-cell">
                      {user.id}
                    </div>
                    <div className="accounts-table-cell accounts-name-cell">
                      {user.name}
                    </div>
                    <div className="accounts-table-cell accounts-email-cell">
                      {user.email}
                    </div>
                    <div className="accounts-table-cell accounts-phone-cell">
                      {user.phone}
                    </div>
                    <div className="accounts-table-cell accounts-address-cell" title={user.address}>
                      <FaMapMarkerAlt style={{ marginRight: 4, color: '#5865f2' }} />
                      {user.address}
                    </div>
                    <div className="accounts-table-cell accounts-gender-cell">
                      <div className={`accounts-gender-badge ${(user.gender?.toLowerCase() === 'male' || user.gender === 'Nam') ? 'male' :
                        (user.gender?.toLowerCase() === 'female' || user.gender === 'Nữ') ? 'female' : 'other'
                        }`}>
                        {(user.gender?.toLowerCase() === 'male' || user.gender === 'Nam') ?
                          <FaMars /> :
                          (user.gender?.toLowerCase() === 'female' || user.gender === 'Nữ') ?
                            <FaVenus /> :
                            <FaVenusMars />}
                        {translateGender(user.gender)}
                      </div>
                    </div>
                    <div className="accounts-table-cell accounts-actions-cell">
                      <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                        <button
                          className="accounts-action-btn edit"
                          onClick={() => handleShowModal('edit', user)}
                        >
                          <FaEdit />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Xóa</Tooltip>}>
                        <button
                          className="accounts-action-btn delete"
                          onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                        >
                          <FaTrash />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="accounts-pagination-wrapper">
            <div className="accounts-pagination-info">
              Hiển thị {paginatedUsers.length} / {filteredUsers.length} kết quả
            </div>
            <div className="accounts-pagination">
              <button
                className="accounts-pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`accounts-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="accounts-pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
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
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} className="accounts-import-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-file-upload"></i>
            Nhập tài khoản từ Excel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <i className="fas fa-file-excel"></i>
              Chọn file Excel
            </Form.Label>
            <div className="file-upload-area">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Kéo thả file hoặc click để chọn file Excel</p>
              <Form.Control type="file" accept=".xlsx,.xls" onChange={handleImportExcel} />
            </div>
          </Form.Group>
          {importError && <Alert variant="danger" className="mt-2">{importError}</Alert>}
          {importedUsers.length > 0 && (
            <div className="preview-table-container">
              <h6><strong>Xem trước dữ liệu sẽ import:</strong></h6>
              <Table className="preview-table" striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>StudentID</th>
                    <th>Họ tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Lớp</th>
                    <th>Tên phụ huynh</th>
                    <th>Ngày sinh PH</th>
                    <th>Giới tính PH</th>
                    <th>SĐT PH</th>
                    <th>Email PH</th>
                    <th>Địa chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {importedUsers.map((u, i) => (
                    <tr key={i}>
                      <td>{u.studentId}</td>
                      <td>{u.name}</td>
                      <td>{u.gender}</td>
                      <td>{u.birthday}</td>
                      <td>{u.grade}</td>
                      <td>{u.parentName}</td>
                      <td>{u.parentBirth}</td>
                      <td>{u.parentGender}</td>
                      <td>{u.parentPhone}</td>
                      <td>{u.parentEmail}</td>
                      <td>{u.address}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmImport}
            disabled={importedUsers.length === 0}
          >
            <i className="fas fa-download"></i>
            Nhập dữ liệu
          </Button>
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
