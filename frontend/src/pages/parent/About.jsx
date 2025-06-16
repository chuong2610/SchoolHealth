import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-5">
      {/* Tiêu đề */}
      <h1 className="text-center mb-4">
        Giới thiệu về Hệ thống Quản lý Y tế Học đường
      </h1>

      {/* Nội dung chính */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <p className="lead text-center">
            Hệ thống Quản lý Y tế Học đường là giải pháp toàn diện giúp nhà
            trường, phụ huynh và y tá quản lý sức khỏe học sinh một cách hiệu
            quả.
          </p>
        </div>
      </div>

      {/* Điểm nổi bật */}
      <div className="row mt-5">
        <div className="col-md-4 text-center">
          <i className="fas fa-heartbeat fa-3x text-primary mb-3"></i>
          <h5>Theo dõi sức khỏe</h5>
          <p className="text-muted">
            Cung cấp lịch sử sức khỏe và khai báo y tế nhanh chóng.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <i className="fas fa-pills fa-3x text-primary mb-3"></i>
          <h5>Quản lý thuốc</h5>
          <p className="text-muted">
            Hỗ trợ gửi và nhận thuốc giữa phụ huynh và y tá.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <i className="fas fa-bell fa-3x text-primary mb-3"></i>
          <h5>Thông báo kịp thời</h5>
          <p className="text-muted">
            Gửi thông báo về sức khỏe và sự kiện y tế ngay lập tức.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <Link to="/contact" className="btn btn-primary btn-lg">
          Liên hệ với chúng tôi
        </Link>
      </div>
    </div>
  );
};

export default About;
