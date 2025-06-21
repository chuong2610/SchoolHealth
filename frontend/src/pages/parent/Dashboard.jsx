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
import architecturalConcept from '../../assets/architectural concept.jpg';
import collegeStudentsImage from '../../assets/Op Ed_ Should College Students Avoid Debt_.jpg';
import downloadImage from '../../assets/download.jpg';
import healthCareImage from '../../assets/CHĂM SÓC SỨC KHỎE TOÀN DIỆN LÀ GÌ_.jpg';
import medicineImage from '../../assets/Wednesday August 2nd 2023 CVS Health Layoffs 5000 Jobs Cut_ A Ripple Effect on our Economy and Lives.jpg';
import securityImage from '../../assets/Las 8 mejores aplicaciones de seguridad personal.jpg';
import supportImage from '../../assets/Dịch vụ hỗ trợ khách hàng tại Zaloqq.jpg';
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
      <div
        className="parent-page-header parent-animate-fade-in"
        style={{
          position: 'relative',
          minHeight: '400px',
          backgroundImage: `linear-gradient(rgba(253, 248, 248, 0.81), rgba(255, 253, 253, 0.16)), url(${collegeStudentsImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="parent-page-header-content" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
        }}>
          <h1 className="parent-page-title" style={{
            color: 'rgb(50, 179, 253)',
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)'
          }}>
            <FaHeartbeat className="me-3" />
            Chăm sóc sức khỏe học đường
          </h1>
          <p className="parent-page-subtitle" style={{
            color: 'white',
            fontSize: '1.3rem',
            marginBottom: '2rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Đồng hành cùng phụ huynh trong việc chăm sóc và theo dõi sức khỏe học sinh
          </p>
          <Button
            as={Link}
            to="/parent/more-know"
            className="parent-primary-btn mt-3"
            size="lg"
            style={{
              background: 'rgba(252, 252, 252, 0.71)',
              border: 'none',
              color: 'rgb(11, 92, 146)',
              padding: '15px 30px',
              fontSize: '1.3rem',
              fontWeight: '500',
              borderRadius: '50px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            }}
          >
            <FaBookOpen className="me-2" style={{ color: 'rgb(50, 179, 253)' }} />
            Tìm hiểu thêm
          </Button>
          <div className="text-center mt-4">
            <small style={{
              color: 'rgb(255, 255, 255)',
              fontSize: '1rem',
              fontStyle: 'italic',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}>
              🎓 Cùng nhau xây dựng tương lai tươi sáng cho thế hệ trẻ
            </small>
          </div>
        </div>
        {/* Decorative overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(30, 126, 156, 0.1) 0%, rgba(240, 98, 146, 0.1) 100%)',
          zIndex: 1
        }}></div>
      </div>

      <Container>
        {/* Welcome Section */}
        <div className="parent-card parent-animate-fade-in mb-4" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)), url(${architecturalConcept})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '300px'
        }}>
          <div className="parent-card-header" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="parent-card-title">
              <FaHome />
              Chào mừng đến với hệ thống quản lý sức khỏe
            </h2>
          </div>
          <div className="parent-card-body" style={{ position: 'relative', zIndex: 2 }}>
            <Row className="align-items-center">
              <Col md={5} className="text-center mb-4 mb-md-0">
                <div className="welcome-image-container" style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(30, 126, 156, 0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  background: 'white',
                  padding: '10px'
                }}>
                  <img
                    src={downloadImage}
                    alt="Hệ thống quản lý sức khỏe hiện đại"
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      borderRadius: '15px',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.parentElement.style.transform = 'perspective(1000px) rotateY(0deg) translateY(-5px)';
                      e.currentTarget.parentElement.style.boxShadow = '0 20px 40px rgba(30, 126, 156, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.parentElement.style.transform = 'perspective(1000px) rotateY(-5deg) translateY(0)';
                      e.currentTarget.parentElement.style.boxShadow = '0 15px 35px rgba(30, 126, 156, 0.3)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    color: 'var(--parent-primary)',
                    fontSize: '1.5rem'
                  }}>
                    <FaHeartbeat />
                  </div>
                </div>
              </Col>
              <Col md={7}>
                <div className="welcome-content">
                  <p className="mb-4" style={{
                    fontSize: '1.3rem',
                    lineHeight: '1.7',
                    fontWeight: '500',
                    color: '#2d3748',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                    marginBottom: '1.5rem'
                  }}>
                    Hệ thống giúp phụ huynh theo dõi và quản lý sức khỏe của con em một cách chuyên nghiệp,
                    đảm bảo an toàn và hiệu quả trong môi trường học đường hiện đại.
                  </p>
                  <div className="d-flex gap-3 flex-wrap mb-4">
                    <Badge bg="success" className="p-3" style={{
                      fontSize: '1rem',
                      boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '25px'
                    }}>
                      <FaShieldAlt className="me-2" />
                      An toàn tuyệt đối
                    </Badge>
                    <Badge bg="primary" className="p-3" style={{
                      fontSize: '1rem',
                      boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '25px'
                    }}>
                      <FaUserMd className="me-2" />
                      Đội ngũ chuyên nghiệp
                    </Badge>
                    <Badge bg="info" className="p-3" style={{
                      fontSize: '1rem',
                      boxShadow: '0 6px 20px rgba(23, 162, 184, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '25px'
                    }}>
                      <FaClock className="me-2" />
                      Hỗ trợ 24/7
                    </Badge>
                  </div>
                  <div className="features-highlight" style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid rgba(30, 126, 156, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div className="d-flex align-items-center mb-2">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--parent-gradient-button)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        marginRight: '15px'
                      }}>
                        <FaGraduationCap />
                      </div>
                      <div>
                        <h6 className="mb-1" style={{ color: 'var(--parent-primary)', fontWeight: 'bold' }}>
                          Công nghệ hiện đại
                        </h6>
                        <small style={{
                          color: '#6c757d',
                          fontSize: '0.9rem',
                          fontStyle: 'italic'
                        }}>
                          🏫 Môi trường học đường thông minh với concept kiến trúc tiên tiến
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* Decorative overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(30, 126, 156, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
            zIndex: 1
          }}></div>
        </div>

        {/* Statistics Dashboard */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`} style={{
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.75)), url(${healthCareImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '2px solid rgba(240, 98, 146, 0.3)',
              boxShadow: '0 8px 25px rgba(240, 98, 146, 0.2)',
              overflow: 'hidden'
            }}>
              <div className="parent-stat-icon" style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
                boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
                position: 'relative',
                zIndex: 2
              }}>
                <FaHeartbeat />
              </div>
              <div className="parent-stat-value" style={{
                color: '#E91E63',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>24/7</div>
              <div className="parent-stat-label" style={{
                color: '#2d3748',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>Chăm sóc sức khỏe</div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                background: 'rgba(233, 30, 99, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                zIndex: 1
              }}>
                ❤️
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
                zIndex: 1
              }}></div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`} style={{
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.75)), url(${medicineImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '2px solid rgba(23, 162, 184, 0.3)',
              boxShadow: '0 8px 25px rgba(23, 162, 184, 0.2)',
              overflow: 'hidden'
            }}>
              <div className="parent-stat-icon" style={{
                background: 'linear-gradient(135deg, #17a2b8 0%, #20c997 100%)',
                boxShadow: '0 6px 20px rgba(23, 162, 184, 0.4)',
                position: 'relative',
                zIndex: 2
              }}>
                <FaPills />
              </div>
              <div className="parent-stat-value" style={{
                color: '#17a2b8',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>100%</div>
              <div className="parent-stat-label" style={{
                color: '#2d3748',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>Quản lý thuốc</div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                background: 'rgba(23, 162, 184, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                zIndex: 1
              }}>
                💊
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%)',
                zIndex: 1
              }}></div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`} style={{
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.75)), url(${securityImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '2px solid rgba(40, 167, 69, 0.3)',
              boxShadow: '0 8px 25px rgba(40, 167, 69, 0.2)',
              overflow: 'hidden'
            }}>
              <div className="parent-stat-icon" style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                boxShadow: '0 6px 20px rgba(40, 167, 69, 0.4)',
                position: 'relative',
                zIndex: 2
              }}>
                <FaShieldAlt />
              </div>
              <div className="parent-stat-value" style={{
                color: '#28a745',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>Safe</div>
              <div className="parent-stat-label" style={{
                color: '#2d3748',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>An toàn tuyệt đối</div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                background: 'rgba(40, 167, 69, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                zIndex: 1
              }}>
                🛡️
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%)',
                zIndex: 1
              }}></div>
            </div>
          </Col>
          <Col lg={3} md={6}>
            <div className={`parent-stat-card parent-animate-fade-in ${animateStats ? 'animate-in' : ''}`} style={{
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.75)), url(${supportImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '2px solid rgba(255, 152, 0, 0.3)',
              boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)',
              overflow: 'hidden'
            }}>
              <div className="parent-stat-icon" style={{
                background: 'linear-gradient(135deg, #ff9800 0%, #ff6f00 100%)',
                boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                position: 'relative',
                zIndex: 2
              }}>
                <FaUserMd />
              </div>
              <div className="parent-stat-value" style={{
                color: '#ff9800',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>Pro</div>
              <div className="parent-stat-label" style={{
                color: '#2d3748',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                position: 'relative',
                zIndex: 2
              }}>Hỗ trợ chuyên nghiệp</div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 152, 0, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                zIndex: 1
              }}>
                🎧
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 111, 0, 0.05) 100%)',
                zIndex: 1
              }}></div>
            </div>
          </Col>
        </Row>



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
