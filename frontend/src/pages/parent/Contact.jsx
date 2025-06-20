import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUser,
  FaBuilding,
  FaClock,
  FaQuestionCircle
} from "react-icons/fa";
// Styles được import từ main.jsx

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setShowAlert(true);
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      setTimeout(() => setShowAlert(false), 5000);
    }, 2000);
  };

  return (
    <div className="parent-theme">
      <style>
        {`
          .contact-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .contact-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 3rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .contact-header::before {
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
          
          .contact-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          .contact-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .contact-info-section {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-radius: 25px 25px 0 0 !important;
          }
          
          .info-card {
            background: white !important;
            border-radius: 16px !important;
            padding: 1.5rem !important;
            text-align: center !important;
            border: 2px solid #e5e7eb !important;
            transition: all 0.3s ease !important;
            height: 100% !important;
          }
          
          .info-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15) !important;
            border-color: #3b82f6 !important;
          }
          
          .info-icon {
            width: 60px !important;
            height: 60px !important;
            border-radius: 15px !important;
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.5rem !important;
            margin: 0 auto 1rem auto !important;
          }
          
          .info-title {
            font-size: 1.2rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .info-text {
            color: #6b7280 !important;
            line-height: 1.6 !important;
          }
          
          .form-section {
            padding: 2rem !important;
          }
          
          .form-title {
            font-size: 1.8rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 2rem !important;
            text-align: center !important;
            position: relative !important;
          }
          
          .form-title::after {
            content: '' !important;
            position: absolute !important;
            bottom: -10px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 60px !important;
            height: 3px !important;
            background: linear-gradient(90deg, #2563eb, #38b6ff) !important;
            border-radius: 2px !important;
          }
          
          .form-group-enhanced {
            margin-bottom: 1.5rem !important;
          }
          
          .form-label-enhanced {
            font-weight: 600 !important;
            color: #374151 !important;
            margin-bottom: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            font-size: 0.95rem !important;
          }
          
          .form-control-enhanced {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 0.75rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
            background: white !important;
          }
          
          .form-control-enhanced:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
          
          .submit-btn {
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
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            margin: 0 auto !important;
          }
          
          .submit-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3) !important;
            color: white !important;
          }
          
          .submit-btn:disabled {
            background: #9ca3af !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
          }
          
          .alert-custom {
            border-radius: 12px !important;
            border: none !important;
            padding: 1rem 1.5rem !important;
            margin-bottom: 2rem !important;
          }
          
          .alert-success-custom {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
            color: #166534 !important;
            border-left: 4px solid #16a34a !important;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 2rem !important;
            }
            
            .page-subtitle {
              font-size: 1rem !important;
            }
            
            .contact-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .contact-info-section,
            .form-section {
              padding: 1.5rem !important;
            }
            
            .submit-btn {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}
      </style>

      <div className="contact-page">
        {/* Header */}
        <div className="contact-header">
          <Container>
            <div className="header-content">
              <h1 className="page-title">
                Liên hệ với chúng tôi
              </h1>
              <p className="page-subtitle">
                Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn
              </p>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="contact-container">
          <Container>
            <Card className="contact-card">
              {/* Contact Information */}
              <div className="contact-info-section">
                <Row className="g-4">
                  <Col lg={3} md={6}>
                    <Card className="info-card">
                      <div className="info-icon">
                        <FaPhone />
                      </div>
                      <h5 className="info-title">Điện thoại</h5>
                      <p className="info-text">
                        024 3826 5555<br />
                        0912 345 678
                      </p>
                    </Card>
                  </Col>
                  <Col lg={3} md={6}>
                    <Card className="info-card">
                      <div className="info-icon">
                        <FaEnvelope />
                      </div>
                      <h5 className="info-title">Email</h5>
                      <p className="info-text">
                        info@schoolhealth.edu.vn<br />
                        support@schoolhealth.edu.vn
                      </p>
                    </Card>
                  </Col>
                  <Col lg={3} md={6}>
                    <Card className="info-card">
                      <div className="info-icon">
                        <FaMapMarkerAlt />
                      </div>
                      <h5 className="info-title">Địa chỉ</h5>
                      <p className="info-text">
                        123 Đường Xuân Thủy<br />
                        Cầu Giấy, Hà Nội
                      </p>
                    </Card>
                  </Col>
                  <Col lg={3} md={6}>
                    <Card className="info-card">
                      <div className="info-icon">
                        <FaClock />
                      </div>
                      <h5 className="info-title">Giờ làm việc</h5>
                      <p className="info-text">
                        T2 - T6: 8:00 - 17:00<br />
                        T7: 8:00 - 12:00
                      </p>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Contact Form */}
              <div className="form-section">
                <h2 className="form-title">
                  <FaQuestionCircle className="me-2" />
                  Gửi câu hỏi cho chúng tôi
                </h2>

                {showAlert && (
                  <Alert className="alert-custom alert-success-custom">
                    <strong>Thành công!</strong> Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group-enhanced">
                        <Form.Label className="form-label-enhanced">
                          <FaUser /> Họ và tên *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          className="form-control-enhanced"
                          placeholder="Nhập họ và tên của bạn"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group-enhanced">
                        <Form.Label className="form-label-enhanced">
                          <FaEnvelope /> Email *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          className="form-control-enhanced"
                          placeholder="Nhập địa chỉ email của bạn"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="form-group-enhanced">
                    <Form.Label className="form-label-enhanced">
                      <FaBuilding /> Tiêu đề *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      className="form-control-enhanced"
                      placeholder="Nhập tiêu đề câu hỏi"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="form-group-enhanced">
                    <Form.Label className="form-label-enhanced">
                      <FaPaperPlane /> Nội dung *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      className="form-control-enhanced"
                      placeholder="Nhập nội dung câu hỏi chi tiết..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Gửi câu hỏi
                      </>
                    )}
                  </Button>
                </Form>
              </div>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Contact;
