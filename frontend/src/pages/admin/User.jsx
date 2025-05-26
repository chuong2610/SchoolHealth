import React, { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Học sinh",
    email: "a@student.edu.vn",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Phụ huynh",
    email: "b@parent.edu.vn",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Y tá",
    email: "c@nurse.edu.vn",
    status: "Tạm khóa",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    role: "Giáo viên",
    email: "d@teacher.edu.vn",
    status: "Hoạt động",
  },
];

const User = () => {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2>Quản lý Người dùng</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Tìm kiếm theo tên, email, vai trò..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-8 text-end">
          <button className="btn btn-primary">+ Thêm người dùng</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Vai trò</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "Hoạt động"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Sửa
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
