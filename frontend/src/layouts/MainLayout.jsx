import React from "react";
import { NavLink, Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentRole = user?.role || location.pathname.split("/")[1];

  const getMenuItems = (roleName) => {
    switch (roleName) {
      case "admin":
        return [
          { path: "/admin", label: "Dashboard", icon: "fas fa-chart-line" },
          { path: "/admin/accounts", label: "Người dùng", icon: "fas fa-users" },
          { path: "/admin/categories", label: "Danh mục", icon: "fas fa-list" },
          { path: "/admin/medicines/plan", label: "Kế hoạch thuốc", icon: "fas fa-calendar-check" },
          { path: "/admin/medicines/requests", label: "Yêu cầu thuốc", icon: "fas fa-shopping-cart" },
          { path: "/admin/medicines/inventory", label: "Kho thuốc", icon: "fas fa-boxes" },
          { path: "/admin/reports", label: "Báo cáo", icon: "fas fa-file-alt" },
        ];
      case "parent":
        return [
          { path: "/parent", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/parent/health-declaration", label: "Khai báo y tế", icon: "fas fa-file-medical" },
          { path: "/parent/send-medicine", label: "Gửi thuốc", icon: "fas fa-pills" },
          { path: "/parent/notifications", label: "Thông báo", icon: "fas fa-bell" },
          { path: "/parent/health-history", label: "Lịch sử sức khỏe", icon: "fas fa-history" },
        ];
      case "student":
        return [
          { path: "/student", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/student/health-info", label: "Thông tin sức khỏe", icon: "fas fa-user-friends" },
          { path: "/student/health-events", label: "Lịch sử sự kiện", icon: "fas fa-clipboard-list" },
          { path: "/student/vaccination-history", label: "Tiêm chủng & Khám sức khỏe", icon: "fas fa-syringe" },
          { path: "/student/notifications", label: "Thông báo", icon: "fas fa-bell" },
        ];
      case "nurse":
        return [
          { path: "/nurse", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/nurse/receive-medicine", label: "Nhận thuốc", icon: "fas fa-pills" },
          { path: "/nurse/health-declaration", label: "Khai báo y tế", icon: "fas fa-file-medical" },
          { path: "/nurse/health-events", label: "Sự kiện y tế", icon: "fas fa-calendar-check" },
        ];
      default:
        return [{ path: "/", label: "Trang chủ", icon: "fas fa-home" }];
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Nếu chưa đăng nhập, chuyển về trang login
  React.useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to={`/${currentRole}`}>
              <i className="fas fa-heartbeat me-2"></i>School Health
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {getMenuItems(currentRole).map((item, index) => (
                  <li key={index} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                      end={item.path === `/admin` || item.path === `/parent` || item.path === `/nurse`}
                    >
                      <i className={`${item.icon} me-1`}></i> {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to={`/${currentRole}/profile`}>
                        <i className="fas fa-user me-2"></i> Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to={`/${currentRole}/settings`}>
                        <i className="fas fa-cog me-2"></i> Cài đặt
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer bg-white border-top">
        <div className="container">
          <div className="row py-4">
            <div className="col-md-4">
              <h5 className="mb-3">Hệ thống Quản lý Y tế Học đường</h5>
              <p className="text-muted mb-0">
                Giải pháp quản lý y tế học đường toàn diện, giúp theo dõi và
                chăm sóc sức khỏe học sinh hiệu quả.
              </p>
            </div>
            <div className="col-md-4">
              <h5 className="mb-3">Liên kết nhanh</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about" className="text-muted">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="mb-3">Liên hệ</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <i className="fas fa-map-marker-alt me-2"></i> 123 Đường ABC,
                  Quận XYZ, TP.HCM
                </li>
                <li>
                  <i className="fas fa-phone me-2"></i> (028) 1234 5678
                </li>
                <li>
                  <i className="fas fa-envelope me-2"></i>{" "}
                  contact@schoolhealth.com
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="row py-3">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted mb-0">
                &copy; 2024 Hệ thống Quản lý Y tế Học đường. All rights
                reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-muted me-3">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
