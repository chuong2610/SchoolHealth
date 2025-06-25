import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { path: "/admin", label: "Dashboard", icon: "fas fa-chart-line" },
  { path: "/admin/accounts", label: "Tài khoản", icon: "fas fa-users" },
  { path: "/admin/medicines/inventory", label: "Kho thuốc", icon: "fas fa-pills" },
  { path: "/admin/notification/management", label: "Thông báo", icon: "fas fa-bell" },
  { path: "/admin/reports", label: "Báo cáo", icon: "fas fa-file-export" },
  { path: "/admin/profile", label: "Hồ sơ", icon: "fas fa-user" },
  { path: "/admin/settings", label: "Cài đặt", icon: "fas fa-cog" },
];

const AdminHeader = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-1 shadow-sm sticky-top">
      <div className="container-fluid px-2 d-flex align-items-center justify-content-between position-relative">
        <ul className="navbar-nav me-auto align-items-center compact-nav">
          {menu.map((item, idx) => (
            <li className="nav-item" key={idx}>
              <Link
                className={`nav-link py-1 px-2${location.pathname === item.path ? " active" : ""
                  }`}
                to={item.path}
              >
                <i className={item.icon}></i>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item dropdown dropdown-hover">
            <a
              className="nav-link d-flex align-items-center gap-1 py-1 px-2"
              href="#"
              id="userMainLink"
              role="button"
            >
              <i className="fas fa-user-circle"></i>{" "}
              <span className="d-none d-md-inline">Admin</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminHeader;
