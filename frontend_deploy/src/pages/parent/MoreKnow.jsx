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

const MoreKnow = () => {
  return (
    <div>
      <div>
        <Container>
          <div>
            <h1>
              Tìm hiểu thêm
            </h1>
            <p>
              Khám phá các dịch vụ và tính năng của hệ thống
            </p>
          </div>
        </Container>
      </div>

      <div>
        <Container>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaHeartbeat />
                </div>
                <h3>Chăm sóc sức khỏe</h3>
                <p>
                  Hệ thống theo dõi sức khỏe toàn diện với các tính năng
                  khám sức khỏe định kỳ, tiêm chủng và theo dõi tình trạng sức khỏe.
                </p>
                <Link to="/parent/about">
                  <FaArrowRight />
                  Tìm hiểu thêm
                </Link>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaShieldAlt />
                </div>
                <h3>An toàn & Bảo mật</h3>
                <p>
                  Thông tin y tế được bảo vệ bằng công nghệ mã hóa tiên tiến,
                  đảm bảo tính riêng tư và an toàn tuyệt đối.
                </p>
                <Link to="/parent/privacy">
                  <FaArrowRight />
                  Chính sách bảo mật
                </Link>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaUserMd />
                </div>
                <h3>Đội ngũ y tế</h3>
                <p>
                  Đội ngũ y tá chuyên nghiệp với kinh nghiệm dày dặn trong
                  chăm sóc sức khỏe học đường và y tế cộng đồng.
                </p>
                <Link to="/parent/contact">
                  <FaArrowRight />
                  Liên hệ
                </Link>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaUsers />
                </div>
                <h3>Cộng đồng</h3>
                <p>
                  Kết nối giữa nhà trường, phụ huynh và đội ngũ y tế để
                  tạo nên môi trường chăm sóc sức khỏe tốt nhất.
                </p>
                <Link to="/parent/faq">
                  <FaArrowRight />
                  FAQ
                </Link>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaBookOpen />
                </div>
                <h3>Tài liệu hướng dẫn</h3>
                <p>
                  Hướng dẫn chi tiết cách sử dụng hệ thống và các thông tin
                  giáo dục sức khỏe dành cho học sinh.
                </p>
                <Link to="/parent/dashboard">
                  <FaArrowRight />
                  Xem bài viết
                </Link>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card>
                <div>
                  <FaGraduationCap />
                </div>
                <h3>Giáo dục sức khỏe</h3>
                <p>
                  Chương trình giáo dục sức khỏe toàn diện giúp học sinh
                  phát triển thói quen sống khỏe mạnh.
                </p>
                <Link to="/parent/settings">
                  <FaArrowRight />
                  Cài đặt
                </Link>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MoreKnow;
