import React, { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeartbeat, FaBars, FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  // Xác định className cho layout
  const isAdmin = user?.role === 'admin';
  const layoutClass = isAdmin ? 'd-flex admin-theme admin-gradient-background' : 'd-flex';

  return (
    <div className={layoutClass}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: sidebarCollapsed ? '80px' : '250px', minHeight: '100vh' }}>
        {/* Header */}
        <header
          className="header w-100 bg-white border-bottom"
          style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}
        >
          <button
            className="btn btn-link p-0 border-0"
            style={{ fontSize: '1.8rem', color: '#333' }}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <div>
            <FaUserCircle style={{ fontSize: '2rem', color: '#888' }} />
          </div>
        </header>

        {/* Main Content Wrapper */}
        <div style={{ marginTop: "80px", padding: "20px" }}>
          <main style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            minHeight: 'calc(100vh - 150px)' /* Adjust for header/footer */
          }}>
            <Outlet />
          </main>
        </div>

        {/* Footer */}
        {user?.role === 'parent' && (
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
        )}
      </div>
    </div>
  );
};

export default MainLayout;
