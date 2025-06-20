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
  FaExclamationTriangle
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
        console.error("API error:", err.response ? err.response : err);
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
    <div
      className="parent-theme parent-dashboard"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      {/* CSS Override for Professional Design */}
      <style>
        {`
          .parent-dashboard {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 0 !important;
          }
          
          .dashboard-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 4rem 0 !important;
            margin-bottom: 2rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .dashboard-header::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
            pointer-events: none !important;
          }
          
          .header-content {
            position: relative !important;
            z-index: 2 !important;
            text-align: center !important;
          }
          
          .welcome-title {
            font-size: 3rem !important;
            font-weight: 800 !important;
            margin-bottom: 1rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
          }
          
          .welcome-subtitle {
            font-size: 1.3rem !important;
            opacity: 0.95 !important;
            margin-bottom: 2rem !important;
            font-weight: 400 !important;
          }
          
          .stats-dashboard {
            margin: -2rem 1rem 3rem 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .stats-card {
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 40px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            position: relative !important;
          }
          
          .stats-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 60px rgba(37, 99, 235, 0.2) !important;
          }
          
          .stats-card::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 5px !important;
          }
          
          .stats-card.health::before {
            background: linear-gradient(90deg, #10b981, #34d399) !important;
          }
          
          .stats-card.medicine::before {
            background: linear-gradient(90deg, #3b82f6, #60a5fa) !important;
          }
          
          .stats-card.safety::before {
            background: linear-gradient(90deg, #8b5cf6, #a78bfa) !important;
          }
          
          .stats-card.support::before {
            background: linear-gradient(90deg, #f59e0b, #fbbf24) !important;
          }
          
          .stats-content {
            padding: 2rem !important;
            display: flex !important;
            align-items: center !important;
          }
          
          .stats-icon {
            width: 70px !important;
            height: 70px !important;
            border-radius: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 2rem !important;
            margin-right: 1.5rem !important;
          }
          
          .stats-card.health .stats-icon {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)) !important;
            color: #10b981 !important;
          }
          
          .stats-card.medicine .stats-icon {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.1)) !important;
            color: #3b82f6 !important;
          }
          
          .stats-card.safety .stats-icon {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1)) !important;
            color: #8b5cf6 !important;
          }
          
          .stats-card.support .stats-icon {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1)) !important;
            color: #f59e0b !important;
          }
          
          .stats-info h3 {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin: 0 0 0.5rem 0 !important;
            color: #1f2937 !important;
          }
          
          .stats-info p {
            font-size: 1rem !important;
            font-weight: 600 !important;
            margin: 0 !important;
            color: #6b7280 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          .feature-section {
            margin: 3rem 1rem !important;
          }
          
          .section-title {
            text-align: center !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            color: #1f2937 !important;
            margin-bottom: 3rem !important;
            position: relative !important;
          }
          
          .section-title::after {
            content: '' !important;
            position: absolute !important;
            bottom: -10px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 80px !important;
            height: 4px !important;
            background: linear-gradient(90deg, #2563eb, #38b6ff) !important;
            border-radius: 2px !important;
          }
          
          .feature-card {
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1) !important;
            border: none !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            height: 100% !important;
          }
          
          .feature-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15) !important;
          }
          
          .feature-icon {
            width: 80px !important;
            height: 80px !important;
            border-radius: 20px !important;
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 2rem !important;
            margin: 0 auto 1.5rem auto !important;
          }
          
          .feature-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
            text-align: center !important;
          }
          
          .feature-description {
            color: #6b7280 !important;
            line-height: 1.6 !important;
            text-align: center !important;
            margin-bottom: 1.5rem !important;
          }
          
          .feature-link {
            text-align: center !important;
          }
          
          .blog-section {
            margin: 3rem 1rem !important;
          }
          
          .blog-card {
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1) !important;
            border: none !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            height: 100% !important;
          }
          
          .blog-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15) !important;
          }
          
          .blog-image {
            width: 100% !important;
            height: 200px !important;
            object-fit: cover !important;
            border-bottom: 3px solid #e5e7eb !important;
          }
          
          .blog-content {
            padding: 1.5rem !important;
          }
          
          .blog-date {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            margin-bottom: 1rem !important;
          }
          
          .blog-title {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
            line-height: 1.4 !important;
          }
          
          .blog-summary {
            color: #6b7280 !important;
            line-height: 1.6 !important;
            margin-bottom: 1.5rem !important;
          }
          
          .blog-link {
            display: inline-flex !important;
            align-items: center !important;
            color: #2563eb !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            transition: all 0.3s ease !important;
          }
          
          .blog-link:hover {
            color: #1d4ed8 !important;
            transform: translateX(4px) !important;
          }
          
          .btn-primary-custom {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            border-radius: 25px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s ease !important;
            color: white !important;
          }
          
          .btn-primary-custom:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3) !important;
            color: white !important;
          }
          
          .loading-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4rem 2rem !important;
            text-align: center !important;
          }
          
          .loading-icon {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 1rem !important;
          }
          
          @media (max-width: 768px) {
            .welcome-title {
              font-size: 2rem !important;
            }
            
            .welcome-subtitle {
              font-size: 1.1rem !important;
            }
            
            .stats-dashboard {
              margin: -1rem 0.5rem 2rem 0.5rem !important;
            }
            
            .stats-content {
              padding: 1.5rem !important;
              flex-direction: column !important;
              text-align: center !important;
            }
            
            .stats-icon {
              margin: 0 0 1rem 0 !important;
            }
            
            .feature-section,
            .blog-section {
              margin: 2rem 0.5rem !important;
            }
          }
        `}
      </style>

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <Container>
          <div className="header-content">
            <h1 className="welcome-title">
              <FaHeartbeat className="me-3" />
              Chăm sóc sức khỏe học đường
            </h1>
            <p className="welcome-subtitle">
              Đồng hành cùng phụ huynh trong việc chăm sóc và theo dõi sức khỏe học sinh
            </p>
            <Button
              as={Link}
              to="/parent/more-know"
              className="btn-primary-custom"
              size="lg"
            >
              <FaBookOpen className="me-2" />
              Tìm hiểu thêm
            </Button>
          </div>
        </Container>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <Card className={`stats-card health ${animateStats ? 'animate-in' : ''}`}>
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaHeartbeat />
                  </div>
                  <div className="stats-info">
                    <h3>24/7</h3>
                    <p>Chăm sóc sức khỏe</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className={`stats-card medicine ${animateStats ? 'animate-in' : ''}`}>
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaPills />
                  </div>
                  <div className="stats-info">
                    <h3>100%</h3>
                    <p>Quản lý thuốc</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className={`stats-card safety ${animateStats ? 'animate-in' : ''}`}>
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="stats-info">
                    <h3>Safe</h3>
                    <p>An toàn tuyệt đối</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className={`stats-card support ${animateStats ? 'animate-in' : ''}`}>
                <div className="stats-content">
                  <div className="stats-icon">
                    <FaUserMd />
                  </div>
                  <div className="stats-info">
                    <h3>Pro</h3>
                    <p>Hỗ trợ chuyên nghiệp</p>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="feature-section">
        <Container>
          <h2 className="section-title">Dịch vụ chăm sóc sức khỏe</h2>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="feature-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon">
                    <FaClipboardList />
                  </div>
                  <h3 className="feature-title">Khai báo sức khỏe</h3>
                  <p className="feature-description">
                    Theo dõi và khai báo tình trạng sức khỏe hằng ngày của học sinh một cách dễ dàng và chính xác.
                  </p>
                  <div className="feature-link">
                    <Button
                      as={Link}
                      to="/parent/health-declaration"
                      variant="outline-primary"
                      className="rounded-pill"
                    >
                      Khai báo ngay
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="feature-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon">
                    <FaPills />
                  </div>
                  <h3 className="feature-title">Gửi thuốc</h3>
                  <p className="feature-description">
                    Gửi thông tin thuốc cần thiết cho học sinh với hướng dẫn chi tiết và theo dõi quá trình sử dụng.
                  </p>
                  <div className="feature-link">
                    <Button
                      as={Link}
                      to="/parent/send-medicine"
                      variant="outline-primary"
                      className="rounded-pill"
                    >
                      Gửi thuốc
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="feature-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon">
                    <FaStethoscope />
                  </div>
                  <h3 className="feature-title">Lịch sử sức khỏe</h3>
                  <p className="feature-description">
                    Xem lại toàn bộ lịch sử chăm sóc sức khỏe, khám bệnh và điều trị của học sinh tại trường.
                  </p>
                  <div className="feature-link">
                    <Button
                      as={Link}
                      to="/parent/health-history"
                      variant="outline-primary"
                      className="rounded-pill"
                    >
                      Xem lịch sử
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Blog Section */}
      <div className="blog-section">
        <Container>
          <h2 className="section-title">
            <FaBookOpen className="me-3" />
            Blog sức khỏe học đường
          </h2>
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" className="loading-icon" />
              <h5>Đang tải bài viết...</h5>
            </div>
          ) : error ? (
            <div className="text-center text-danger p-4">
              <FaExclamationTriangle className="mb-3" size={48} />
              <p>{error}</p>
            </div>
          ) : (
            <Row className="g-4">
              {blogs.slice(0, 6).map((blog) => (
                <Col lg={4} md={6} key={blog.id}>
                  <Card className="blog-card">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="blog-image"
                      onError={(e) => {
                        e.target.onError = null;
                        e.target.src = "https://placehold.jp/400x200.png?text=No+Image";
                      }}
                    />
                    <div className="blog-content">
                      <div className="blog-date">
                        <FaCalendarAlt className="me-2" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <h3 className="blog-title">{blog.title}</h3>
                      <p className="blog-summary">
                        {blog.contentSummary.length > 120
                          ? blog.contentSummary.substring(0, 120) + "..."
                          : blog.contentSummary}
                      </p>
                      <Link
                        to={`/parent/blog/${blog.id}`}
                        className="blog-link"
                      >
                        Đọc thêm <FaArrowRight className="ms-2" />
                      </Link>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {blogs.length > 6 && (
            <div className="text-center mt-4">
              <Button
                as={Link}
                to="/parent/more-know"
                className="btn-primary-custom"
              >
                <FaBookOpen className="me-2" />
                Xem tất cả bài viết
              </Button>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ParentDashboard;
