import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaHeartbeat,
  FaUsers,
  FaBookOpen,
  FaArrowRight,
  FaShieldAlt,
  FaUserMd
} from "react-icons/fa";
// Styles được import từ main.jsx

const MoreKnow = () => {
  return (
    <div className="parent-theme">
      <style>
        {`
          .more-know-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .more-know-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .more-know-header::before {
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
          
          .page-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 1rem !important;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2) !important;
          }
          
          .page-subtitle {
            font-size: 1.2rem !important;
            opacity: 0.95 !important;
            margin: 0 !important;
            font-weight: 400 !important;
          }
          
          .more-know-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .info-card {
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1) !important;
            border: 2px solid #e5e7eb !important;
            padding: 2rem !important;
            height: 100% !important;
            text-align: center !important;
            transition: all 0.3s ease !important;
          }
          
          .info-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15) !important;
            border-color: #3b82f6 !important;
          }
          
          .info-icon {
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
          
          .info-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
          }
          
          .info-description {
            color: #6b7280 !important;
            line-height: 1.6 !important;
            margin-bottom: 2rem !important;
          }
          
          .learn-more-btn {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .learn-more-btn:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3) !important;
            color: white !important;
            text-decoration: none !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
            }
            
            .page-subtitle {
              font-size: 1rem !important;
            }
            
            .more-know-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .info-card {
              margin-bottom: 2rem !important;
              padding: 1.5rem !important;
            }
          }
        `}
      </style>

      <div className="more-know-page">
        {/* Header */}
        <div className="more-know-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Tìm hiểu thêm
              </h1>
              <p className="page-subtitle">
                Khám phá các dịch vụ và tính năng của hệ thống
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="more-know-container">
          <Container>
            <Row className="g-4">
              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaHeartbeat />
                  </div>
                  <h3 className="info-title">Chăm sóc sức khỏe</h3>
                  <p className="info-description">
                    Hệ thống theo dõi sức khỏe toàn diện với các tính năng
                    khám sức khỏe định kỳ, tiêm chủng và theo dõi tình trạng sức khỏe.
                  </p>
                  <Link to="/parent/about" className="learn-more-btn">
                    <FaArrowRight />
                    Tìm hiểu thêm
                  </Link>
                </Card>
              </Col>

              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaShieldAlt />
                  </div>
                  <h3 className="info-title">An toàn & Bảo mật</h3>
                  <p className="info-description">
                    Thông tin y tế được bảo vệ bằng công nghệ mã hóa tiên tiến,
                    đảm bảo tính riêng tư và an toàn tuyệt đối.
                  </p>
                  <Link to="/parent/privacy" className="learn-more-btn">
                    <FaArrowRight />
                    Chính sách bảo mật
                  </Link>
                </Card>
              </Col>

              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaUserMd />
                  </div>
                  <h3 className="info-title">Đội ngũ y tế</h3>
                  <p className="info-description">
                    Đội ngũ y tá chuyên nghiệp với kinh nghiệm dày dặn trong
                    chăm sóc sức khỏe học đường và y tế cộng đồng.
                  </p>
                  <Link to="/parent/contact" className="learn-more-btn">
                    <FaArrowRight />
                    Liên hệ
                  </Link>
                </Card>
              </Col>

              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaUsers />
                  </div>
                  <h3 className="info-title">Cộng đồng</h3>
                  <p className="info-description">
                    Kết nối giữa nhà trường, phụ huynh và đội ngũ y tế để
                    tạo nên môi trường chăm sóc sức khỏe tốt nhất.
                  </p>
                  <Link to="/parent/faq" className="learn-more-btn">
                    <FaArrowRight />
                    FAQ
                  </Link>
                </Card>
              </Col>

              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaBookOpen />
                  </div>
                  <h3 className="info-title">Tài liệu hướng dẫn</h3>
                  <p className="info-description">
                    Hướng dẫn chi tiết cách sử dụng hệ thống và các thông tin
                    giáo dục sức khỏe dành cho học sinh.
                  </p>
                  <Link to="/parent/dashboard" className="learn-more-btn">
                    <FaArrowRight />
                    Xem bài viết
                  </Link>
                </Card>
              </Col>

              <Col lg={4} md={6}>
                <Card className="info-card">
                  <div className="info-icon">
                    <FaGraduationCap />
                  </div>
                  <h3 className="info-title">Giáo dục sức khỏe</h3>
                  <p className="info-description">
                    Chương trình giáo dục sức khỏe toàn diện giúp học sinh
                    phát triển thói quen sống khỏe mạnh.
                  </p>
                  <Link to="/parent/settings" className="learn-more-btn">
                    <FaArrowRight />
                    Cài đặt
                  </Link>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MoreKnow;
