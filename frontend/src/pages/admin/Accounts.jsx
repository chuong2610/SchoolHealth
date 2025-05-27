import React, { useState } from "react";
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
} from "react-bootstrap";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaKey,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";

const initialUsers = [
  {
    id: "#001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    role: "Học sinh",
    status: "Hoạt động",
    permissions: {
      viewStudents: true,
      recordEvents: false,
      approveMeds: false,
      manageRecords: false,
      viewReports: false,
    },
  },
  {
    id: "#002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0987654321",
    role: "Phụ huynh",
    status: "Hoạt động",
    permissions: {
      viewStudents: true,
      recordEvents: false,
      approveMeds: false,
      manageRecords: false,
      viewReports: false,
    },
  },
  {
    id: "#003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0911222333",
    role: "Nhân viên y tế",
    status: "Đã khóa",
    permissions: {
      viewStudents: true,
      recordEvents: true,
      approveMeds: true,
      manageRecords: true,
      viewReports: false,
    },
  },
  {
    id: "#004",
    name: "Admin D",
    email: "admind@email.com",
    phone: "0999888777",
    role: "Admin",
    status: "Hoạt động",
    permissions: {
      viewStudents: true,
      recordEvents: true,
      approveMeds: true,
      manageRecords: true,
      viewReports: true,
    },
  },
];

const roleOptions = [
  "Tất cả",
  "Học sinh",
  "Phụ huynh",
  "Nhân viên y tế",
  "Admin",
];

const defaultPermissions = {
  "Học sinh": {
    viewStudents: false,
    recordEvents: false,
    approveMeds: false,
    manageRecords: false,
    viewReports: false,
  },
  "Phụ huynh": {
    viewStudents: true,
    recordEvents: false,
    approveMeds: false,
    manageRecords: false,
    viewReports: false,
  },
  "Nhân viên y tế": {
    viewStudents: true,
    recordEvents: true,
    approveMeds: true,
    manageRecords: true,
    viewReports: false,
  },
  Admin: {
    viewStudents: true,
    recordEvents: true,
    approveMeds: true,
    manageRecords: true,
    viewReports: true,
  },
};

const Accounts = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPermModal, setShowPermModal] = useState(false);
  const [permUser, setPermUser] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Học sinh",
    status: "Hoạt động",
    password: "",
    confirmPassword: "",
    permissions: { ...defaultPermissions["Học sinh"] },
  });
  const [permState, setPermState] = useState({});

  // Lọc danh sách theo tìm kiếm và vai trò
  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "Tất cả" || user.role === roleFilter;
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  // Xử lý mở modal thêm/sửa
  const handleShowModal = (type, user = null) => {
    setModalType(type);
    if (type === "edit" && user) {
      setFormState({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: "",
        confirmPassword: "",
        permissions: { ...user.permissions },
      });
    } else {
      setFormState({
        name: "",
        email: "",
        phone: "",
        role: "Học sinh",
        status: "Hoạt động",
        password: "",
        confirmPassword: "",
        permissions: { ...defaultPermissions["Học sinh"] },
      });
    }
    setSelectedUser(user);
    setShowModal(true);
  };

  // Xử lý thay đổi vai trò để set quyền mặc định
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormState((prev) => ({
      ...prev,
      role,
      permissions: { ...defaultPermissions[role] },
    }));
  };

  // Xử lý lưu người dùng (thêm hoặc sửa)
  const handleSaveUser = (e) => {
    e.preventDefault();
    // Validate mật khẩu khi thêm mới hoặc đổi mật khẩu
    if (
      modalType === "add" &&
      (!formState.password || formState.password.length < 6)
    ) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (formState.password !== formState.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    const newUser = {
      id:
        modalType === "add"
          ? `#${Math.floor(Math.random() * 1000)}`
          : selectedUser.id,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      role: formState.role,
      status: formState.status,
      permissions: { ...formState.permissions },
    };
    if (modalType === "add") {
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map((u) => (u.id === selectedUser.id ? newUser : u)));
    }
    setShowModal(false);
  };

  // Xử lý xác nhận xóa
  const handleDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setShowDeleteModal(false);
  };

  // Xử lý mở modal phân quyền
  const handleShowPermModal = (user) => {
    setPermUser(user);
    setPermState({ ...user.permissions });
    setShowPermModal(true);
  };

  // Lưu phân quyền
  const handleSavePermissions = () => {
    setUsers(
      users.map((u) =>
        u.id === permUser.id ? { ...u, permissions: { ...permState } } : u
      )
    );
    setShowPermModal(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Quản lý người dùng</h2>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2">
              <Button onClick={() => handleShowModal("add")}>
                {" "}
                <FaPlus /> Thêm người dùng{" "}
              </Button>
              <Dropdown onSelect={(role) => setRoleFilter(role)}>
                <Dropdown.Toggle variant="outline-secondary">
                  {roleFilter === "Tất cả" ? "Lọc theo vai trò" : roleFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roleOptions.map((role) => (
                    <Dropdown.Item key={role} eventKey={role}>
                      {role}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="d-flex gap-2">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <FaSearch />
                </Button>
              </InputGroup>
            </div>
          </div>
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Badge bg="primary">{user.role}</Badge>
                      </td>
                      <td>
                        <Badge
                          bg={
                            user.status === "Hoạt động"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowModal("edit", user)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowPermModal(user)}
                        >
                          <FaUserShield />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Thêm/Sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSaveUser} autoComplete="off">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "add"
                ? "Thêm người dùng mới"
                : "Chỉnh sửa người dùng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    name="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select
                    name="role"
                    value={formState.role}
                    onChange={handleRoleChange}
                    required
                  >
                    <option>Học sinh</option>
                    <option>Phụ huynh</option>
                    <option>Nhân viên y tế</option>
                    <option>Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value })
                    }
                    required
                  >
                    <option>Hoạt động</option>
                    <option>Đã khóa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    {modalType === "add"
                      ? "Mật khẩu"
                      : "Mật khẩu mới (để trống nếu không đổi)"}
                  </Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={(e) =>
                      setFormState({ ...formState, password: e.target.value })
                    }
                    minLength={modalType === "add" ? 6 : 0}
                    required={modalType === "add"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    value={formState.confirmPassword}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        confirmPassword: e.target.value,
                      })
                    }
                    minLength={modalType === "add" ? 6 : 0}
                    required={modalType === "add"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <hr />
                <h6>Phân quyền cho người dùng</h6>
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="perm_view_students"
                  label="Xem thông tin học sinh"
                  checked={formState.permissions.viewStudents}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      permissions: {
                        ...formState.permissions,
                        viewStudents: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="perm_record_events"
                  label="Ghi nhận sự kiện y tế"
                  checked={formState.permissions.recordEvents}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      permissions: {
                        ...formState.permissions,
                        recordEvents: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="perm_approve_meds"
                  label="Duyệt yêu cầu thuốc"
                  checked={formState.permissions.approveMeds}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      permissions: {
                        ...formState.permissions,
                        approveMeds: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="perm_manage_records"
                  label="Quản lý hồ sơ y tế"
                  checked={formState.permissions.manageRecords}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      permissions: {
                        ...formState.permissions,
                        manageRecords: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="perm_view_reports"
                  label="Truy cập báo cáo thống kê"
                  checked={formState.permissions.viewReports}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      permissions: {
                        ...formState.permissions,
                        viewReports: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {modalType === "add" ? "Thêm người dùng" : "Lưu thay đổi"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal phân quyền */}
      <Modal
        show={showPermModal}
        onHide={() => setShowPermModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Phân quyền cho{" "}
            <span className="text-primary">{permUser?.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="perm_view_students_perm"
                label="Xem thông tin học sinh"
                checked={permState.viewStudents || false}
                onChange={(e) =>
                  setPermState({ ...permState, viewStudents: e.target.checked })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="perm_record_events_perm"
                label="Ghi nhận sự kiện y tế"
                checked={permState.recordEvents || false}
                onChange={(e) =>
                  setPermState({ ...permState, recordEvents: e.target.checked })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="perm_approve_meds_perm"
                label="Duyệt yêu cầu thuốc"
                checked={permState.approveMeds || false}
                onChange={(e) =>
                  setPermState({ ...permState, approveMeds: e.target.checked })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="perm_manage_records_perm"
                label="Quản lý hồ sơ y tế"
                checked={permState.manageRecords || false}
                onChange={(e) =>
                  setPermState({
                    ...permState,
                    manageRecords: e.target.checked,
                  })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="perm_view_reports_perm"
                label="Truy cập báo cáo thống kê"
                checked={permState.viewReports || false}
                onChange={(e) =>
                  setPermState({ ...permState, viewReports: e.target.checked })
                }
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSavePermissions}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa người dùng <b>{userToDelete?.name}</b>{" "}
          không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Accounts;
