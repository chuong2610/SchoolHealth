import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import schoolImage from "../assets/09134957-Vasily-Kolo.jpg";
import aboutImage from "../assets/college-U0dBV_QeiYk-unsplash-768x432.jpg";
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
  FaSchool,
  FaExclamationTriangle,
  FaChartLine,
  FaUsers,
  FaBell,
  FaCheckCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PaginationBar from "../components/common/PaginationBar";
import styles from "./LandingPage.module.css";
import Footer from "./Footer";
import Skeleton from "react-loading-skeleton";

const LandingPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef();
  const [animateStats, setAnimateStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    };
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });
    const animateElements = document.querySelectorAll(".scroll-animate");
    animateElements.forEach((el) => {
      observerRef.current.observe(el);
    });
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [blogs]);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/BlogPosts?pageNumber=${page}&pageSize=${pageSize}`
      );
      setBlogs(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setCurrentPage(page);

      setTimeout(() => {
        setLoading(false);
        setAnimateStats(true);
      }, 500);
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
  }, []);

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

  const handleImageError = (e) => {
    e.target.onError = null;
    e.target.src =
      "https://via.placeholder.com/400x200/2563eb/ffffff?text=Không+có+ảnh";
  };

  return (
    <div className={styles.landingRoot}>
      {/* Header */}
      <header className={styles.header}>
        <Button className={styles.loginButton} as={Link} to="/login">
          Đăng nhập
        </Button>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <FaHeartbeat /> Hệ thống Y tế Học đường
            </div>
            <h1 className={styles.heroTitle}>
              Chăm sóc sức khỏe học đường
              <span className={styles.heroTitleHighlight}> toàn diện</span>
            </h1>
            <p className={styles.heroDesc}>
              Đồng hành cùng phụ huynh trong việc chăm sóc sức khỏe cho học sinh
              với công nghệ hiện đại và đội ngũ y tế chuyên nghiệp
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Học sinh</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Hỗ trợ</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>An toàn</div>
              </div>
            </div>
            <Button className={styles.heroButton} as={Link} to="/login">
              Đăng nhập để trải nghiệm
            </Button>
          </div>
          <div className={styles.heroImgWrap}>
            <img
              src={schoolImage}
              alt="School Health Care"
              className={styles.heroImg}
            />
            <div className={styles.heroImgOverlay}></div>
          </div>
        </div>
      </section>

      <Container>
        {/* Quick Actions Section */}
        <section className={styles.quickActionsSection}>
          <h2 className={styles.sectionTitle}>
            <FaChartLine /> Dịch vụ nhanh
          </h2>
          <Row className={styles.quickActionsRow}>
            <Col lg={3} md={6} className={styles.quickActionCol}>
              <div className={`${styles.quickActionCard} scroll-animate`}>
                <div className={styles.quickActionIcon}>
                  <FaUser />
                </div>
                <h4>Khai báo sức khỏe</h4>
                <p>Cập nhật thông tin sức khỏe học sinh</p>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.quickActionCol}>
              <div className={`${styles.quickActionCard} scroll-animate`}>
                <div className={styles.quickActionIcon}>
                  <FaBookOpen />
                </div>
                <h4>Lịch sử sức khỏe</h4>
                <p>Xem lịch sử khám bệnh và điều trị</p>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.quickActionCol}>
              <div className={`${styles.quickActionCard} scroll-animate`}>
                <div className={styles.quickActionIcon}>
                  <FaPills />
                </div>
                <h4>Gửi thuốc</h4>
                <p>Đăng ký gửi thuốc cho học sinh</p>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.quickActionCol}>
              <div className={`${styles.quickActionCard} scroll-animate`}>
                <div className={styles.quickActionIcon}>
                  <FaBell />
                </div>
                <h4>Thông báo</h4>
                <p>Xem thông báo từ nhà trường</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>
            <FaStar /> Tại sao chọn chúng tôi?
          </h2>
          <Row className={styles.featuresRow}>
            <Col lg={3} md={6} className={styles.featureCol}>
              <div className={`${styles.featureCard} scroll-animate`}>
                <div className={styles.featureIcon}>
                  <FaClock />
                </div>
                <div className={styles.featureContent}>
                  <h4>24/7 Hỗ trợ</h4>
                  <p>
                    Dịch vụ chăm sóc sức khỏe liên tục, sẵn sàng hỗ trợ mọi lúc
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.featureCol}>
              <div className={`${styles.featureCard} scroll-animate`}>
                <div className={styles.featureIcon}>
                  <FaArrowRight />
                </div>
                <div className={styles.featureContent}>
                  <h4>Xử lý nhanh chóng</h4>
                  <p>
                    Quy trình làm việc hiệu quả, đảm bảo thời gian phản hồi
                    nhanh
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.featureCol}>
              <div className={`${styles.featureCard} scroll-animate`}>
                <div className={styles.featureIcon}>
                  <FaShieldAlt />
                </div>
                <div className={styles.featureContent}>
                  <h4>Bảo mật thông tin</h4>
                  <p>
                    Đảm bảo an toàn và bảo mật thông tin cá nhân của học sinh
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className={styles.featureCol}>
              <div className={`${styles.featureCard} scroll-animate`}>
                <div className={styles.featureIcon}>
                  <FaHeartbeat />
                </div>
                <div className={styles.featureContent}>
                  <h4>Chăm sóc tận tình</h4>
                  <p>Đội ngũ y tế chuyên nghiệp, tận tâm với từng học sinh</p>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* About School Section */}
        <section className={styles.aboutSection}>
          <Row className={styles.aboutRow}>
            <Col>
              <div className={styles.aboutBadge}>
                <FaSchool /> Về chúng tôi
              </div>
            </Col>
          </Row>
          <Row className={styles.aboutRow}>
            <Col lg={6} className={styles.aboutContent}>
              <h2 className={styles.aboutTitle}>
                Hệ thống y tế học đường hiện đại
              </h2>
              <p className={styles.aboutDesc}>
                Trường chúng tôi tự hào là một trong những cơ sở giáo dục hàng
                đầu với hệ thống y tế học đường hiện đại và chuyên nghiệp. Với
                đội ngũ nhân viên y tế giàu kinh nghiệm, chúng tôi cam kết mang
                đến dịch vụ chăm sóc sức khỏe tốt nhất cho học sinh.
              </p>
              <div className={styles.aboutFeatures}>
                <div className={styles.aboutFeature}>
                  <FaCheckCircle />
                  <span>Phòng y tế được trang bị đầy đủ thiết bị</span>
                </div>
                <div className={styles.aboutFeature}>
                  <FaCheckCircle />
                  <span>Đội ngũ y tế chuyên nghiệp, giàu kinh nghiệm</span>
                </div>
                <div className={styles.aboutFeature}>
                  <FaCheckCircle />
                  <span>Hệ thống quản lý thông tin hiện đại</span>
                </div>
              </div>
            </Col>
            <Col lg={6} className={styles.aboutImage}>
              <img
                src={aboutImage}
                alt="School Building"
                className={styles.aboutImg}
              />
              <div className={styles.aboutImgOverlay}></div>
            </Col>
          </Row>
        </section>

        {/* Contact Info Section */}
        <section className={styles.contactSection}>
          <Row className={styles.contactRow}>
            <Col lg={4} md={6} className={styles.contactCol}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <FaPhone />
                </div>
                <h4>Điện thoại</h4>
                <p>0123 456 789</p>
                <p>0987 654 321</p>
              </div>
            </Col>
            <Col lg={4} md={6} className={styles.contactCol}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <FaEnvelope />
                </div>
                <h4>Email</h4>
                <p>yte@truonghoc.edu.vn</p>
                <p>support@truonghoc.edu.vn</p>
              </div>
            </Col>
            <Col lg={4} md={6} className={styles.contactCol}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <FaMapMarkerAlt />
                </div>
                <h4>Địa chỉ</h4>
                <p>123 Đường ABC, Quận XYZ</p>
                <p>Thành phố HCM, Việt Nam</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Blog Section */}
        <section className={styles.blogSection}>
          <div className={styles.blogHeader}>
            <h2 className={styles.sectionTitle}>
              <FaBookOpen /> Blog sức khỏe học đường
            </h2>
            <p className={styles.blogSubtitle}>
              Cập nhật những thông tin mới nhất về chăm sóc sức khỏe học đường
            </p>
          </div>

          {loading ? (
            <Row
              style={{
                maxWidth: "1200px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {[...Array(3)].map((_, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className={styles.blogCard}>
                    <div className={styles.blogImageContainer}>
                      <div
                        className={`${styles.skeleton} ${styles["skeleton-img"]}`}
                      ></div>
                    </div>
                    <Card.Body className={styles.blogBody}>
                      <div className={styles.blogMeta}>
                        <div
                          className={`${styles.skeleton} ${styles["skeleton-meta"]}`}
                        ></div>
                      </div>
                      <h5 className={styles.blogTitleLanding}>
                        <div
                          className={`${styles.skeleton} ${styles["skeleton-title"]}`}
                        ></div>
                      </h5>
                      <p className={styles.blogSummaryLanding}>
                        <div
                          className={`${styles.skeleton} ${styles["skeleton-summary"]}`}
                        ></div>
                        <div
                          className={`${styles.skeleton} ${styles["skeleton-summary"]}`}
                        ></div>
                        <div
                          className={`${styles.skeleton} ${styles["skeleton-summary"]}`}
                        ></div>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : error ? (
            <div className={styles.error}>
              <FaExclamationTriangle size={48} />
              <p>{error}</p>
            </div>
          ) : (
            <Row
              style={{
                maxWidth: "1200px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {blogs.map((blog) => (
                <Col lg={4} md={6} key={blog.id}>
                  <Card
                    className={`${styles.blogCard} scroll-animate`}
                    onClick={() =>
                      navigate(`/landingpage/blog-detail/${blog.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.blogImageContainer}>
                      <img
                        src={blog.imageUrl || aboutImage}
                        alt={blog.title}
                        onError={handleImageError}
                        className={styles.blogImg}
                      />
                    </div>
                    <Card.Body className={styles.blogBody}>
                      <div className={styles.blogMeta}>
                        <FaCalendarAlt style={{ marginRight: 6 }} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <h5 className={styles.blogTitleLanding}>{blog.title}</h5>
                      <p className={styles.blogSummaryLanding}>
                        {blog.contentSummary
                          ? stripHtml(blog.contentSummary).slice(0, 120) +
                            (stripHtml(blog.contentSummary).length > 120
                              ? "..."
                              : "")
                          : "Không có nội dung"}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
