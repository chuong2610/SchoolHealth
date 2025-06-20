import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion, Form, Button } from "react-bootstrap";
import {
  FaSearch,
  FaQuestionCircle,
  FaChevronDown,
  FaHeartbeat,
  FaPills,
  FaBell,
  FaShieldAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
// Styles được import từ main.jsx

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      id: 1,
      category: "Sức khỏe",
      question: "Làm thế nào để theo dõi tình trạng sức khỏe của con em tôi?",
      answer: "Bạn có thể theo dõi tình trạng sức khỏe của con em mình thông qua trang 'Lịch sử sức khỏe' trong hệ thống. Tại đây, bạn sẽ thấy đầy đủ thông tin về các lần khám sức khỏe, tiêm chủng, và tình trạng sức khỏe hiện tại của học sinh."
    },
    {
      id: 2,
      category: "Thuốc",
      question: "Tôi có thể gửi thuốc cho con ở trường như thế nào?",
      answer: "Để gửi thuốc cho con em tại trường, bạn truy cập vào trang 'Gửi thuốc', điền đầy đủ thông tin về loại thuốc, liều dùng và ghi chú cần thiết. Y tá sẽ xem xét và phản hồi yêu cầu của bạn."
    },
    {
      id: 3,
      category: "Thông báo",
      question: "Làm sao để nhận thông báo kịp thời từ nhà trường?",
      answer: "Hệ thống sẽ tự động gửi thông báo qua email và hiển thị trong mục 'Thông báo' của tài khoản. Bạn có thể cập nhật thông tin liên lạc trong phần 'Hồ sơ' để đảm bảo nhận đầy đủ thông báo."
    },
    {
      id: 4,
      category: "Khai báo y tế",
      question: "Khi nào tôi cần khai báo y tế cho con em?",
      answer: "Bạn cần khai báo y tế khi con em có dấu hiệu bệnh tật, dị ứng mới phát hiện, hoặc khi nhà trường yêu cầu. Việc khai báo giúp y tá có thông tin chính xác để chăm sóc sức khỏe học sinh tốt nhất."
    },
    {
      id: 5,
      category: "Tài khoản",
      question: "Làm thế nào để thay đổi mật khẩu tài khoản?",
      answer: "Bạn có thể thay đổi mật khẩu trong phần 'Hồ sơ' > tab 'Bảo mật'. Nhập mật khẩu hiện tại và mật khẩu mới, sau đó nhấn 'Lưu thay đổi' để hoàn tất."
    },
    {
      id: 6,
      category: "Hỗ trợ",
      question: "Tôi gặp vấn đề kỹ thuật, làm sao để được hỗ trợ?",
      answer: "Nếu gặp vấn đề kỹ thuật, bạn có thể liên hệ với chúng tôi qua trang 'Liên hệ' hoặc gọi hotline hỗ trợ. Đội ngũ kỹ thuật sẽ hỗ trợ bạn trong thời gian sớm nhất."
    }
  ];

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Sức khỏe":
        return <FaHeartbeat />;
      case "Thuốc":
        return <FaPills />;
      case "Thông báo":
        return <FaBell />;
      case "Khai báo y tế":
        return <FaShieldAlt />;
      default:
        return <FaQuestionCircle />;
    }
  };

  return (
    <div className="parent-theme">
      <style>
        {`
          .faq-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .faq-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .faq-header::before {
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
          
          .faq-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .faq-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .search-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-radius: 25px 25px 0 0 !important;
          }
          
          .search-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
            text-align: center !important;
          }
          
          .search-input {
            border: 2px solid #e5e7eb !important;
            border-radius: 15px !important;
            padding: 1rem 1.5rem !important;
            padding-left: 3rem !important;
            font-size: 1.1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
            width: 100% !important;
          }
          
          .search-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .search-input-wrapper {
            position: relative !important;
          }
          
          .search-icon {
            position: absolute !important;
            left: 1rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            color: #6b7280 !important;
            font-size: 1.2rem !important;
            z-index: 5 !important;
          }
          
          .faq-content {
            padding: 2rem !important;
          }
          
          .accordion-custom {
            border: none !important;
          }
          
          .accordion-item-custom {
            background: white !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 16px !important;
            margin-bottom: 1rem !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
          }
          
          .accordion-item-custom:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1) !important;
          }
          
          .accordion-header-custom {
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%) !important;
            padding: 1.5rem !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          
          .accordion-header-custom:hover {
            background: linear-gradient(135deg, #e3f2fd 0%, #dbeafe 100%) !important;
          }
          
          .accordion-question {
            display: flex !important;
            align-items: center !important;
            gap: 1rem !important;
            flex: 1 !important;
          }
          
          .category-badge {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 20px !important;
            font-size: 0.85rem !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            min-width: fit-content !important;
          }
          
          .question-text {
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            color: #1f2937 !important;
            margin: 0 !important;
          }
          
          .accordion-chevron {
            color: #6b7280 !important;
            font-size: 1.2rem !important;
            transition: transform 0.3s ease !important;
          }
          
          .accordion-chevron.expanded {
            transform: rotate(180deg) !important;
          }
          
          .accordion-body-custom {
            padding: 1.5rem !important;
            border-top: 2px solid #e5e7eb !important;
            background: #f8f9fa !important;
          }
          
          .answer-text {
            font-size: 1rem !important;
            color: #374151 !important;
            line-height: 1.8 !important;
            margin: 0 !important;
          }
          
          .no-results {
            text-align: center !important;
            padding: 3rem 2rem !important;
            color: #6b7280 !important;
          }
          
          .no-results-icon {
            font-size: 4rem !important;
            color: #d1d5db !important;
            margin-bottom: 1rem !important;
          }
          
          .contact-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-radius: 0 0 25px 25px !important;
            text-align: center !important;
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
          
          .contact-buttons {
            display: flex !important;
            gap: 1rem !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          
          .contact-btn {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            text-decoration: none !important;
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
            
            .faq-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .search-section,
            .faq-content,
            .contact-section {
              padding: 1.5rem !important;
            }
            
            .accordion-question {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.75rem !important;
            }
            
            .question-text {
              font-size: 1rem !important;
            }
            
            .contact-buttons {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            .contact-btn {
              width: 100% !important;
              max-width: 300px !important;
              justify-content: center !important;
            }
          }
        `}
      </style>

      <div className="faq-page">
        {/* Header */}
        <div className="faq-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Câu hỏi thường gặp
              </h1>
              <p className="page-subtitle">
                Tìm câu trả lời cho những thắc mắc phổ biến về hệ thống
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="faq-container">
          <Container>
            <Card className="faq-card">
              {/* Search Section */}
              <div className="search-section">
                <h2 className="search-title">Tìm kiếm câu hỏi</h2>
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    className="search-input"
                    placeholder="Nhập từ khóa để tìm kiếm câu hỏi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* FAQ Content */}
              <div className="faq-content">
                {filteredFAQ.length > 0 ? (
                  <Accordion className="accordion-custom">
                    {filteredFAQ.map((item) => (
                      <div key={item.id} className="accordion-item-custom">
                        <Accordion.Header>
                          <div className="accordion-header-custom">
                            <div className="accordion-question">
                              <div className="category-badge">
                                {getCategoryIcon(item.category)}
                                {item.category}
                              </div>
                              <h5 className="question-text">{item.question}</h5>
                            </div>
                            <FaChevronDown className="accordion-chevron" />
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="accordion-body-custom">
                            <p className="answer-text">{item.answer}</p>
                          </div>
                        </Accordion.Body>
                      </div>
                    ))}
                  </Accordion>
                ) : (
                  <div className="no-results">
                    <FaQuestionCircle className="no-results-icon" />
                    <h5>Không tìm thấy câu hỏi phù hợp</h5>
                    <p>Thử sử dụng từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="contact-section">
                <h3 className="contact-title">Cần hỗ trợ thêm?</h3>
                <p className="contact-text">
                  Nếu bạn không tìm thấy câu trả lời mong muốn, hãy liên hệ trực tiếp với chúng tôi.
                </p>
                <div className="contact-buttons">
                  <a href="tel:024-3826-5555" className="contact-btn">
                    <FaPhone />
                    Gọi hotline
                  </a>
                  <a href="mailto:support@schoolhealth.edu.vn" className="contact-btn">
                    <FaEnvelope />
                    Gửi email
                  </a>
                </div>
              </div>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
