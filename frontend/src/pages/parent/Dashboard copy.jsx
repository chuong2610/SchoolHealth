import React from "react";
import { Link } from "react-router-dom";
import 'antd/dist/reset.css';
import { Card, Typography, Button, Row, Col } from 'antd';
const { Title } = Typography;

const ParentDashboard = () => {
  return (
    <div>
      {/* Banner Section */}
      <section className="banner position-relative">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-lg-6">
              <div className="banner-content text-white">
                <h1 className="display-4 fw-bold mb-4">
                  Chăm sóc sức khỏe học đường
                </h1>
                <p className="lead mb-4">
                  Đồng hành cùng phụ huynh trong việc chăm sóc sức khỏe cho học
                  sinh
                </p>
                <a href="#" className="btn btn-primary btn-lg">
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Information Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Giới thiệu về trường học</h2>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="School Building"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <p className="lead mb-4">
                Trường chúng tôi tự hào là một trong những cơ sở giáo dục hàng
                đầu với hệ thống y tế học đường hiện đại và chuyên nghiệp.
              </p>
              <p className="mb-4">
                Với đội ngũ nhân viên y tế giàu kinh nghiệm, chúng tôi cam kết
                mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho học sinh.
              </p>
              <p>
                Phòng y tế được trang bị đầy đủ thiết bị y tế cần thiết và luôn
                sẵn sàng hỗ trợ học sinh trong mọi tình huống.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Blog Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Blog sức khỏe học đường</h2>
          <div className="row g-4">
            {/* Blog Post 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  className="card-img-top"
                  alt="Phòng tránh cúm"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x180?text=No+Image";
                  }}
                />
                <div className="card-body">
                  <small className="text-muted">15/03/2024</small>
                  <h5 className="card-title mt-2">
                    Cách phòng tránh bệnh cúm mùa cho học sinh
                  </h5>
                  <p className="card-text">
                    Những biện pháp phòng tránh bệnh cúm mùa hiệu quả cho học
                    sinh trong môi trường học đường...
                  </p>
                  <Link
                    to="/parent/blog/1"
                    className="btn btn-link text-primary p-0"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </div>
            {/* Blog Post 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="card-img-top"
                  alt="Dinh dưỡng học đường"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x180?text=No+Image";
                  }}
                />
                <div className="card-body">
                  <small className="text-muted">10/03/2024</small>
                  <h5 className="card-title mt-2">
                    Dinh dưỡng học đường: Xây dựng thực đơn lành mạnh
                  </h5>
                  <p className="card-text">
                    Hướng dẫn xây dựng thực đơn dinh dưỡng cân bằng cho học
                    sinh...
                  </p>
                  <Link
                    to="/parent/blog/2"
                    className="btn btn-link text-primary p-0"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </div>
            {/* Blog Post 3 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="card-img-top"
                  alt="Rửa tay đúng cách"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x180?text=No+Image";
                  }}
                />
                <div className="card-body">
                  <small className="text-muted">05/03/2024</small>
                  <h5 className="card-title mt-2">
                    Tầm quan trọng của việc rửa tay đúng cách
                  </h5>
                  <p className="card-text">
                    Hướng dẫn chi tiết về quy trình rửa tay đúng cách để phòng
                    tránh bệnh...
                  </p>
                  <Link
                    to="/parent/blog/3"
                    className="btn btn-link text-primary p-0"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParentDashboard;
