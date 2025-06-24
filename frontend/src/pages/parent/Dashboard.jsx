import React, { useEffect, useState, useRef } from "react";
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
// Import beautiful images
import schoolImage from '../../assets/09134957-Vasily-Kolo.jpg';
import aboutImage from '../../assets/college-U0dBV_QeiYk-unsplash-768x432.jpg';
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

const ParentDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef();

  // Scroll animation observer
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [blogs]); // Re-run when blogs change

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
    <div className="parent-dashboard">
      {/* Hero Section */}
      <div style={{position: 'relative', zIndex: 1000}}>

      
      <section className="hero-section">
        <div className="hero-background">
          <img src={schoolImage} alt="School Health Care" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-das-title">
            Chăm sóc sức khỏe học đường
          </h1>
          <p className="hero-subtitle">
            Đồng hành cùng phụ huynh trong việc chăm sóc sức khỏe cho học sinh
          </p>
          <Button as={Link} to="/parent/more-know" className="hero-btn">
            Tìm hiểu thêm
          </Button>
        </div>
      </section>

      <Container className="parent-dashboard" >
        {/* About School Section */}
        <section className="about-section">
          <h2 className="section-title scroll-animate" >Giới thiệu về trường học</h2>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="about-image scroll-animate delay-1">
                <img src={aboutImage} alt="School Building" className="img-fluid rounded" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content scroll-animate delay-2">
                <p>
                  Trường chúng tôi tự hào là một trong những cơ sở giáo dục hàng đầu với
                  hệ thống y tế học đường hiện đại và chuyên nghiệp.
                </p>
                <p>
                  Với đội ngũ nhân viên y tế giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chăm
                  sóc sức khỏe tốt nhất cho học sinh.
                </p>
                <p>
                  Phòng y tế được trang bị đầy đủ thiết bị y tế cần thiết và luôn sẵn sàng hỗ trợ học sinh
                  trong mọi tình huống.
                </p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Features Cards Section */}
        <section className="features-cards-section">
          <Container>
            <Row className="g-4">
              <Col lg={3} md={6}>
                <div className="feature-card scroll-animate delay-1">
                  <div className="feature-icon">
                    <FaClock />
                  </div>
                  <h4>24/7</h4>
                  <p>Hỗ trợ liên tục</p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="feature-card scroll-animate delay-2">
                  <div className="feature-icon">
                    <FaArrowRight />
                  </div>
                  <h4>Nhanh chóng</h4>
                  <p>Xử lý nhanh chóng</p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="feature-card scroll-animate delay-3">
                  <div className="feature-icon">
                    <FaShieldAlt />
                  </div>
                  <h4>Bảo mật</h4>
                  <p>An toàn thông tin</p>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="feature-card scroll-animate delay-4">
                  <div className="feature-icon">
                    <FaHeartbeat />
                  </div>
                  <h4>Tận tình</h4>
                  <p>Chăm sóc chu đáo</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Blog Section */}
        <section className="blog-section" >
          <h2 className="section-title scroll-animate">Blog sức khỏe học đường</h2>

          {loading ? (
            <div className="loading-state">
              <Spinner animation="border" />
              <p>Đang tải bài viết...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <FaExclamationTriangle />
              <p>{error}</p>
            </div>
          ) : (
            <Row className="g-4">
              {blogs.slice(0, 3).map((blog, index) => (
                <Col lg={4} md={6} key={blog.id}>
                  <div className={`blog-card scroll-animate delay-${index + 1}`}>
                    <div className="blog-image">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        onError={(e) => {
                          e.target.onError = null;
                          e.target.src = "https://placehold.jp/400x200.png?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="blog-content">
                      <div className="blog-date">
                        <FaCalendarAlt />
                        {formatDate(blog.createdAt)}
                      </div>
                      <h5>{blog.title}</h5>
                      <p>
                        {blog.contentSummary.length > 120
                          ? blog.contentSummary.substring(0, 120) + "..."
                          : blog.contentSummary}
                      </p>
                      <Link to={`/parent/blog/${blog.id}`} className="blog-link">
                        Đọc thêm <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}

          {blogs.length > 3 && !loading && (
            <div className="section-footer scroll-animate delay-4">
              <Button as={Link} to="/parent/more-know" className="view-all-btn">
                <FaBookOpen className="me-2" />
                Xem tất cả bài viết
              </Button>
            </div>
          )}
        </section>
      </Container>
    </div>
    </div>
  );
};

export default ParentDashboard;
