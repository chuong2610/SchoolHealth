import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { path: "/admin", label: "Dashboard", icon: "fas fa-chart-line" },
  { path: "/admin/students", label: "Người dùng", icon: "fas fa-users" },
  { path: "/admin/categories", label: "Danh mục", icon: "fas fa-list" },
  {
    label: "Thuốc",
    icon: "fas fa-capsules",
    path: "/admin/medicines/plan",
    dropdown: [
      {
        path: "/admin/medicines/plan",
        label: "Kế hoạch",
        icon: "fas fa-calendar-check",
      },
      {
        path: "/admin/medicines/requests",
        label: "Yêu cầu",
        icon: "fas fa-shopping-cart",
      },
      {
        path: "/admin/medicines/inventory",
        label: "Kho thuốc",
        icon: "fas fa-boxes",
      },
    ],
  },
  { path: "/admin/reports", label: "Báo cáo", icon: "fas fa-file-export" },
];

const AdminHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-1 shadow-sm sticky-top">
      <div className="container-fluid px-2 d-flex align-items-center justify-content-between position-relative">
        <Link
          className="navbar-brand fw-bold text-primary d-flex align-items-center gap-1 me-2 p-2 rounded hover-effect"
          to="/admin"
        >
          <i className="fas fa-heartbeat text-primary fs-4"></i>
          <span className="fs-5 d-none d-sm-inline">School Health</span>
          <span className="fs-5 d-inline d-sm-none">SH</span>
        </Link>
        <ul className="navbar-nav me-auto align-items-center compact-nav">
          {menu.map((item, idx) =>
            item.dropdown ? (
              <li
                className="nav-item dropdown dropdown-hover"
                key={idx}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  className="nav-link py-1 px-2 d-flex align-items-center"
                  to={item.path}
                  id="medicineMainLink"
                  role="button"
                  aria-expanded={dropdownOpen}
                >
                  <i className={item.icon}></i>
                  <span className="nav-text">{item.label}</span>
                  <i className="fas fa-chevron-down ms-1 small-icon"></i>
                </Link>
                <ul
                  className={`dropdown-menu compact-dropdown${
                    dropdownOpen ? " show" : ""
                  }`}
                >
                  {item.dropdown.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <Link className="dropdown-item py-1" to={sub.path}>
                        <i className={sub.icon + " me-1"}></i>
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li className="nav-item" key={idx}>
                <Link
                  className={`nav-link py-1 px-2${
                    location.pathname === item.path ? " active" : ""
                  }`}
                  to={item.path}
                >
                  <i className={item.icon}></i>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            )
          )}
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
