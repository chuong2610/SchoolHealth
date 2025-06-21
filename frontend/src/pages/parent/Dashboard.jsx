import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge
} from "react-bootstrap";
import {
  FaHeartbeat,
  FaUser,
  FaPills,
  FaShieldAlt,
  FaCalendarAlt,
  FaBookOpen,
  FaClock,
  FaEye,
  FaArrowRight,
  FaStethoscope,
  FaUserMd,
  FaClipboardList,
  FaHome,
  FaStar,
  FaGraduationCap,
  FaExclamationTriangle,
  FaBell,
  FaChartLine,
  FaFileAlt
} from 'react-icons/fa';
// Styles được import từ main.jsx

const ParentDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDM4OTI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.bPbFgD4y0GGSlryFzZj7YYYzlkWFL9pDbg6uHdZGz4U";
        const response = await axios.get(
          "http://localhost:5182/api/BlogPosts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogs(response.data);
        setLoading(false);
        setTimeout(() => setAnimateStats(true), 500);
      } catch (err) {
        setError(
          err.response
            ? `Lỗi ${err.response.status}: ${err.response.data.message || "Không thể tải dữ liệu blog."}`
            : "Không thể kết nối đến server."
        );
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="parent-container">
      {/* Dashboard Header */}
      <div className="parent-page-header parent-animate-fade-in">
        <div className="parent-page-header-bg"></div>
        <div className="parent-page-header-content">
          <h1 className="parent-page-title">
            <FaHeartbeat />
            Chăm sóc sức khỏe học đường
          </h1>
          <p className="parent-page-subtitle">
            Đồng hành cùng phụ huynh trong việc chăm sóc và theo dõi sức khỏe học sinh
          </p>
          <Button
            as={Link}
            to="/parent/more-know"
            className="parent-primary-btn mt-3"
            size="lg"
          >
            <FaBookOpen className="me-2" />
            Tìm hiểu thêm
          </Button>
        </div>
      </div>

      <Container>
        {/* Welcome Section */}
        <div className="parent-card parent-animate-fade-in mb-4">
          <div className="parent-card-header">
            <h2 className="parent-card-title">
              <FaHome />
              Chào mừng đến với hệ thống quản lý sức khỏe
            </h2>
          </div>
          <div className="parent-card-body">
            <Row className="align-items-center">
              <Col md={8}>
                <p className="mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Hệ thống giúp phụ huynh theo dõi và quản lý sức khỏe của con em một cách chuyên nghiệp,
                  đảm bảo an toàn và hiệu quả trong môi trường học đường.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Badge bg="success" className="p-2">
                    <FaShieldAlt className="me-2" />
                    An toàn tuyệt đối
                  </Badge>
                  <Badge bg="primary" className="p-2">
                    <FaUserMd className="me-2" />
                    Đội ngũ chuyên nghiệp
                  </Badge>
                  <Badge bg="info" className="p-2">
                    <FaClock className="me-2" />
                    Hỗ trợ 24/7
                  </Badge>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="parent-stat-icon" style={{ margin: '0 auto', transform: 'scale(1.2)' }}>
                  <FaGraduationCap />
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`}>
              <div className="parent-stat-icon">
                <FaHeartbeat />
              </div>
              <div className="parent-stat-value">24/7</div>
              <div className="parent-stat-label">Chăm sóc sức khỏe</div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`}>
              <div className="parent-stat-icon">
                <FaPills />
              </div>
              <div className="parent-stat-value">100%</div>
              <div className="parent-stat-label">Quản lý thuốc</div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`}>
              <div className="parent-stat-icon">
                <FaShieldAlt />
              </div>
              <div className="parent-stat-value">Safe</div>
              <div className="parent-stat-label">An toàn tuyệt đối</div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`}>
              <div className="parent-stat-icon">
                <FaUserMd />
              </div>
              <div className="parent-stat-value">Pro</div>
              <div className="parent-stat-label">Hỗ trợ chuyên nghiệp</div>
            </div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <div className="parent-card parent-animate-slide-in mb-5">
          <div className="parent-card-header">
            <h2 className="parent-card-title">
              <FaChartLine />
              Thao tác nhanh
            </h2>
          </div>
          <div className="parent-card-body">
            <Row className="g-3">
              <Col lg={3} md={6}>
                <Card className="border-0 h-100" style={{ background: 'linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)', borderRadius: '1rem' }}>
                  <Card.Body className="text-center p-4">
                    <div style={{ width: '50px', height: '50px', background: 'var(--parent-gradient-button)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontSize: '1.25rem' }}>
                      <FaClipboardList />
                    </div>
                    <h6 className="fw-bold mb-2">Khai báo sức khỏe</h6>
                    <p className="text-muted small mb-3">Khai báo tình trạng sức khỏe hằng ngày</p>
                    <Button
                      as={Link}
                      to="/parent/health-declaration"
                      className="parent-primary-btn btn-sm"
                    >
                      Khai báo
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 h-100" style={{ background: 'linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)', borderRadius: '1rem' }}>
                  <Card.Body className="text-center p-4">
                    <div style={{ width: '50px', height: '50px', background: 'var(--parent-gradient-button)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontSize: '1.25rem' }}>
                      <FaPills />
                    </div>
                    <h6 className="fw-bold mb-2">Gửi thuốc</h6>
                    <p className="text-muted small mb-3">Gửi thông tin thuốc cho học sinh</p>
                    <Button
                      as={Link}
                      to="/parent/send-medicine"
                      className="parent-primary-btn btn-sm"
                    >
                      Gửi thuốc
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 h-100" style={{ background: 'linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)', borderRadius: '1rem' }}>
                  <Card.Body className="text-center p-4">
                    <div style={{ width: '50px', height: '50px', background: 'var(--parent-gradient-button)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontSize: '1.25rem' }}>
                      <FaStethoscope />
                    </div>
                    <h6 className="fw-bold mb-2">Lịch sử sức khỏe</h6>
                    <p className="text-muted small mb-3">Xem lại lịch sử chăm sóc sức khỏe</p>
                    <Button
                      as={Link}
                      to="/parent/health-history"
                      className="parent-primary-btn btn-sm"
                    >
                      Xem lịch sử
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="border-0 h-100" style={{ background: 'linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%)', borderRadius: '1rem' }}>
                  <Card.Body className="text-center p-4">
                    <div style={{ width: '50px', height: '50px', background: 'var(--parent-gradient-button)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontSize: '1.25rem' }}>
                      <FaBell />
                    </div>
                    <h6 className="fw-bold mb-2">Thông báo</h6>
                    <p className="text-muted small mb-3">Xem các thông báo quan trọng</p>
                    <Button
                      as={Link}
                      to="/parent/notifications"
                      className="parent-primary-btn btn-sm"
                    >
                      Xem thông báo
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Features Section */}
        <div className="parent-card parent-animate-scale-in mb-5">
          <div className="parent-card-header">
            <h2 className="parent-card-title">
              <FaStar />
              Dịch vụ chăm sóc sức khỏe
            </h2>
          </div>
          <div className="parent-card-body">
            <Row className="g-4">
              <Col lg={4} md={6}>
                <div className="h-100 p-4 text-center" style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)', borderRadius: '1rem', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                  <div style={{ width: '70px', height: '70px', background: 'var(--parent-gradient-button)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', fontSize: '1.75rem' }}>
                    <FaClipboardList />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--parent-primary)' }}>Khai báo sức khỏe</h4>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                    Theo dõi và khai báo tình trạng sức khỏe hằng ngày của học sinh một cách dễ dàng và chính xác.
                  </p>
                  <Button
                    as={Link}
                    to="/parent/health-declaration"
                    className="parent-secondary-btn"
                  >
                    Khai báo ngay
                  </Button>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className="h-100 p-4 text-center" style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)', borderRadius: '1rem', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                  <div style={{ width: '70px', height: '70px', background: 'var(--parent-gradient-button)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', fontSize: '1.75rem' }}>
                    <FaPills />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--parent-primary)' }}>Gửi thuốc</h4>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                    Gửi thông tin thuốc cần thiết cho học sinh với hướng dẫn chi tiết và theo dõi quá trình sử dụng.
                  </p>
                  <Button
                    as={Link}
                    to="/parent/send-medicine"
                    className="parent-secondary-btn"
                  >
                    Gửi thuốc
                  </Button>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className="h-100 p-4 text-center" style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)', borderRadius: '1rem', border: '1px solid rgba(30, 126, 156, 0.1)' }}>
                  <div style={{ width: '70px', height: '70px', background: 'var(--parent-gradient-button)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', fontSize: '1.75rem' }}>
                    <FaStethoscope />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--parent-primary)' }}>Lịch sử sức khỏe</h4>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                    Xem lại toàn bộ lịch sử chăm sóc sức khỏe, khám bệnh và điều trị của học sinh tại trường.
                  </p>
                  <Button
                    as={Link}
                    to="/parent/health-history"
                    className="parent-secondary-btn"
                  >
                    Xem lịch sử
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Blog Section */}
        <div className="parent-card parent-animate-fade-in">
          <div className="parent-card-header">
            <h2 className="parent-card-title">
              <FaBookOpen />
              Blog sức khỏe học đường
            </h2>
            <Button
              as={Link}
              to="/parent/more-know"
              className="parent-secondary-btn btn-sm"
            >
              <FaFileAlt className="me-2" />
              Xem tất cả
            </Button>
          </div>
          <div className="parent-card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--parent-primary)' }} className="mb-3" />
                <h5 style={{ color: 'var(--parent-primary)' }}>Đang tải bài viết...</h5>
              </div>
            ) : error ? (
              <div className="text-center text-danger py-5">
                <FaExclamationTriangle className="mb-3" size={48} />
                <p>{error}</p>
              </div>
            ) : (
              <Row className="g-4">
                {blogs.slice(0, 6).map((blog) => (
                  <Col lg={4} md={6} key={blog.id}>
                    <Card className="border-0 h-100 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 126, 156, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                      }}>
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onError = null;
                            e.target.src = "https://placehold.jp/400x200.png?text=No+Image";
                          }}
                        />
                        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '4px', background: 'var(--parent-gradient-primary)' }}></div>
                      </div>
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          <FaCalendarAlt className="me-2" />
                          {formatDate(blog.createdAt)}
                        </div>
                        <h5 className="fw-bold mb-3" style={{ color: 'var(--parent-primary)', lineHeight: '1.4' }}>
                          {blog.title}
                        </h5>
                        <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                          {blog.contentSummary.length > 120
                            ? blog.contentSummary.substring(0, 120) + "..."
                            : blog.contentSummary}
                        </p>
                        <Link
                          to={`/parent/blog/${blog.id}`}
                          className="d-inline-flex align-items-center text-decoration-none fw-bold"
                          style={{ color: 'var(--parent-primary)', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--parent-accent)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--parent-primary)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          Đọc thêm <FaArrowRight className="ms-2" />
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {blogs.length > 6 && !loading && (
              <div className="text-center mt-4">
                <Button
                  as={Link}
                  to="/parent/more-know"
                  className="parent-primary-btn"
                  size="lg"
                >
                  <FaBookOpen className="me-2" />
                  Xem tất cả bài viết
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ParentDashboard;
