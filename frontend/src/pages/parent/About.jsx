import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHeartbeat, FaPills, FaBell, FaGraduationCap, FaShieldAlt, FaUsers } from "react-icons/fa";
// Styles được import từ main.jsx

const About = () => {
  return (
    <div className="parent-theme">
      <style>
        {`
          .about-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .about-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .about-header::before {
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
          
          .about-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .about-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
            padding: 3rem 2rem !important;
          }
          
          .intro-section {
            text-align: center !important;
            margin-bottom: 3rem !important;
          }
          
          .intro-text {
            font-size: 1.25rem !important;
            color: #374151 !important;
            line-height: 1.8 !important;
            margin-bottom: 2rem !important;
          }
          
          .features-section {
            margin: 3rem 0 !important;
          }
          
          .section-title {
            text-align: center !important;
            font-size: 2rem !important;
            font-weight: 700 !important;
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
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1) !important;
            border: 2px solid #e5e7eb !important;
            padding: 2rem !important;
            height: 100% !important;
            text-align: center !important;
            transition: all 0.3s ease !important;
          }
          
          .feature-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15) !important;
            border-color: #3b82f6 !important;
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
          }
          
          .feature-description {
            color: #6b7280 !important;
            line-height: 1.6 !important;
            font-size: 1rem !important;
          }
          
          .cta-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 3rem 2rem !important;
            border-radius: 20px !important;
            text-align: center !important;
            margin-top: 3rem !important;
          }
          
          .cta-title {
            font-size: 1.8rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
          }
          
          .cta-description {
            color: #6b7280 !important;
            font-size: 1.1rem !important;
            margin-bottom: 2rem !important;
          }
          
          .btn-cta {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 1rem 3rem !important;
            border-radius: 25px !important;
            font-weight: 700 !important;
            font-size: 1.1rem !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            display: inline-block !important;
          }
          
          .btn-cta:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3) !important;
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
            
            .about-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .about-card {
              padding: 2rem 1rem !important;
            }
            
            .feature-card {
              margin-bottom: 2rem !important;
            }
            
            .btn-cta {
              width: 100% !important;
              padding: 1rem 2rem !important;
            }
          }
        `}
      </style>

      <div className="about-page">
        {/* Header */}
        <div className="about-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Giới thiệu về Hệ thống Y tế Học đường
              </h1>
              <p className="page-subtitle">
                Giải pháp toàn diện cho việc quản lý sức khỏe học sinh
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="about-container">
          <Container>
            <Card className="about-card">
              {/* Introduction */}
              <div className="intro-section">
                <p className="intro-text">
                  Hệ thống Quản lý Y tế Học đường là giải pháp tiên tiến giúp nhà trường,
                  phụ huynh và y tá quản lý sức khỏe học sinh một cách hiệu quả,
                  chính xác và kịp thời. Chúng tôi cam kết mang đến trải nghiệm
                  chăm sóc sức khỏe tốt nhất cho con em bạn.
                </p>
              </div>

              {/* Features */}
              <div className="features-section">
                <h2 className="section-title">Điểm nổi bật</h2>
                <Row className="g-4">
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaHeartbeat />
                      </div>
                      <h5 className="feature-title">Theo dõi sức khỏe</h5>
                      <p className="feature-description">
                        Cung cấp lịch sử sức khỏe chi tiết và hệ thống khai báo y tế
                        nhanh chóng, chính xác giúp theo dõi tình trạng sức khỏe học sinh.
                      </p>
                    </Card>
                  </Col>
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaPills />
                      </div>
                      <h5 className="feature-title">Quản lý thuốc</h5>
                      <p className="feature-description">
                        Hỗ trợ gửi và nhận thuốc giữa phụ huynh và y tá một cách
                        an toàn, minh bạch với hệ thống theo dõi chi tiết.
                      </p>
                    </Card>
                  </Col>
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaBell />
                      </div>
                      <h5 className="feature-title">Thông báo kịp thời</h5>
                      <p className="feature-description">
                        Gửi thông báo về sức khỏe và sự kiện y tế ngay lập tức
                        đến phụ huynh, đảm bảo không bỏ lỡ thông tin quan trọng.
                      </p>
                    </Card>
                  </Col>
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaShieldAlt />
                      </div>
                      <h5 className="feature-title">Bảo mật thông tin</h5>
                      <p className="feature-description">
                        Đảm bảo tính bảo mật cao cho thông tin y tế cá nhân
                        với hệ thống mã hóa tiên tiến và phân quyền chặt chẽ.
                      </p>
                    </Card>
                  </Col>
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaGraduationCap />
                      </div>
                      <h5 className="feature-title">Hỗ trợ giáo dục</h5>
                      <p className="feature-description">
                        Cung cấp thông tin giáo dục sức khỏe và hướng dẫn
                        chăm sóc sức khỏe phù hợp với từng độ tuổi học sinh.
                      </p>
                    </Card>
                  </Col>
                  <Col lg={4} md={6}>
                    <Card className="feature-card">
                      <div className="feature-icon">
                        <FaUsers />
                      </div>
                      <h5 className="feature-title">Kết nối cộng đồng</h5>
                      <p className="feature-description">
                        Tạo cầu nối hiệu quả giữa nhà trường, phụ huynh và
                        đội ngũ y tế trong việc chăm sóc sức khỏe học sinh.
                      </p>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Call to Action */}
              <div className="cta-section">
                <h3 className="cta-title">
                  Sẵn sàng bắt đầu chăm sóc sức khỏe tốt hơn?
                </h3>
                <p className="cta-description">
                  Liên hệ với chúng tôi để được tư vấn và hỗ trợ sử dụng hệ thống một cách hiệu quả nhất.
                </p>
                <Link to="/parent/contact" className="btn-cta">
                  Liên hệ ngay
                </Link>
              </div>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default About;
