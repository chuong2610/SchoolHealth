import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge,
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
  FaFileAlt,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
// Styles được import từ main.jsx

const ParentDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const observerRef = useRef();

  // // Scroll animation observer
  // useEffect(() => {
  //   const observerCallback = (entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('animate-in');
  //       }
  //     });
  //   };

  //   observerRef.current = new IntersectionObserver(observerCallback, {
  //     threshold: 0.1,
  //     rootMargin: '0px 0px -50px 0px'
  //   });

  //   const animateElements = document.querySelectorAll('.scroll-animate');
  //   animateElements.forEach((el) => {
  //     observerRef.current.observe(el);
  //   });

  //   return () => {
  //     if (observerRef.current) {
  //       observerRef.current.disconnect();
  //     }
  //   };
  // }, [blogs]); // Re-run when blogs change
  const [animateStats, setAnimateStats] = useState(false);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;
  const navigate = useNavigate();

  const fetchBlogs = async (page = 1) => {
    try {
      console.log(
        "API URL:",
        `/BlogPosts?pageNumber=${page}&pageSize=${pageSize}`
      );
      const response = await axiosInstance.get(
        `/BlogPosts?pageNumber=${page}&pageSize=${pageSize}`
      );
      console.log("Response:", response);
      setBlogs(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setCurrentPage(page);
      setLoading(false);
      setTimeout(() => setAnimateStats(true), 500);
    } catch (err) {
      setError(
        err.response
          ? `Lỗi ${err.response.status}: ${
              err.response.data.message || "Không thể tải dữ liệu blog."
            }`
          : "Không thể kết nối đến server."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (pageNumber) => {
    setLoading(true);
    fetchBlogs(pageNumber);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
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
        <div className="parent-card parent-animate-fade-in">
          <div className="parent-card-header">
            <h2 className="parent-card-title">
              <FaBookOpen />
              Blog sức khỏe học đường
            </h2>
          </div>
          <div className="parent-card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: "var(--parent-primary)" }}
                  className="mb-3"
                />
                <h5 style={{ color: "var(--parent-primary)" }}>
                  Đang tải bài viết...
                </h5>
              </div>
            ) : error ? (
              <div className="text-center text-danger py-5">
                <FaExclamationTriangle className="mb-3" size={48} />
                <p>{error}</p>
              </div>
            ) : (
              <Row className="g-4">
                {blogs.map((blog) => {
                  const plainSummary = stripHtml(blog.contentSummary);
                  return (
                    <Col lg={4} md={6} key={blog.id}>
                      <Card
                        className="border-0 h-100 shadow-sm"
                        style={{
                          borderRadius: "1rem",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-8px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 40px rgba(30, 126, 156, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.12)";
                        }}
                        onClick={() => navigate(`/parent/blog/${blog.id}`)}
                      >
                        <div
                          style={{ position: "relative", overflow: "hidden" }}
                        >
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onError = null;
                              e.target.src =
                                "https://placehold.jp/400x200.png?text=No+Image";
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              left: "0",
                              right: "0",
                              height: "4px",
                              background: "var(--parent-gradient-primary)",
                            }}
                          ></div>
                        </div>
                        <Card.Body className="p-4">
                          <div
                            className="d-flex align-items-center mb-3"
                            style={{ color: "#6c757d", fontSize: "0.875rem" }}
                          >
                            <FaCalendarAlt className="me-2" />
                            {formatDate(blog.createdAt)}
                          </div>
                          <h5
                            className="fw-bold mb-3"
                            style={{
                              color: "var(--parent-primary)",
                              lineHeight: "1.4",
                            }}
                          >
                            {blog.title}
                          </h5>
                          <p
                            className="text-muted mb-4"
                            style={{ lineHeight: "1.6" }}
                          >
                            {plainSummary.length > 120
                              ? plainSummary.substring(0, 120) + "..."
                              : plainSummary}
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="text-center mt-4">
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <div className="mt-2 text-muted">
                  Hiển thị {blogs.length} trong tổng số {totalItems} bài viết
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
    </div>
  );
};

export default ParentDashboard;
