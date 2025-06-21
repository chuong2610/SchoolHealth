import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaUserSecret,
  FaDatabase,
  FaEye,
  FaHandshake,
  FaExclamationTriangle,
  FaEnvelope
} from "react-icons/fa";
// Styles được import từ main.jsx

const Privacy = () => {
  return (
    <div className="parent-theme">
      <style>
        {`
          .privacy-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .privacy-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .privacy-header::before {
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
          
          .privacy-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .privacy-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
            margin-bottom: 2rem !important;
          }
          
          .intro-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            text-align: center !important;
          }
          
          .intro-text {
            font-size: 1.1rem !important;
            color: #374151 !important;
            line-height: 1.8 !important;
            margin: 0 !important;
          }
          
          .content-section {
            padding: 3rem 2rem !important;
          }
          
          .section-item {
            margin-bottom: 3rem !important;
            padding: 2rem !important;
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            transition: all 0.3s ease !important;
          }
          
          .section-item:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.1) !important;
            border-color: #3b82f6 !important;
          }
          
          .section-header {
            display: flex !important;
            align-items: center !important;
            gap: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .section-icon {
            width: 50px !important;
            height: 50px !important;
            border-radius: 15px !important;
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.5rem !important;
          }
          
          .section-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin: 0 !important;
          }
          
          .section-content {
            color: #374151 !important;
            line-height: 1.8 !important;
            font-size: 1rem !important;
          }
          
          .section-list {
            list-style: none !important;
            padding: 0 !important;
            margin: 1rem 0 !important;
          }
          
          .section-list li {
            padding: 0.5rem 0 !important;
            padding-left: 1.5rem !important;
            position: relative !important;
            color: #374151 !important;
            line-height: 1.6 !important;
          }
          
          .section-list li::before {
            content: '•' !important;
            color: #2563eb !important;
            font-weight: bold !important;
            position: absolute !important;
            left: 0 !important;
          }
          
          .highlight-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
            border: 2px solid #3b82f6 !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            margin: 1.5rem 0 !important;
          }
          
          .highlight-text {
            color: #1e40af !important;
            font-weight: 600 !important;
            margin: 0 !important;
            line-height: 1.6 !important;
          }
          
          .contact-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            text-align: center !important;
            border-radius: 0 0 25px 25px !important;
          }
          
          .contact-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
          }
          
          .contact-text {
            color: #6b7280 !important;
            margin-bottom: 2rem !important;
          }
          
          .contact-btn {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 1rem 2rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .contact-btn:hover {
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
            
            .privacy-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .intro-section,
            .content-section,
            .contact-section {
              padding: 1.5rem !important;
            }
            
            .section-item {
              padding: 1.5rem !important;
            }
            
            .section-header {
              flex-direction: column !important;
              text-align: center !important;
              gap: 0.75rem !important;
            }
          }
        `}
      </style>

      <div className="privacy-page">
        {/* Header */}
        <div className="privacy-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Chính sách bảo mật
              </h1>
              <p className="page-subtitle">
                Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="privacy-container">
          <Container>
            <Card className="privacy-card">
              {/* Introduction */}
              <div className="intro-section">
                <p className="intro-text">
                  Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.
                  Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ
                  thông tin của bạn khi sử dụng hệ thống quản lý y tế học đường.
                </p>
              </div>

              <div className="content-section">
                {/* Thông tin thu thập */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaDatabase />
                    </div>
                    <h3 className="section-title">Thông tin chúng tôi thu thập</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Chúng tôi thu thập các loại thông tin sau để cung cấp dịch vụ tốt nhất:
                    </p>
                    <ul className="section-list">
                      <li>Thông tin cá nhân: Họ tên, ngày sinh, địa chỉ, số điện thoại, email</li>
                      <li>Thông tin y tế: Lịch sử khám bệnh, tiêm chủng, dị ứng, thuốc đang sử dụng</li>
                      <li>Thông tin học tập: Lớp học, trường học, thông tin liên hệ khẩn cấp</li>
                      <li>Thông tin sử dụng: Nhật ký truy cập, thời gian sử dụng hệ thống</li>
                    </ul>
                  </div>
                </div>

                {/* Mục đích sử dụng */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaEye />
                    </div>
                    <h3 className="section-title">Mục đích sử dụng thông tin</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Thông tin được thu thập chỉ sử dụng cho các mục đích sau:
                    </p>
                    <ul className="section-list">
                      <li>Cung cấp dịch vụ chăm sóc sức khỏe học đường</li>
                      <li>Theo dõi và quản lý tình trạng sức khỏe học sinh</li>
                      <li>Gửi thông báo về sức khỏe và các sự kiện y tế</li>
                      <li>Liên hệ trong trường hợp khẩn cấp</li>
                      <li>Cải thiện chất lượng dịch vụ</li>
                      <li>Báo cáo thống kê (đã được ẩn danh hóa)</li>
                    </ul>
                  </div>
                </div>

                {/* Bảo mật thông tin */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaLock />
                    </div>
                    <h3 className="section-title">Bảo mật thông tin</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:
                    </p>
                    <ul className="section-list">
                      <li>Mã hóa dữ liệu SSL/TLS 256-bit</li>
                      <li>Hệ thống xác thực đa lớp</li>
                      <li>Kiểm soát truy cập dựa trên vai trò</li>
                      <li>Sao lưu dữ liệu định kỳ</li>
                      <li>Giám sát bảo mật 24/7</li>
                      <li>Đào tạo nhân viên về bảo mật thông tin</li>
                    </ul>

                    <div className="highlight-box">
                      <p className="highlight-text">
                        <FaShieldAlt className="me-2" />
                        Tất cả thông tin y tế được lưu trữ trên máy chủ an toàn và chỉ có
                        nhân viên y tế được ủy quyền mới có thể truy cập.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chia sẻ thông tin */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaHandshake />
                    </div>
                    <h3 className="section-title">Chia sẻ thông tin</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân với bên thứ ba,
                      trừ các trường hợp sau:
                    </p>
                    <ul className="section-list">
                      <li>Khi có sự đồng ý rõ ràng từ phụ huynh/người giám hộ</li>
                      <li>Trong trường hợp khẩn cấp y tế</li>
                      <li>Khi pháp luật yêu cầu</li>
                      <li>Với các đối tác y tế để cung cấp dịch vụ chăm sóc tốt hơn</li>
                    </ul>
                  </div>
                </div>

                {/* Quyền của người dùng */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaUserSecret />
                    </div>
                    <h3 className="section-title">Quyền của bạn</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Bạn có các quyền sau đối với thông tin cá nhân:
                    </p>
                    <ul className="section-list">
                      <li>Quyền truy cập và xem thông tin cá nhân</li>
                      <li>Quyền chỉnh sửa hoặc cập nhật thông tin</li>
                      <li>Quyền yêu cầu xóa thông tin (trong một số trường hợp)</li>
                      <li>Quyền hạn chế xử lý thông tin</li>
                      <li>Quyền rút lại sự đồng ý</li>
                      <li>Quyền khiếu nại về việc xử lý thông tin</li>
                    </ul>
                  </div>
                </div>

                {/* Thay đổi chính sách */}
                <div className="section-item">
                  <div className="section-header">
                    <div className="section-icon">
                      <FaExclamationTriangle />
                    </div>
                    <h3 className="section-title">Thay đổi chính sách</h3>
                  </div>
                  <div className="section-content">
                    <p>
                      Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                      Mọi thay đổi quan trọng sẽ được thông báo qua:
                    </p>
                    <ul className="section-list">
                      <li>Email thông báo đến tất cả người dùng</li>
                      <li>Thông báo trên hệ thống</li>
                      <li>Cập nhật trên trang web chính thức</li>
                    </ul>

                    <div className="highlight-box">
                      <p className="highlight-text">
                        Ngày cập nhật gần nhất: 19/06/2024<br />
                        Chính sách này có hiệu lực từ ngày 01/01/2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="contact-section">
                <h3 className="contact-title">Cần hỗ trợ về bảo mật?</h3>
                <p className="contact-text">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc cách chúng tôi
                  xử lý thông tin của bạn, hãy liên hệ với chúng tôi.
                </p>
                <Link to="/parent/contact" className="contact-btn">
                  <FaEnvelope />
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

export default Privacy;
